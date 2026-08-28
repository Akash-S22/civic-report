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

        severity: {
            type: String,
            required: true,
            enum: ["low", "medium", "high", "critical"]
        },

        photoUrl: {
    type: String,
    required: true
},

        supportVotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        location: {
    type: {
        type: String,
        enum: ["Point"],
        required: true
    },

    coordinates: {
        type: [Number],
        required: true
    }
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
        },

  statusHistory: [
    {
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
            required: true
        },

        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        changedAt: {
            type: Date,
            default: Date.now
        }
    }
],

    },
    {
        timestamps: true
    }

);

issueSchema.index({
    location: "2dsphere"
});

module.exports = mongoose.model("Issue", issueSchema);