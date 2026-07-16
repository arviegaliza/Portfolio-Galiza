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

// COMMENTS
router.get("/", getComments);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

// REPLIES
router.post("/:commentId/reply", createReply);
router.put("/reply/:id", updateReply);
router.delete("/reply/:id", deleteReply);

module.exports = router;
