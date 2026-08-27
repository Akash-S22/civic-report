const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
    try {
        const { title, description, category, severity } = req.body;

        if (!title || !description || !category || !severity) {
            return res.status(400).json({
                message: "Title, description, category and severity are required"
            });
        }

        const issue = await Issue.create({
            title,
            description,
            category,
            severity,
            createdBy: req.user.userId
        });

        res.status(201).json({
            message: "Issue created successfully",
            issue
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create issue",
            error: error.message
        });
    }
};

const getIssues = async (req, res) => {
    try {
        const { category, status } = req.query;
        
        const validCategories = [
    "garbage",
    "pothole",
    "road_damage",
    "streetlight",
    "drainage",
    "other"
];

if (category && !validCategories.includes(category)) {
    return res.status(400).json({
        message: "Invalid category"
    });
}

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        const issues = await Issue.find(filter)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

const formattedIssues = issues.map(issue => ({
    _id: issue._id,
    title: issue.title,
    description: issue.description,
    category: issue.category,
    severity: issue.severity,
    status: issue.status,
    createdBy: issue.createdBy,
    supportCount: issue.supportVotes.length,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt
}));

       res.status(200).json({
    count: formattedIssues.length,
    issues: formattedIssues
});
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch issues",
            error: error.message
        });
    }
};

const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findById(id)
            .populate("createdBy", "name email");

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

       res.status(200).json({
    issue: {
        _id: issue._id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        createdBy: issue.createdBy,
        supportCount: issue.supportVotes.length,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt
    }
});
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch issue",
            error: error.message
        });
    }
};

const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (issue.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this issue"
            });
        }

        const { title, description, category } = req.body;

        if (title !== undefined) {
            issue.title = title;
        }

        if (description !== undefined) {
            issue.description = description;
        }

        if (category !== undefined) {
            issue.category = category;
        }

        await issue.save();

        res.status(200).json({
            message: "Issue updated successfully",
            issue
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update issue",
            error: error.message
        });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (issue.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this issue"
            });
        }

        await issue.deleteOne();

        res.status(200).json({
            message: "Issue deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete issue",
            error: error.message
        });
    }
};

const supportIssue = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const updatedIssue = await Issue.findOneAndUpdate(
            {
                _id: id,
                supportVotes: {
                    $ne: req.user.userId
                }
            },
            {
                $addToSet: {
                    supportVotes: req.user.userId
                }
            },
            {
               returnDocument: 'after'
            }
        );

        if (!updatedIssue) {
            return res.status(409).json({
                message: "You have already supported this issue"
            });
        }

        res.status(200).json({
            message: "Issue supported successfully",
            supportCount: updatedIssue.supportVotes.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to support issue",
            error: error.message
        });
    }
};

module.exports = {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    supportIssue
};