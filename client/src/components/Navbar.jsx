import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();

    return (
        <nav>
            <Link to="/">
                Civic Report
            </Link>

            <div>
                <Link to="/">
                    Home
                </Link>

                {!isAuthenticated && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <Link to="/issues/create">
                            Report Issue
                        </Link>

                        {user?.role === "admin" && (
                            <Link to="/admin">
                                Admin Dashboard
                            </Link>
                        )}

                        <button onClick={logout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;