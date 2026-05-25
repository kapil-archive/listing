// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const errorHandler = require("../common/errorHandler");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id);
            if (!user) {
                return errorHandler({ statusCode: 401, message: "User not found" }, req, res);
            }
            req.user = user;
            next();
        } catch (error) {
            return errorHandler({ statusCode: 401, message: "Not authorized" }, req, res);
        }
    }

    if (!token) {
        return errorHandler({ statusCode: 401, message: "No token provided" }, req, res);
    }
};

const admin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return errorHandler({ statusCode: 403, message: "Admin access required" }, req, res);
    }
    next();
};

module.exports = { protect, admin };