require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db"); // ✅ ADD THIS

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://portfoliorvqwry.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
const contactRoutes = require("./routes/contactRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/api/contact", contactRoutes);
app.use("/api/comments", commentRoutes);

/* ================= TEST ROUTES ================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database is connected",
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});