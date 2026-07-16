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

const createComment = async (req, res) => {
  try {
    const { name, comment, ownerId } = req.body;

    const result = await pool.query(
      `INSERT INTO comments (name, comment, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, comment, ownerId],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CREATE COMMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

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

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerId } = req.body;

    const result = await pool.query(
      `DELETE FROM comments
       WHERE id=$1 AND owner_id=$2
       RETURNING *`,
      [id, ownerId],
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        error: "You cannot delete this comment",
      });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
