require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   CORS FIX (IMPORTANT)
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "https://portfolio-arvie.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

/* =========================
   MIDDLEWARE
========================= */
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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});