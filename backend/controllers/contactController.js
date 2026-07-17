const pool = require("../db");
const brevoClient = require("../config/brevo");
const Brevo = require("@getbrevo/brevo");
const validator = require("validator");

// ================= CREATE CONTACT =================
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const cleanEmail = email?.trim();

    // Validate fields
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
      `
      INSERT INTO contacts (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, cleanEmail, message],
    );

    // Send email using Brevo API
    try {
      const emailData = new Brevo.SendSmtpEmail();

      emailData.sender = {
        email: process.env.BREVO_USER,
        name: "Portfolio Website",
      };

      emailData.to = [
        {
          email: process.env.BREVO_USER,
        },
      ];

      emailData.replyTo = {
        email: cleanEmail,
        name: name,
      };

      emailData.subject = "📩 New Portfolio Contact Form Submission";

      emailData.htmlContent = `
        <h2>New Contact Form Submission</h2>

        <p>
          <strong>Name:</strong> ${name}
        </p>

        <p>
          <strong>Email:</strong> ${cleanEmail}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <div style="
          padding:10px;
          border:1px solid #ddd;
          background:#f9f9f9;
        ">
          ${message}
        </div>

        <br>

        <small>
          Sent from your Portfolio Website
        </small>
      `;

      const response = await brevoClient.sendTransacEmail(emailData);

      console.log("✅ BREVO EMAIL SENT");
      console.log(response);
    } catch (mailError) {
      console.error("===== BREVO EMAIL ERROR =====");
      console.error(mailError);

      return res.status(500).json({
        success: false,
        message: "Email sending failed.",
        error: mailError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      contact: result.rows[0],
    });
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

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET CONTACT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts.",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};
