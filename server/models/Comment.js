const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        type: {
            type: String,
            enum: ["user", "admin"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

commentSchema.index({
    issue: 1,
    createdAt: -1
});

module.exports = mongoose.model("Comment", commentSchema);