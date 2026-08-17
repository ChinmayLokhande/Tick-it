const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.json({
        message: "Tick-It server is running 🚀"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});