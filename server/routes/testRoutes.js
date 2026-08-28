const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/protected", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});

router.get("/admin", protect, adminOnly, (req, res) => {
    res.json({
        message: "You accessed an admin route",
        user: req.user
    });
});

module.exports = router;