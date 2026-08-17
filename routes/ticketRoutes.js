const express = require("express");

const ticketController = require("../controllers/ticketController");
const validate = require("../middleware/validate");

const router = express.Router();

const {
    createTicketSchema,
    updateTicketSchema
} = require("../validators/ticketValidator");

router.post("/", validate(createTicketSchema), ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.patch("/:id", validate(updateTicketSchema), ticketController.updateTicket);
router.post("/:id/ai-summary",ticketController.generateTicketSummary);

module.exports = router;