const Issue = require("../models/Issue");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../middleware/asyncHandler");

const createIssue = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            severity,
            latitude,
            longitude
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !severity ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                message:
                    "Title, description, category, severity, latitude and longitude are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Issue photo is required"
            });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "civic-report/issues"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(req.file.buffer);
        });

        const issue = await Issue.create({
            title,
            description,
            category,
            severity,

            photoUrl: uploadResult.secure_url,

            location: {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)]
            },

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

const getIssues = asyncHandler(async (req, res) => {
    const { category, status } = req.query;

    const filter = {};

    const validCategories = [
        "garbage",
        "pothole",
        "road_damage",
        "streetlight",
        "drainage",
        "other"
    ];

    if (category) {
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                message: "Invalid category"
            });
        }

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
        hasSupported: req.user
            ? issue.supportVotes.some(
                  userId => userId.toString() === req.user.userId
              )
            : false,
        photoUrl: issue.photoUrl,
        location: issue.location,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt
    }));

    res.status(200).json({
        count: formattedIssues.length,
        issues: formattedIssues
    });
});

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
        hasSupported: req.user
            ? issue.supportVotes.some(
                  userId => userId.toString() === req.user.userId
              )
            : false,
        photoUrl: issue.photoUrl,
        location: issue.location,
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

const getNearbyIssues = async (req, res) => {
    try {
        const { latitude, longitude, distance = 1000 } = req.query;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);
        const maxDistance = Number(distance);

        if (
            Number.isNaN(lat) ||
            Number.isNaN(lng) ||
            Number.isNaN(maxDistance)
        ) {
            return res.status(400).json({
                message: "Latitude, longitude and distance must be numbers"
            });
        }

        const issues = await Issue.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: maxDistance
                }
            }
        })
            .populate("createdBy", "name email");

        res.status(200).json({
            count: issues.length,
            issues
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch nearby issues",
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
    supportIssue,
    getNearbyIssues
};