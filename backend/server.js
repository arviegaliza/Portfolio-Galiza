require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 MUST BE FIRST (before routes)
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes AFTER middleware
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});