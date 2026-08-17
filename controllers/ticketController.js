const ticketService = require("../services/ticketService");

const createTicket = async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: ticket
        });
    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

const getTickets = async (req, res, next) => {
    try {
        const tickets = await ticketService.getTickets();

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        next(error);
    }
};

const getTicketById = async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById
};