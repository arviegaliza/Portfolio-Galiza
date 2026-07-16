const pool = require("../db");

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comments ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE COMMENT
const createComment = async (req, res) => {
  try {
    const { text, ownerId } = req.body;

    const result = await pool.query(
      `INSERT INTO comments (text, owner_id, time)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [text, ownerId, Date.now()],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE COMMENT
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const result = await pool.query(
      "UPDATE comments SET text=$1 WHERE id=$2 RETURNING *",
      [text, id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM comments WHERE id=$1", [id]);

    res.json({ message: "Deleted" });
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
