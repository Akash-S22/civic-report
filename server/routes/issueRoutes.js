const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    supportIssue,
    getNearbyIssues
} = require("../controllers/issueController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("photo"), createIssue);
router.get("/", getIssues);
router.get("/nearby", getNearbyIssues);
router.get("/:id", getIssueById);
router.put("/:id", protect, updateIssue);
router.delete("/:id", protect, deleteIssue);
router.post("/:id/support", protect, supportIssue);
module.exports = router;