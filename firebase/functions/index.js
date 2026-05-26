const {setGlobalOptions} = require("firebase-functions/v2");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
require("./src/common/firebaseAdmin");
require("dotenv").config();

const app = require("./src/app");

setGlobalOptions({maxInstances: 10});

// Firestore is initialized in src/common/firebaseAdmin.js. Simply forward
// requests to the Express app. Any DB errors should be handled per-controller.
exports.api = onRequest(async (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    logger.error("Function error", error);
    return res.status(500).json({success: false, message: "Internal error"});
  }
});
