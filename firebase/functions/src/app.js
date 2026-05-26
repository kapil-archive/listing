const express = require("express");
const cors = require("cors");

const imageRoutes = require("./routes/image.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.status(200).send("Firebase API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// Central error handler to convert multipart parsing and multer errors
// into clearer HTTP responses for the client.
app.use((err, req, res, next) => {
  if (!err) return next();
  console.error("Unhandled error:", err && err.stack ? err.stack : err);

  // Multer signal for file size limits
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({message: "Uploaded file is too large"});
  }

  // Busboy truncated form error
  const _errMsg = err && err.message ? err.message : "";
  if (_errMsg.includes("Unexpected end of form")) {
    return res.status(400).json({
      message: "Incomplete multipart/form-data request",
    });
  }

  // Default fallback
  return res.status(500).json({message: err.message || "Server error"});
});

module.exports = app;
