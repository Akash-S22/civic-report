require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
    res.json({
        message: "Civic Report API is working"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});