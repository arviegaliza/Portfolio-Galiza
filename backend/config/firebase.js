const admin = require("firebase-admin");
require("dotenv").config();

// Fix: Safely check if admin.apps exists AND has a length
if (!admin.apps || admin.apps.length === 0) {
  
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Clean up any stray characters, quotes, or literal text '\n' strings
    privateKey = privateKey.trim().replace(/["']/g, "").replace(/\\n/g, "");
    
    // Rebuild it into the exact layout OpenSSL demands
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`;
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
module.exports = { db };