require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const issueRoutes = require("./routes/issueRoutes");

const app = express();

app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/issues", issueRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});