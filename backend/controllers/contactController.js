const transporter = require("../config/mailer");
const admin = require("firebase-admin");

const sendMessage = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /* =========================
       FIREBASE SAVE (optional)
    ========================= */
    await admin.firestore().collection("contacts").add({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    /* =========================
       EMAIL SEND
    ========================= */
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    console.log("EMAIL SENT:", info.messageId);

    return res.status(200).json({
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};

module.exports = { sendMessage };