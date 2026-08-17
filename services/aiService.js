const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");

const generateMockSummary = (ticket) => {
    return `Customer reported an issue regarding "${ticket.title}". ${ticket.description}`;
};

const generateOpenAISummary = async (ticket) => {
    if (!process.env.OPENAI_API_KEY) {
        const error = new Error("OpenAI API key is not configured");
        error.statusCode = 500;
        throw error;
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content:
                        "You summarize customer support tickets in one concise sentence."
                },
                {
                    role: "user",
                    content: `Title: ${ticket.title}\nDescription: ${ticket.description}`
                }
            ]
        });

        const summary = response.output_text?.trim();

        if (!summary) {
            const error = new Error("AI returned an empty response");
            error.statusCode = 502;
            throw error;
        }

        return summary;

    } catch (error) {
        console.error("OpenAI API error:", error.message);

        const aiError = new Error("AI service is currently unavailable");
        aiError.statusCode = 502;

        throw aiError;
    }
};

const generateClaudeSummary = async (ticket) => {
    if (!process.env.ANTHROPIC_API_KEY) {
        const error = new Error("Claude API key is not configured");
        error.statusCode = 500;
        throw error;
    }

    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });

        const response = await anthropic.messages.create({
            model: "claude-3-5-haiku-latest",
            max_tokens: 150,
            system:
                "You summarize customer support tickets in one concise sentence.",
            messages: [
                {
                    role: "user",
                    content: `Title: ${ticket.title}
Description: ${ticket.description}`
                }
            ]
        });

        const summary = response.content
            ?.filter((item) => item.type === "text")
            .map((item) => item.text)
            .join(" ")
            .trim();

        if (!summary) {
            const error = new Error("AI returned an empty response");
            error.statusCode = 502;
            throw error;
        }

        return summary;

    } catch (error) {
        console.error("Claude API error:", error.message);

        const aiError = new Error("AI service is currently unavailable");
        aiError.statusCode = 502;

        throw aiError;
    }
};

const generateTicketSummary = async (ticket) => {
    if (!ticket) {
        const error = new Error("Ticket data is required");
        error.statusCode = 400;
        throw error;
    }

    if (process.env.AI_PROVIDER === "openai") {
        return generateOpenAISummary(ticket);
    }

    if (process.env.AI_PROVIDER === "claude") {
        return generateClaudeSummary(ticket);
    }

    return generateMockSummary(ticket);
};

module.exports = {
    generateTicketSummary
};