const pool = require("../db");

const getComments = async (req, res) => {
  try {
    const result = await pool.query(`
   SELECT 
  comments.id,
  comments.name,
  comments.comment,
  comments.created_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', replies.id,
        'text', replies.text,
        'owner_id', replies.owner_id,
        'created_at', replies.created_at
      )
    ) FILTER (WHERE replies.id IS NOT NULL),
    '[]'
  ) AS replies
FROM comments
LEFT JOIN replies
ON comments.id = replies.comment_id
GROUP BY comments.id
ORDER BY comments.created_at DESC
`);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch comments",
    });
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
    const { comment } = req.body;

    const result = await pool.query(
      `UPDATE comments
       SET comment=$1
       WHERE id=$2
       RETURNING *`,
      [comment, id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM comments
       WHERE id=$1`,
      [id],
    );

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
