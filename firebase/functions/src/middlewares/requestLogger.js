/* eslint-disable */
// Logs request headers and watches for abort events to help diagnose
// truncated multipart uploads.
const requestLogger = (req, res, next) => {
  try {
    const cl = req.headers["content-length"] || "(none)";
    const ct = req.headers["content-type"] || "(none)";
    console.info(
      "[requestLogger] %s %s content-length=%s content-type=%s",
      req.method,
      req.url,
      cl,
      ct,
    );

    req.on("aborted", () => {
      console.warn(
        "[requestLogger] request aborted by client for %s %s",
        req.method,
        req.url,
      );
    });

    req.on("end", () => {
      console.info("[requestLogger] request stream ended for %s %s", req.method, req.url);
    });

    if (req.socket) {
      req.socket.on("close", (hadError) => {
        console.warn(
          "[requestLogger] socket close for %s %s hadError=%s bytesRead=%d bytesWritten=%d",
          req.method,
          req.url,
          hadError,
          req.socket.bytesRead,
          req.socket.bytesWritten,
        );
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
