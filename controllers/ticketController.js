const ticketService = require("../services/ticketService");
const aiService = require("../services/aiService");

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

const getTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getTickets(req.query);

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
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

const updateTicket = async (req, res) => {
    try {
        const ticket = await ticketService.updateTicket(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
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

const generateTicketSummary = async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);

        const summary = await aiService.generateTicketSummary(ticket);

        ticket.ai.summary = summary;

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Ticket summary generated successfully",
            data: {
                ticketId: ticket.ticketId,
                summary: ticket.ai.summary
            }
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
    getTicketById,
    updateTicket,
    generateTicketSummary
};