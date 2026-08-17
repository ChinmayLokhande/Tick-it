const Ticket = require("../models/ticketModel");
const Counter = require("../models/counterModel");

const createTicket = async (ticketData) => {
    const counter = await Counter.findOneAndUpdate(
        { name: "ticket" },
        { $inc: { sequence: 1 } },
        {
            new: true,
            upsert: true
        }
    );

    const ticket = await Ticket.create({
        ...ticketData,
        ticketId: `TKT-${counter.sequence}`
    });

    return ticket;
};

const getTickets = async () => {
    const tickets = await Ticket.find()
        .sort({ createdAt: -1 });

    return tickets;
};

const mongoose = require("mongoose");

const getTicketById = async (ticketId) => {
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    return ticket;
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById
};