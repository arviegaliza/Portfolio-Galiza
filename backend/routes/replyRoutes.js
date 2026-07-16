const express = require("express");
const router = express.Router();

const {
  createReply,
  updateReply,
  deleteReply,
} = require("../controllers/replyController");

router.post("/:commentId/reply", createReply);
router.put("/:id", updateReply);
router.delete("/:id", deleteReply);

module.exports = router;
