require("dotenv").config();

const express = require("express");
const cors = require("cors");
const admin = require('firebase-admin'); // ✅ default import

const app = express();

/* =========================
   ENV VARIABLES (SAFE)
========================= */
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  PORT,
} = process.env;

/* =========================
   SAFETY CHECK
========================= */
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error("❌ Missing Firebase environment variables in .env");
}




console.log("✅ Firebase Admin initialized");

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

/* =========================
   START SERVER
========================= */
const PORT_NUMBER = PORT || 5000;

app.listen(PORT_NUMBER, () => {
  console.log(`🚀 Server running on port ${PORT_NUMBER}`);
});