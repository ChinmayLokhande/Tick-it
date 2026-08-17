const Ticket = require("../models/ticketModel");
const Counter = require("../models/counterModel");
const mongoose = require("mongoose");

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

const getTickets = async (filters) => {
    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.priority) {
        query.priority = filters.priority;
    }

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.search) {
        query.$or = [
            {
                title: {
                    $regex: filters.search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: filters.search,
                    $options: "i"
                }
            }
        ];
    }

    const tickets = await Ticket.find(query)
        .sort({ createdAt: -1 });

    return tickets;
};

const getTicketById = async (ticketId) => {
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    return ticket;
};

const updateTicket = async (ticketId, updateData) => {
    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    if (updateData.status) {
        const allowedTransitions = {
            OPEN: ["IN_PROGRESS"],
            IN_PROGRESS: ["RESOLVED"],
            RESOLVED: ["CLOSED"],
            CLOSED: []
        };

        const allowedStatuses = allowedTransitions[ticket.status];

        if (!allowedStatuses.includes(updateData.status)) {
            const error = new Error(
                `Invalid status transition: ${ticket.status} → ${updateData.status}`
            );

            error.statusCode = 400;
            throw error;
        }
    }

    const allowedFields = [
        "description",
        "priority",
        "category",
        "status",
        "comments"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            updates[field] = updateData[field];
        }
    });

    const updatedTicket = await Ticket.findOneAndUpdate(
        { ticketId },
        { $set: updates },
        {
            new: true,
            runValidators: true
        }
    );

    return updatedTicket;
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket
};