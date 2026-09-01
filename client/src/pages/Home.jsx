import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import IssueCard from "../components/IssueCard";

function Home() {
    const [issues, setIssues] = useState([]);
     const {
    user,
    isAuthenticated,
    loading,
    logout
} = useAuth();
   
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
            {loading && <p>Loading user...</p>}

{user && (
    <p>
        Welcome, {user.name}
    </p>
)}


            {isAuthenticated && (
 <button onClick={logout}>
        Logout
    </button>
)}
            <p>Total issues: {issues.length}</p>

           {issues.map((issue) => (
    <IssueCard
        key={issue._id}
        issue={issue}
    />
))}
   
        </div>
    );
}

export default Home;