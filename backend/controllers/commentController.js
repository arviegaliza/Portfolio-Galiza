const pool = require("../db");

/* ================= GET COMMENTS ================= */
const getComments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comments ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= CREATE COMMENT ================= */
const createComment = async (req, res) => {
  try {
    const { name, message } = req.body;

    const result = await pool.query(
      "INSERT INTO comments (name, message) VALUES ($1, $2) RETURNING *",
      [name, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE COMMENT ================= */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const result = await pool.query(
      "UPDATE comments SET message=$1 WHERE id=$2 RETURNING *",
      [message, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE COMMENT ================= */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM comments WHERE id=$1", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};