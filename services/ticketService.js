const Ticket = require("../models/ticketModel");

const createTicket = async (ticketData) => {
    const ticket = await Ticket.create(ticketData);

    return ticket;
};

module.exports = {
    createTicket
};