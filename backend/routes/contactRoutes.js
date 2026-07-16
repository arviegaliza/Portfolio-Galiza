const express = require("express");
const router = express.Router();

const {
  createContact,
  getContacts,
} = require("../controllers/contactController");

router.get("/", getContacts);
router.post("/", createContact);

module.exports = router;
