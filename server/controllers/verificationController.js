const Issue = require("../models/Issue");
const Verification = require("../models/verification");
const cloudinary = require("../config/cloudinary");
const {
    shouldResolveIssue
} = require("../utils/verificationUtils");
const MAX_VERIFICATION_DISTANCE = 1000;

const verifyResolution = async (req, res) => {
    try {
        const { id } = req.params;
        const { result, latitude, longitude } = req.body;

        // 1. Validate input
        if (!result || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Result, latitude and longitude are required"
            });
        }

        if (!["resolved", "still_exists"].includes(result)) {
            return res.status(400).json({
                message: "Result must be resolved or still_exists"
            });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return res.status(400).json({
                message: "Latitude and longitude must be numbers"
            });
        }

        // 2. Find issue
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        // 3. Check issue status
        if (issue.status !== "community_verification") {
            return res.status(400).json({
                message: "This issue is not currently open for verification"
            });
        }

        // 4. Check for duplicate verification
        const existingVerification = await Verification.findOne({
            issue: id,
            user: req.user.userId
        });

        if (existingVerification) {
            return res.status(409).json({
                message: "You have already verified this issue"
            });
        }

        // 5. Check distance
        const nearbyIssue = await Issue.findOne({
            _id: id,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: MAX_VERIFICATION_DISTANCE
                }
            }
        });

        if (!nearbyIssue) {
            return res.status(403).json({
                message: "You must be within 1 km of the issue to verify it"
            });
        }

        // 6. Require photo
        if (!req.file) {
            return res.status(400).json({
                message: "After-photo is required"
            });
        }

        // 7. Upload photo to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "civic-report/verifications"
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

        // 8. Create verification
        const verification = await Verification.create({
            issue: id,
            user: req.user.userId,
            result,
            photoUrl: uploadResult.secure_url,
            location: {
                type: "Point",
                coordinates: [lng, lat]
            }
        });

        const verifications = await Verification.find({
    issue: id
});

const shouldResolve = shouldResolveIssue(verifications);

if (shouldResolve) {
    issue.status = "resolved";

    issue.statusHistory.push({
        status: "resolved",
        changedBy: null
    });

    await issue.save();
}

        res.status(201).json({
    message: "Verification submitted successfully",
    verification,
    issueStatus: issue.status
});

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit verification",
            error: error.message
        });
    }
};


module.exports = {
    verifyResolution
};