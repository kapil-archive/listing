// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const errorHandler = require("../common/errorHandler");
const {db} = require("../common/firebaseAdmin");

const usersCol = db.collection("users");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET,
      );

      const userDoc = await usersCol.doc(decoded.id).get();
      if (!userDoc || !userDoc.exists) {
        return errorHandler(
            {statusCode: 401, message: "User not found"},
            req,
            res,
        );
      }

      req.user = {
        id: userDoc.id,
        ...userDoc.data(),
      };
      next();
    } catch (error) {
      return errorHandler(
          {statusCode: 401, message: "Not authorized"},
          req,
          res,
      );
    }
  }

  if (!token) {
    return errorHandler(
        {statusCode: 401, message: "No token provided"},
        req,
        res,
    );
  }
};

const admin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return errorHandler(
        {statusCode: 403, message: "Admin access required"},
        req,
        res,
    );
  }
  next();
};

module.exports = {protect, admin};
