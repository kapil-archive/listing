
const { uploadImage, getAllImages, updateImageStats } = require("../controllers/image.controller");
const { upload } = require("../middlewares/upload.middleware");

const express = require("express");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getAllImages);
router.put("/updateStats", updateImageStats);

module.exports = router;