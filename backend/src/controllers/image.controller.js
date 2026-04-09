

const Image = require("../models/image.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");
const sharp = require("sharp");

const uploadImage = async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body || {};

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let resolvedCategoryId = categoryId;

    // Support direct ObjectId payload.
    if (resolvedCategoryId && !mongoose.Types.ObjectId.isValid(resolvedCategoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    // Support category name payload by creating/finding a category.
    if (!resolvedCategoryId && categoryName) {
      const trimmedName = categoryName.trim();

      if (!trimmedName) {
        return res.status(400).json({ message: "Invalid categoryName" });
      }

      const category = await Category.findOneAndUpdate(
        { name: trimmedName },
        { $setOnInsert: { name: trimmedName } },
        { new: true, upsert: true }
      );

      resolvedCategoryId = category._id;
    }

    if (!resolvedCategoryId) {
      return res.status(400).json({ message: "categoryId or categoryName is required" });
    }


    // Generate thumbnail (e.g., 200x200)
    const thumbBuffer = await sharp(req.file.buffer)
      .resize(200, 200, { fit: 'inside' })
      .toBuffer();

    const image = await Image.create({
      categoryId: resolvedCategoryId,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      thumb: {
        data: thumbBuffer,
        contentType: req.file.mimetype,
      },
      fileName: req.file.originalname,
      size: req.file.size,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (err) {
    console.error("Image upload failed:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await Image.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    const formattedImages = images.map((item) => ({
      _id: item._id,
      fileName: item.fileName,
      size: item.size,
      category: item.categoryId?.name || "Unknown",
      contentType: item.image?.contentType,
      createdAt: item.createdAt,
      favouriteCount: item.favouriteCount || 0,
      downloadCount: item.downloadCount || 0,
      // imageUrl: item.image?.data && item.image?.contentType
      //   ? `data:${item.image.contentType};base64,${item.image.data.toString("base64")}`
      //   : null,
      thumbUrl: item.thumb?.data && item.thumb?.contentType
        ? `data:${item.thumb.contentType};base64,${item.thumb.data.toString("base64")}`
        : null,
    }));

    res.status(200).json({
      success: true,
      data: formattedImages,
    });
  } catch (err) {
    console.error("Fetching images failed:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateImageStats = async (req, res) => {
  try {
    // const { imageId, isLiked, isDisliked, isDownload } = req.body || {};
    const { imageId, isLiked, isDownload } = req.body || {};

    if (!imageId) {
      return res.status(400).json({ message: "Invalid imageId" });
    }
    const image = await Image.findById(imageId);
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (isLiked) {
      image.favouriteCount = (image.favouriteCount || 0) + 1;
    }
    else if (isDownload) {
      image.downloadCount = (image.downloadCount || 0) + 1;
    }

    await image.save();

    res.status(200).json({
      success: true,
      data: {
        favouriteCount: image.favouriteCount,
        downloadCount: image.downloadCount,
      },
    });
  } catch (err) {
    console.error("Updating images stats failed:", err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { uploadImage, getAllImages, updateImageStats };