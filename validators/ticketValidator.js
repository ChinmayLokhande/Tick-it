const { z } = require("zod");

const createTicketSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required"),

    description: z
        .string()
        .trim()
        .min(1, "Description is required"),

    priority: z.enum(
        ["LOW", "MEDIUM", "HIGH"],
        {
            message: "Priority must be LOW, MEDIUM, or HIGH"
        }
    ),

    category: z
        .string()
        .trim()
        .min(1, "Category is required"),

    customer: z.object({
        name: z
            .string()
            .trim()
            .min(1, "Customer name is required"),

        email: z
            .string()
            .trim()
            .email("Invalid customer email")
    })
});

const updateTicketSchema = z
    .object({
        description: z
            .string()
            .trim()
            .min(1, "Description cannot be empty")
            .optional(),

        priority: z
            .enum(
                ["LOW", "MEDIUM", "HIGH"],
                {
                    message: "Priority must be LOW, MEDIUM, or HIGH"
                }
            )
            .optional(),

        category: z
            .string()
            .trim()
            .min(1, "Category cannot be empty")
            .optional(),

        status: z
            .enum(
                ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
                {
                    message: "Invalid ticket status"
                }
            )
            .optional(),

        comments: z
            .string()
            .trim()
            .min(1, "Comments cannot be empty")
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required for update"
        }
    );

module.exports = {
    createTicketSchema,
    updateTicketSchema
};