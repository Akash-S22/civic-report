import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function IssueDetails() {
    const { id } = useParams();

    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await api.get(`/issues/${id}`);

                setIssue(response.data.issue);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load issue"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIssue();
    }, [id]);

    if (loading) {
        return <p>Loading issue...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!issue) {
        return <p>Issue not found.</p>;
    }

    return (
        <div>
            <h1>{issue.title}</h1>

            <img
                src={issue.photoUrl}
                alt={issue.title}
                width="400"
            />

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

            <p>
                Reported by: {issue.createdBy?.name}
            </p>
        </div>
    );
}

export default IssueDetails;