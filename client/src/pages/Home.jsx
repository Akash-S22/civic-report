import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await api.get("/issues");

                setIssues(response.data.issues);
            } catch (error) {
                console.error(
                    "Failed to fetch issues:",
                    error
                );
            }
        };

        

        fetchIssues();
    }, []);

    return (
        <div>
            <h1>Civic Report</h1>

            <p>Total issues: {issues.length}</p>

            {issues.map((issue) => (
                <div key={issue._id}>
                    <h2>{issue.title}</h2>

                    <p>{issue.description}</p>

                    <p>
                        Severity: {issue.severity}
                    </p>

                    <p>
                        Supports: {issue.supportCount}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default Home;