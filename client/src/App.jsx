import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IssueDetails from "./pages/IssueDetails";
import CreateIssue from "./pages/CreateIssue";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

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
    element={
        <ProtectedRoute>
            <CreateIssue />
        </ProtectedRoute>
    }
/>

       <Route
    path="/admin"
    element={
        <AdminRoute>
            <AdminDashboard />
        </AdminRoute>
    }
/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;