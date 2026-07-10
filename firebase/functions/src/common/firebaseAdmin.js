const admin = require("firebase-admin");

if (!admin.apps.length) {
  try {
    // Initialize with default credentials in Cloud Functions.
    // Use a service account locally when GOOGLE_APPLICATION_CREDENTIALS is set.
    admin.initializeApp();
  } catch (e) {
    console.error("Firebase admin initialization error", e);
    throw e;
  }
}

const db = admin.firestore();
let bucket = null;
try {
  if (admin.storage) {
    bucket = admin.storage().bucket();
  }
} catch (e) {
  // Storage not configured locally — continue without bucket support.
  bucket = null;
}
const FieldValue = admin.firestore.FieldValue;

module.exports = {admin, db, bucket, FieldValue};
