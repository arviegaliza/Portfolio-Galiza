const express = require("express");
const router = express.Router();

const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const { createReply } = require("../controllers/replyController");

router.get("/", getComments);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

// Reply route
router.post("/:id/reply", createReply);

module.exports = router;
