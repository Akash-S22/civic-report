const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { verifyResolution } = require("../controllers/verificationController");

const {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    supportIssue,
    getNearbyIssues,
    updateIssueStatus,
    checkIssueProximity
} = require("../controllers/issueController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("photo"), createIssue);
router.get("/", getIssues);
router.get("/nearby", getNearbyIssues);
router.get(
    "/:id/proximity",
    protect,
    checkIssueProximity
);
router.post(
    "/:id/verify",
    protect,
    upload.single("photo"),
    verifyResolution
);
router.get("/:id", getIssueById);
router.put("/:id", protect, updateIssue);
router.delete("/:id", protect, deleteIssue);
router.post("/:id/support", protect, supportIssue);
router.patch(
    "/:id/status",
    protect,
    adminOnly,
    updateIssueStatus
);
module.exports = router;