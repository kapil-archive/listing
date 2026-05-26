
const multer = require("multer");

const storage = multer.memoryStorage();

// Limit single file size to 20MB to avoid truncated uploads and provide
// a clear error when files exceed expectations. Adjust as needed.
const upload = multer({
  storage,
  limits: {fileSize: 20 * 1024 * 1024},
});

module.exports = {upload};
