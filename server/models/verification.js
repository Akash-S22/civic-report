const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
    {
        issue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        result: {
            type: String,
            enum: ["resolved", "still_exists"],
            required: true
        },

        photoUrl: {
            type: String,
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
        }
    },
    {
        timestamps: true
    }
);

verificationSchema.index({
    location: "2dsphere"
});

verificationSchema.index(
    {
        issue: 1,
        user: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Verification",
    verificationSchema
);