const express = require("express");
const { register, login, forgotPassword, resetPassword, changePassword } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);
router.post("/password/change", protect, changePassword);

module.exports = router;