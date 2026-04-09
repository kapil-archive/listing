
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    image: {
      data: Buffer,
      contentType: String,
    },
    thumb: {
      data: Buffer,
      contentType: String,
    },
    fileName: String,
    size: Number,
    favouriteCount:{
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


const Image = mongoose.model("Image", imageSchema);

module.exports = Image;