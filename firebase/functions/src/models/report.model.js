const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    fileName: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;