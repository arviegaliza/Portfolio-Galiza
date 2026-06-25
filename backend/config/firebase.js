const admin = require("firebase-admin");

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // fix private key newline issue (Render-safe)
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

} catch (error) {
  console.error("❌ Invalid FIREBASE_SERVICE_ACCOUNT JSON:", error.message);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };