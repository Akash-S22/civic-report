const Verification = require("../models/verification");

const getVerificationStats = async (issueId) => {
    const stats = await Verification.aggregate([
        {
            $match: {
                issue: new mongoose.Types.ObjectId(issueId)
            }
        },
        {
            $group: {
                _id: null,

                total: {
                    $sum: 1
                },

                resolved: {
                    $sum: {
                        $cond: [
                            { $eq: ["$result", "resolved"] },
                            1,
                            0
                        ]
                    }
                },

                stillExists: {
                    $sum: {
                        $cond: [
                            { $eq: ["$result", "still_exists"] },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    if (stats.length === 0) {
        return {
            total: 0,
            resolved: 0,
            stillExists: 0,
            resolvedPercentage: 0
        };
    }

    const result = stats[0];

    return {
        total: result.total,
        resolved: result.resolved,
        stillExists: result.stillExists,
        resolvedPercentage:
            (result.resolved / result.total) * 100
    };
};

module.exports = {
    getVerificationStats
};