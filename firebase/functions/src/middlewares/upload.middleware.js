
const multer = require("multer");

const storage = multer.memoryStorage();

console.log("Upload called");


const upload = multer({ storage });

module.exports = { upload };