const pool = require("../db");
const createTransporter = require("../config/mailer");
const validator = require("validator");

// ================= CREATE CONTACT =================
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const cleanEmail = email?.trim();

    // Validate input
    if (!name || !cleanEmail || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate email
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Save to PostgreSQL
    const result = await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, cleanEmail, message],
    );

    // Create a fresh transporter
    const transporter = createTransporter();

    try {
      const info = await transporter.sendMail({
        from: `"Portfolio Website" <${process.env.BREVO_USER}>`,
        to: process.env.BREVO_USER, // Send notification to yourself
        replyTo: cleanEmail, // So you can reply directly to the visitor
        subject: "📩 New Portfolio Contact Form Submission",
        html: `
      <h2>New Contact Form Submission</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${cleanEmail}</p>

      <p><strong>Message:</strong></p>

      <div style="padding:10px; border:1px solid #ddd; background:#f9f9f9;">
        ${message}
      </div>

      <br>

      <small>Sent from your Portfolio Website</small>
    `,
      });

      console.log("✅ Email sent successfully!");
      console.log(info);

      return res.status(201).json({
        success: true,
        message: "Message sent successfully.",
        contact: result.rows[0],
      });
    } catch (mailError) {
      console.error("===== SENDMAIL ERROR =====");
      console.error(mailError);

      return res.status(201).json({
        success: true,
        message:
          "Your message has been saved successfully, but the email notification could not be sent.",
        contact: result.rows[0],
      });
    }
  } catch (err) {
    console.error("===== CONTACT ERROR =====");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

// ================= GET CONTACTS =================
const getContacts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY id DESC");

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get Contacts Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts.",
      error: err.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};
