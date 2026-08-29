import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IssueDetails from "./pages/IssueDetails";
import CreateIssue from "./pages/CreateIssue";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/issues/:id"
                    element={<IssueDetails />}
                />

                <Route
                    path="/issues/create"
                    element={<CreateIssue />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;