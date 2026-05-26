
const crypto = require("crypto");
const errorHandler = require("../common/errorHandler");
const generateToken = require("../common/generateToken");
const sendEmail = require("../common/sendEmail");
const bcrypt = require("bcryptjs");
const {db, FieldValue} = require("../common/firebaseAdmin");

const usersCol = db.collection("users");

const register = async (req, res) => {
  try {
    const {name, email, password} = req.body || {};

    if (!name || !email || !password) {
      return errorHandler(
          {
            statusCode: 400,
            message: "Name, email and password are required",
          },
          req,
          res,
      );
    }
    if (password.length < 6) {
      return errorHandler(
          {
            statusCode: 400,
            message: "Password must be at least 6 characters long",
          },
          req,
          res,
      );
    }
    const q = await usersCol.where("email", "==", email).limit(1).get();
    const existingUserDoc = q.docs[0];
    if (existingUserDoc && existingUserDoc.exists) {
      return errorHandler(
          {statusCode: 400, message: "Email already exists"},
          req,
          res,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = await usersCol.add({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      createdAt: FieldValue.serverTimestamp(),
    });

    await userRef.get();

    res.status(201).json({message: "User registered successfully"});
  } catch (error) {
    console.error("Error in register controller", error);
    errorHandler(error, req, res);
  }
};


const login = async (req, res) => {
  const {email, password} = req.body || {};

  if (!email || !password) {
    return errorHandler(
        {statusCode: 400, message: "Email and password are required"},
        req,
        res,
    );
  }

  const q = await usersCol.where("email", "==", email).limit(1).get();
  const existingUserDoc = q.docs[0];
  if (!existingUserDoc || !existingUserDoc.exists) {
    return errorHandler(
        {statusCode: 400, message: "Invalid email or password"},
        req,
        res,
    );
  }
  const existingUser = existingUserDoc.data();
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return errorHandler(
        {statusCode: 400, message: "Invalid email or password"},
        req,
        res,
    );
  }
  if (!existingUser.isAdmin) {
    return errorHandler(
        {statusCode: 403, message: "You dont have admin privileges"},
        req,
        res,
    );
  }
  const token = generateToken(existingUserDoc.id);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      isAdmin: existingUser.isAdmin,
      name: existingUser.name,
      email: existingUser.email,
    },
  });
};

const forgotPassword = async (req, res) => {
  try {
    const {email} = req.body || {};
    if (!email) {
      return errorHandler(
          {statusCode: 400, message: "Email is required"},
          req,
          res,
      );
    }

    const q = await usersCol.where("email", "==", email).limit(1).get();
    const existingUserDoc = q.docs[0];
    const existingUser =
      existingUserDoc && existingUserDoc.exists ? existingUserDoc.data() : null;
    if (!existingUser || !existingUser.isAdmin) {
      return errorHandler(
          {
            statusCode: 400,
            message: "No admin account found with that email",
          },
          req,
          res,
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    await usersCol.doc(existingUserDoc.id).update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    });

    const clientUrl = process.env.CLIENT_URL ||
      "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${token}`;
    const emailText =
      `Use the following link to reset your admin password.
This link expires in one hour:

${resetUrl}`;

    const emailSent = await sendEmail({
      to: existingUser.email,
      subject: "Admin Password Reset Request",
      text: emailText,
      html: [
        "<p>Use the following link to reset your admin password.",
        "This link expires in one hour.</p>",
        `<p><a href="${resetUrl}">${resetUrl}</a></p>`,
      ].join(" "),
    });

    const response = {
      message: "Password reset instructions sent. Check your email.",
    };
    if (!emailSent) {
      response.message = (
        "Password reset token generated. Use the link returned by " +
        "the API to reset your password."
      );
      response.resetUrl = resetUrl;
      response.token = token;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in forgotPassword controller", error);
    errorHandler(error, req, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const {token, password} = req.body || {};
    if (!token || !password) {
      return errorHandler(
          {
            statusCode: 400,
            message: "Token and new password are required",
          },
          req,
          res,
      );
    }

    const q = await usersCol
        .where("resetPasswordToken", "==", token)
        .where("resetPasswordExpires", ">", Date.now())
        .limit(1)
        .get();
    const existingUserDoc = q.docs[0];
    const existingUser =
      existingUserDoc && existingUserDoc.exists ? existingUserDoc.data() : null;

    if (!existingUser) {
      return errorHandler(
          {statusCode: 400, message: "Invalid or expired reset token"},
          req,
          res,
      );
    }

    if (password.length < 6) {
      return errorHandler(
          {
            statusCode: 400,
            message: "Password must be at least 6 characters long",
          },
          req,
          res,
      );
    }

    await usersCol.doc(existingUserDoc.id).update({
      password: await bcrypt.hash(password, 10),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.status(200).json({message: "Password has been reset successfully"});
  } catch (error) {
    console.error("Error in resetPassword controller", error);
    errorHandler(error, req, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const {newPassword} = req.body || {};
    if (!newPassword) {
      return errorHandler(
          {statusCode: 400, message: "New password is required"},
          req,
          res,
      );
    }

    if (newPassword.length < 6) {
      return errorHandler(
          {
            statusCode: 400,
            message: "Password must be at least 6 characters long",
          },
          req,
          res,
      );
    }

    const userId = req.user.id;
    const userDoc = await usersCol.doc(userId).get();
    if (!userDoc || !userDoc.exists) {
      return errorHandler(
          {statusCode: 404, message: "User not found"},
          req,
          res,
      );
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await usersCol.doc(userId).update({password: hashed});

    res.status(200).json({message: "Password changed successfully"});
  } catch (error) {
    console.error("Error in changePassword controller", error);
    errorHandler(error, req, res);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};
