const {setGlobalOptions} = require("firebase-functions/v2");
const {onRequest} = require("firebase-functions/v2/https");
require("./src/common/firebaseAdmin");
require("dotenv").config();

const app = require("./src/app");

setGlobalOptions({maxInstances: 10});

// Forward HTTP requests directly to Express. Avoid wrapping in an async
// function so streaming multipart bodies are not finalized prematurely.
exports.api = onRequest(app);
