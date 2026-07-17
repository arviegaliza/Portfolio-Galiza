const pool = require("../db");
const { apiInstance, SibApiV3Sdk } = require("../config/brevo");
const validator = require("validator");

// ================= CREATE CONTACT =================
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("BREVO KEY:", process.env.BREVO_API_KEY);
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
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.sender = {
        email: process.env.BREVO_USER,
        name: "Portfolio Website",
      };

      sendSmtpEmail.to = [
        {
          email: process.env.BREVO_USER,
        },
      ];

      sendSmtpEmail.replyTo = {
        email: cleanEmail,
        name: name,
      };

      sendSmtpEmail.subject = "📩 New Portfolio Contact Form Submission";

      sendSmtpEmail.htmlContent = `
<h2>New Contact Form Submission</h2>

<p><strong>Name:</strong> ${name}</p>

<p><strong>Email:</strong> ${cleanEmail}</p>

<p><strong>Message:</strong></p>

<div>
${message}
</div>
`;

      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log("✅ Brevo email sent successfully");
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
