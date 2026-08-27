const express = require("express");

const {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    supportIssue
} = require("../controllers/issueController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createIssue);
router.get("/", getIssues);
router.get("/:id", getIssueById);
router.put("/:id", protect, updateIssue);
router.delete("/:id", protect, deleteIssue);
router.post("/:id/support", protect, supportIssue);
module.exports = router;