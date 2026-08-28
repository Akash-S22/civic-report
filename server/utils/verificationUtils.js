const MIN_VERIFICATIONS = 5;
const REQUIRED_RESOLVED_PERCENTAGE = 70;

const shouldResolveIssue = (stats) => {
    if (stats.total < MIN_VERIFICATIONS) {
        return false;
    }

    return stats.resolvedPercentage >= REQUIRED_RESOLVED_PERCENTAGE;
};

module.exports = {
    MIN_VERIFICATIONS,
    REQUIRED_RESOLVED_PERCENTAGE,
    shouldResolveIssue
};