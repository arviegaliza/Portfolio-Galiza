const transporter = require("../config/mailer");
const { db } = require("../config/firebase");

const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // SAVE TO FIRESTORE
    await db.collection("contacts").add({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    // SEND EMAIL
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return res.status(200).json({
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { sendMessage };