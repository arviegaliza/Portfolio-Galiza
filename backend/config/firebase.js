const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

// 1. Check if the app is already initialized safely using the official helper
if (getApps().length === 0) {
  
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Clean up any stray quotes or literal text '\n' markers
    privateKey = privateKey.trim().replace(/["']/g, "").replace(/\\n/g, "");
    
    // Reconstruct the key layout OpenSSL demands if it's missing headers
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`;
    }
  }

  // 2. Initialize using modular methods
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

// 3. Export Firestore instance
const db = getFirestore();
module.exports = { db };