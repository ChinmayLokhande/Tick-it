const ticketService = require("../services/ticketService");

const createTicket = async (req, res, next) => {
    try {
        const ticket = await ticketService.createTicket(req.body);

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: ticket
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTicket
};