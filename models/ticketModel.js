const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
            default: "OPEN"
        },

        customer: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            }
        },

        ai: {
            summary: {
                type: String,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;