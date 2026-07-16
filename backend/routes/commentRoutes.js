const express = require("express");
const router = express.Router();
const { createReply } = require("../controllers/replyController");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.get("/", getComments);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

router.post("/:id/reply", createReply);
module.exports = router;
