const nodemailer = require("nodemailer");

function createTransporter() {
  console.log("===== BREVO SMTP CONFIG =====");
  console.log("BREVO_USER:", process.env.BREVO_USER);
  console.log("BREVO_PASS exists:", !!process.env.BREVO_PASS);

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    logger: true,
    debug: true,
  });

  return transporter;
}

module.exports = createTransporter;
