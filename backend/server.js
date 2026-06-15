require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://portfolio-arvie.netlify.app"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});