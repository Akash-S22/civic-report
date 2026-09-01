import { Link } from "react-router-dom";

function IssueCard({ issue }) {
    return (
        <div>
            {issue.photoUrl && (
                <img
                    src={issue.photoUrl}
                    alt={issue.title}
                    width="250"
                />
            )}

            <h2>{issue.title}</h2>

            <p>{issue.description}</p>

            <p>
                Category: {issue.category}
            </p>

            <p>
                Severity: {issue.severity}
            </p>

            <p>
                Status: {issue.status}
            </p>

            <p>
                Supports: {issue.supportCount}
            </p>

            <Link to={`/issues/${issue._id}`}>
                View Issue
            </Link>
        </div>
    );
}

export default IssueCard;