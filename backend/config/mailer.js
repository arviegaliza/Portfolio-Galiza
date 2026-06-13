require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// optional: verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email service ready ✔");
  }
});

module.exports = transporter;