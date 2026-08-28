const MIN_VERIFICATIONS = 5;
const REQUIRED_RESOLVED_PERCENTAGE = 70;

const shouldResolveIssue = (verifications) => {
    if (verifications.length < MIN_VERIFICATIONS) {
        return false;
    }

    const resolvedCount = verifications.filter(
        verification => verification.result === "resolved"
    ).length;

    const resolvedPercentage =
        (resolvedCount / verifications.length) * 100;

    return resolvedPercentage >= REQUIRED_RESOLVED_PERCENTAGE;
};

module.exports = {
    MIN_VERIFICATIONS,
    REQUIRED_RESOLVED_PERCENTAGE,
    shouldResolveIssue
};