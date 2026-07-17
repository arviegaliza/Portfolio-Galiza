const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // helps avoid some local SSL issues
  },
});

// Better verification (async-safe + clearer logs)
const initMailer = async () => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP is ready to send emails");
    console.log("📧 Using account:", process.env.EMAIL_USER);
  } catch (error) {
    console.log("❌ Gmail SMTP FAILED:");
    console.log(error);
  }
};

initMailer();

module.exports = transporter;
