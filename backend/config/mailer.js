const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });
}

// Verify SMTP when the server starts
(async () => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const transporter = createTransporter();
    await transporter.verify();

    console.log("✅ Gmail SMTP is ready");
  } catch (err) {
    console.error("❌ Gmail SMTP FAILED");
    console.error(err);
  }
})();

module.exports = createTransporter;
