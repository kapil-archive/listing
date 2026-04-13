
const { uploadImage, getAllImages, updateImageStats, reportImage } = require("../controllers/image.controller");
const { upload } = require("../middlewares/upload.middleware");

const express = require("express");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.post("/report", upload.single("image"), reportImage);
router.get("/", getAllImages);
router.put("/updateStats", updateImageStats);

module.exports = router;