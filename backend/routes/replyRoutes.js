const express = require("express");
const router = express.Router();

const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const {
  createReply,
  updateReply,
  deleteReply,
} = require("../controllers/replyController");

// ================= COMMENTS =================

// Get all comments
router.get("/", getComments);

// Create comment
router.post("/", createComment);

// Update comment
router.put("/:id", updateComment);

// Delete comment
router.delete("/:id", deleteComment);

// ================= REPLIES =================

// Create reply
router.post("/:commentId/reply", createReply);

// Update reply
router.put("/reply/:id", updateReply);

// Delete reply
router.delete("/reply/:id", deleteReply);

module.exports = router;
