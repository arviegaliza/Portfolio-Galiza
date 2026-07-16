require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: "https://portfolio-galiza.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

/* ================= ROUTES ================= */

const contactRoutes = require("./routes/contactRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/api/contact", contactRoutes);
app.use("/api/comments", commentRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

/* ================= POSTGRES CHECK ================= */

const checkDatabase = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("🟢 PostgreSQL Connected");
    console.log("⏰ DB Time:", result.rows[0].now);
  } catch (err) {
    console.error("🔴 PostgreSQL Connection Failed:");
    console.error(err.message);
  }
};

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await checkDatabase();
});
