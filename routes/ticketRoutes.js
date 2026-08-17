const express = require("express");

const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.post("/", ticketController.createTicket);

module.exports = router;