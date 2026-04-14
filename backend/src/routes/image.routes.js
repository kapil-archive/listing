
const { uploadImage, getAllImages, updateImageStats, getOriginalImage, reportImage, getBlockedImages } = require("../controllers/image.controller");
const { upload } = require("../middlewares/upload.middleware");
const { protect, admin } = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

router.post("/upload", protect, admin, upload.single("image"), uploadImage);
router.post("/report", upload.single("image"), reportImage);
router.get("/", getAllImages);
router.get("/blocked", protect, admin, getBlockedImages);
router.get("/:imageId/original", protect, admin, getOriginalImage);
router.put("/updateStats", updateImageStats);

module.exports = router;