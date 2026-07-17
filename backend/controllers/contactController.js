const pool = require("../db");
const validator = require("validator");
const brevoClient = require("../config/brevo");
const brevo = require("@getbrevo/brevo");

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
      `
      INSERT INTO contacts 
      (name, email, message)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [name, cleanEmail, message],
    );

    console.log("===== CONTACT SAVED =====");
    console.log(result.rows[0]);

    // ================= BREVO EMAIL =================

    const sendSmtpEmail = new brevo.SendSmtpEmail();

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

      <p>
        <strong>Name:</strong>
        ${name}
      </p>

      <p>
        <strong>Email:</strong>
        ${cleanEmail}
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
        Sent from Portfolio Website
      </small>
    `;

    console.log("===== SENDING BREVO EMAIL =====");

    const emailResponse = await brevoClient.sendTransacEmail(sendSmtpEmail);

    console.log("===== EMAIL SENT =====");
    console.log(emailResponse);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      contact: result.rows[0],
    });
  } catch (error) {
    console.error("===== CONTACT ERROR =====");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ================= GET CONTACTS =================

const getContacts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY id DESC");

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch contacts",
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};
