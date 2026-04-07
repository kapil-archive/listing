
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
    fileName: String,
    size: Number,
  },
  { timestamps: true }
);


const Image = mongoose.model("Image", imageSchema);

module.exports = Image;