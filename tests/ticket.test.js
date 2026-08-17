const request = require("supertest");

const app = require("../app");

const ticketService = require("../services/ticketService");
const aiService = require("../services/aiService");

jest.mock("../services/ticketService");
jest.mock("../services/aiService");

describe("Ticket API", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/tickets", () => {

        test("should create a ticket successfully", async () => {

            const mockTicket = {
                ticketId: "TKT-1",
                title: "Unable to login",
                description: "Customer cannot login",
                priority: "HIGH",
                category: "Authentication",
                status: "OPEN",
                customer: {
                    name: "John Doe",
                    email: "john@example.com"
                }
            };

            ticketService.createTicket.mockResolvedValue(mockTicket);

            const response = await request(app)
                .post("/api/tickets")
                .send({
                    title: "Unable to login",
                    description: "Customer cannot login",
                    priority: "HIGH",
                    category: "Authentication",
                    customer: {
                        name: "John Doe",
                        email: "john@example.com"
                    }
                });

            expect(response.statusCode).toBe(201);

            expect(response.body.success).toBe(true);

            expect(response.body.data.ticketId).toBe("TKT-1");

            expect(ticketService.createTicket).toHaveBeenCalledTimes(1);
        });

        test("should return 400 when required fields are missing", async () => {

            const response = await request(app)
                .post("/api/tickets")
                .send({
                    title: "Unable to login"
                });

            expect(response.statusCode).toBe(400);

            expect(response.body.success).toBe(false);

            expect(response.body.message).toBe("Validation failed");

            expect(ticketService.createTicket).not.toHaveBeenCalled();
        });

        test("should return 400 when priority is invalid", async () => {

            const response = await request(app)
                .post("/api/tickets")
                .send({
                    title: "Unable to login",
                    description: "Customer cannot login",
                    priority: "URGENT",
                    category: "Authentication",
                    customer: {
                        name: "John Doe",
                        email: "john@example.com"
                    }
                });

            expect(response.statusCode).toBe(400);

            expect(response.body.success).toBe(false);

            expect(ticketService.createTicket).not.toHaveBeenCalled();
        });

        test("should return 400 when customer email is invalid", async () => {

            const response = await request(app)
                .post("/api/tickets")
                .send({
                    title: "Unable to login",
                    description: "Customer cannot login",
                    priority: "HIGH",
                    category: "Authentication",
                    customer: {
                        name: "John Doe",
                        email: "invalid-email"
                    }
                });

            expect(response.statusCode).toBe(400);

            expect(response.body.success).toBe(false);

            expect(ticketService.createTicket).not.toHaveBeenCalled();
        });

    });

    describe("GET /api/tickets", () => {

        test("should retrieve all tickets", async () => {

            const mockTickets = [
                {
                    ticketId: "TKT-2",
                    title: "Payment failed",
                    priority: "HIGH",
                    category: "Payment",
                    status: "OPEN"
                },
                {
                    ticketId: "TKT-1",
                    title: "Unable to login",
                    priority: "MEDIUM",
                    category: "Authentication",
                    status: "IN_PROGRESS"
                }
            ];

            ticketService.getTickets.mockResolvedValue(mockTickets);

            const response = await request(app)
                .get("/api/tickets");

            expect(response.statusCode).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.count).toBe(2);

            expect(response.body.data).toHaveLength(2);

            expect(ticketService.getTickets).toHaveBeenCalledTimes(1);
        });

        test("should retrieve tickets using filters", async () => {

            const mockTickets = [
                {
                    ticketId: "TKT-3",
                    title: "Login issue",
                    priority: "HIGH",
                    category: "Authentication",
                    status: "OPEN"
                }
            ];

            ticketService.getTickets.mockResolvedValue(mockTickets);

            const response = await request(app)
                .get("/api/tickets")
                .query({
                    status: "OPEN",
                    priority: "HIGH",
                    category: "Authentication"
                });

            expect(response.statusCode).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.data).toHaveLength(1);

            expect(ticketService.getTickets).toHaveBeenCalledWith({
                status: "OPEN",
                priority: "HIGH",
                category: "Authentication"
            });
        });

    });

    describe("GET /api/tickets/:id", () => {

        test("should retrieve a ticket by ID", async () => {

            const mockTicket = {
                ticketId: "TKT-1",
                title: "Unable to login",
                description: "Customer cannot login",
                priority: "HIGH",
                category: "Authentication",
                status: "OPEN"
            };

            ticketService.getTicketById.mockResolvedValue(mockTicket);

            const response = await request(app)
                .get("/api/tickets/TKT-1");

            expect(response.statusCode).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.data.ticketId).toBe("TKT-1");

            expect(ticketService.getTicketById)
                .toHaveBeenCalledWith("TKT-1");
        });

        test("should return 404 when ticket does not exist", async () => {

            const error = new Error("Ticket not found");
            error.statusCode = 404;

            ticketService.getTicketById.mockRejectedValue(error);

            const response = await request(app)
                .get("/api/tickets/TKT-999");

            expect(response.statusCode).toBe(404);

            expect(response.body.success).toBe(false);

            expect(response.body.message).toBe("Ticket not found");
        });

    });

    describe("PATCH /api/tickets/:id", () => {

        test("should update a ticket successfully", async () => {

            const mockTicket = {
                ticketId: "TKT-1",
                title: "Unable to login",
                description: "Issue is being investigated",
                priority: "HIGH",
                category: "Authentication",
                status: "IN_PROGRESS",
                comments: "Support team is investigating"
            };

            ticketService.updateTicket.mockResolvedValue(mockTicket);

            const response = await request(app)
                .patch("/api/tickets/TKT-1")
                .send({
                    status: "IN_PROGRESS",
                    comments: "Support team is investigating"
                });

            expect(response.statusCode).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.data.status)
                .toBe("IN_PROGRESS");

            expect(ticketService.updateTicket)
                .toHaveBeenCalledWith(
                    "TKT-1",
                    {
                        status: "IN_PROGRESS",
                        comments: "Support team is investigating"
                    }
                );
        });

        test("should return 400 when update body is empty", async () => {

            const response = await request(app)
                .patch("/api/tickets/TKT-1")
                .send({});

            expect(response.statusCode).toBe(400);

            expect(response.body.success).toBe(false);

            expect(ticketService.updateTicket)
                .not.toHaveBeenCalled();
        });

        test("should return 400 when status is invalid", async () => {

            const response = await request(app)
                .patch("/api/tickets/TKT-1")
                .send({
                    status: "INVALID_STATUS"
                });

            expect(response.statusCode).toBe(400);

            expect(response.body.success).toBe(false);

            expect(ticketService.updateTicket)
                .not.toHaveBeenCalled();
        });

        test("should return 400 for an invalid status transition", async () => {

            const error = new Error(
                "Invalid status transition: OPEN → RESOLVED"
            );

            error.statusCode = 400;

            ticketService.updateTicket.mockRejectedValue(error);

            const response = await request(app)
                .patch("/api/tickets/TKT-1")
                .send({
                    status: "RESOLVED"
                });

            expect(response.statusCode).toBe(400);

            expect(response.body.success).toBe(false);

            expect(response.body.message)
                .toBe("Invalid status transition: OPEN → RESOLVED");
        });

    });

    test("should generate an AI summary successfully", async () => {

    const mockTicket = {
        ticketId: "TKT-1",
        title: "Unable to login",
        description: "Customer cannot login",
        ai: {
            summary: null
        },

        save: jest.fn().mockResolvedValue(true)
    };

    const mockSummary =
        "Customer is unable to log into the application.";

    ticketService.getTicketById
        .mockResolvedValue(mockTicket);

    aiService.generateTicketSummary
        .mockResolvedValue(mockSummary);

    const response = await request(app)
        .post("/api/tickets/TKT-1/ai-summary");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.ticketId)
        .toBe("TKT-1");

    expect(response.body.data.summary)
        .toBe(mockSummary);

    expect(mockTicket.ai.summary)
        .toBe(mockSummary);

    expect(mockTicket.save)
        .toHaveBeenCalledTimes(1);

    expect(ticketService.getTicketById)
        .toHaveBeenCalledWith("TKT-1");

    expect(aiService.generateTicketSummary)
        .toHaveBeenCalledWith(mockTicket);
});

});