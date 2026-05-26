
const multer = require("multer");
const {Readable} = require("stream");

const storage = multer.memoryStorage();

// Limit single file size to 20MB to avoid truncated uploads and provide
// a clear error when files exceed expectations. Adjust as needed.
const baseUpload = multer({
  storage,
  limits: {fileSize: 20 * 1024 * 1024},
});

const wrapWithRawBodySupport = (multerMiddleware) => (req, res, next) => {
  // In Cloud Functions, body may already be buffered on req.rawBody.
  if (!req.rawBody || !Buffer.isBuffer(req.rawBody)) {
    return multerMiddleware(req, res, next);
  }

  const replayReq = new Readable({
    read() {
      this.push(req.rawBody);
      this.push(null);
    },
  });

  replayReq.headers = req.headers;
  replayReq.method = req.method;
  replayReq.url = req.url;
  replayReq.httpVersion = req.httpVersion;
  replayReq.socket = req.socket;

  return multerMiddleware(replayReq, res, (err) => {
    if (err) return next(err);
    req.body = replayReq.body || req.body;
    req.file = replayReq.file || req.file;
    req.files = replayReq.files || req.files;
    return next();
  });
};

const upload = {
  single: (fieldName) =>
    wrapWithRawBodySupport(baseUpload.single(fieldName)),
  fields: (fieldConfigs) =>
    wrapWithRawBodySupport(baseUpload.fields(fieldConfigs)),
  any: () => wrapWithRawBodySupport(baseUpload.any()),
};

module.exports = {upload};
