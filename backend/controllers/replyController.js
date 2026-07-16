const createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, ownerId } = req.body;

    const result = await pool.query(
      `INSERT INTO replies (comment_id, text, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, text, ownerId],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
