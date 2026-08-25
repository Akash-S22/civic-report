const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "garbage",
                "pothole",
                "road_damage",
                "streetlight",
                "drainage",
                "other"
            ]
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "reported",
                "under_review",
                "acknowledged",
                "in_progress",
                "community_verification",
                "resolved",
                "rejected"
            ],
            default: "reported"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Issue", issueSchema);