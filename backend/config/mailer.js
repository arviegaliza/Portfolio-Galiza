// Save to PostgreSQL
const result = await pool.query(
  "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
  [name, cleanEmail, message],
);

// Try to send email
try {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: cleanEmail,
    subject: "📩 New Portfolio Contact Form Submission",
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${cleanEmail}</p>
      <p><strong>Message:</strong></p>
      <div>${message}</div>
    `,
  });

  console.log("Email sent!");
} catch (mailError) {
  console.error("Email failed:", mailError.message);
  // Don't throw the error
}

return res.status(201).json({
  success: true,
  message: "Message received successfully.",
  contact: result.rows[0],
});
