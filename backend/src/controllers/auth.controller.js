
const errorHandler = require("../common/errorHandler");
const generateToken = require("../common/generateToken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return errorHandler({ statusCode: 400, message: "Name, email and password are required" }, req, res);
        }
        if (password.length < 6) {
            return errorHandler({ statusCode: 400, message: "Password must be at least 6 characters long" }, req, res);
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorHandler({ statusCode: 400, message: "Email already exists" }, req, res);
        }

        const existingAdmin = await User.findOne({ isAdmin: true });
        const adminSecret = process.env.ADMIN_REG_CODE;
        const isAdmin = !existingAdmin || (adminSecret && req.body.adminCode === adminSecret);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin,
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in register controller", error);
        errorHandler(error, req, res);
    }
};


const login = async (req, res) => {
    
    const { email, password } = req.body || {};

    if (!email || !password) {
        return errorHandler({ statusCode: 400, message: "Email and password are required" }, req, res);
    }
   
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return errorHandler({ statusCode: 400, message: "Invalid email or password" }, req, res);
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return errorHandler({ statusCode: 400, message: "Invalid email or password" }, req, res);
    }
    const token = generateToken(existingUser._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      },
    });
};

module.exports = {
    register,
    login
};