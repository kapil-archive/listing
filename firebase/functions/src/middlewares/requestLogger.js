/* eslint-disable */
// Logs request headers and watches for abort events to help diagnose
// truncated multipart uploads.
const requestLogger = (req, res, next) => {
  try {
    const cl = req.headers["content-length"] || "(none)";
    console.info(
      "[requestLogger] %s %s content-length=%s",
      req.method,
      req.url,
      cl,
    );

    req.on("aborted", () => {
      console.warn(
        "[requestLogger] request aborted by client for %s %s",
        req.method,
        req.url,
      );
    });

    if (req.socket) {
      req.socket.on("close", (hadError) => {
        if (hadError) {
          console.warn(
            "[requestLogger] socket closed with error for %s %s",
            req.method,
            req.url,
          );
        }
      });
    }
  } catch (e) {
    console.error(
      "[requestLogger] failed to attach listeners",
      e && e.stack ? e.stack : e,
    );
  }

  return next();
};

module.exports = requestLogger;
