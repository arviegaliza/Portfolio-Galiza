const pool = require("../db");

const createReply = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    const { commentId } = req.params;
    const { text, ownerId } = req.body;

    const result = await pool.query(
      `INSERT INTO replies (comment_id, text, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [commentId, text, ownerId],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

// UPDATE REPLY
const updateReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const result = await pool.query(
      `UPDATE replies
       SET text=$1
       WHERE id=$2
       RETURNING *`,
      [text, id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// DELETE REPLY
const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM replies
       WHERE id=$1`,
      [id],
    );

    res.json({
      message: "Reply deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createReply,
  updateReply,
  deleteReply,
};
