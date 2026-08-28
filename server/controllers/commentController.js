const Comment = require("../models/Comment");
const Issue = require("../models/Issue");

const createComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Comment message is required"
            });
        }

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const comment = await Comment.create({
            issue: id,
            user: req.user.userId,
            message: message.trim(),
            type: req.user.role === "admin" ? "admin" : "user"
        });

        const populatedComment = await comment.populate(
            "user",
            "name email role"
        );

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
};

const getComments = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const comments = await Comment.find({
            issue: id
        })
            .populate("user", "name role")
            .sort({ createdAt: 1 });

        res.status(200).json({
            count: comments.length,
            comments
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch comments",
            error: error.message
        });
    }
};

module.exports = {
    createComment,
    getComments
};