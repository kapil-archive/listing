const express = require("express");
const cors = require("cors");

const imageRoutes = require("./routes/image.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());

const jsonParser = express.json({limit: "20mb"});
const urlencodedParser = express.urlencoded({extended: true, limit: "20mb"});

app.use((req, res, next) => {
  const contentType = (req.headers["content-type"] || "").toLowerCase();
  if (contentType.startsWith("multipart/form-data")) {
    return next();
  }

  jsonParser(req, res, (err) => {
    if (err) return next(err);
    urlencodedParser(req, res, next);
  });
});

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
