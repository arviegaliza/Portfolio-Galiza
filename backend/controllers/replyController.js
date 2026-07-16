const pool = require("../db");

const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, ownerId } = req.body;

    const result = await pool.query(
      `INSERT INTO replies (comment_id, reply, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, reply, ownerId],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReply,
};
