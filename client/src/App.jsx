import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/issues")
            .then((response) => response.json())
            .then((data) => {
                setIssues(data.issues);
            })
            .catch((error) => {
                console.error("Failed to fetch issues:", error);
            });
    }, []);

    return (
        <div>
            <h1>Civic Report</h1>

            <p>Total issues: {issues.length}</p>

            {issues.map((issue) => (
                <div key={issue._id}>
                    <h2>{issue.title}</h2>
                    <p>{issue.description}</p>
                    <p>Severity: {issue.severity}</p>
                    <p>Supports: {issue.supportCount}</p>
                </div>
            ))}
        </div>
    );
}

export default App;