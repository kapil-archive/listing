

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Use aggregation pipeline for better performance: count + fetch in single query
    const [result] = await Image.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryData",
              },
            },
            {
              $project: {
                _id: 1,
                fileName: 1,
                size: 1,
                createdAt: 1,
                favouriteCount: { $ifNull: ["$favouriteCount", 0] },
                downloadCount: { $ifNull: ["$downloadCount", 0] },
                category: {
                  $ifNull: [{ $arrayElemAt: ["$categoryData.name", 0] }, "Unknown"],
                },
                contentType: "$image.contentType",
                thumbData: "$thumb.data",
                thumbContentType: "$thumb.contentType",
              },
            },
          ],
        },
      },
    ]);

    const total = result.metadata[0]?.total || 0;
    const images = result.data || [];

    // Format images with base64 conversion only for thumb
    const formattedImages = images.map((item) => ({
      _id: item._id,
      fileName: item.fileName,
      size: item.size,
      category: item.category,
      contentType: item.contentType,
      createdAt: item.createdAt,
      favouriteCount: item.favouriteCount,
      downloadCount: item.downloadCount,
      thumbUrl: item.thumbData && item.thumbContentType
        ? `data:${item.thumbContentType};base64,${item.thumbData.toString("base64")}`
        : null,
    }));

    res.status(200).json({
      success: true,
      data: formattedImages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
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

    let originalImage = null;
    
    
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (isLiked) {
      image.favouriteCount = (image.favouriteCount || 0) + 1;
    }
    else if (isDownload) {
      image.downloadCount = (image.downloadCount || 0) + 1;
      // originalImage = image.image;
      originalImage = image.image?.data && image.image?.contentType
        ? `data:${image.image.contentType};base64,${image.image.data.toString("base64")}`
        : null;
    }

    await image.save();

    res.status(200).json({
      success: true,
      data: {
        favouriteCount: image.favouriteCount,
        downloadCount: image.downloadCount,
        originalImage
      },
    });
  } catch (err) {
    console.error("Updating images stats failed:", err);
    res.status(500).json({ message: err.message });
  }
}

// Ensure database indexes for optimal query performance
// Add these indexes to your MongoDB:
// db.images.createIndex({ createdAt: -1 })
// db.images.createIndex({ categoryId: 1 })
// db.categories.createIndex({ name: 1 })

module.exports = { uploadImage, getAllImages, updateImageStats };