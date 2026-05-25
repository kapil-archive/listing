const {setGlobalOptions} = require("firebase-functions/v2");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./src/app");

setGlobalOptions({maxInstances: 10});

let mongoConnectionPromise;

const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(process.env.MONGO_URI)
        .then(() => {
          logger.info("Connected to MongoDB");
        })
        .catch((error) => {
          mongoConnectionPromise = null;
          throw error;
        });
  }

  await mongoConnectionPromise;
};

exports.api = onRequest(async (req, res) => {
  try {
    await connectToMongo();
    return app(req, res);
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});
