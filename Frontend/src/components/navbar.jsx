import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">TaskFlow</div>
      <ul className="nav-links">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/tasks">Tasks</Link>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link to="/profile" title="View Profile" style={{ textDecoration: "none" }}>
                <div style={{
                  width: "35px", height: "35px", borderRadius: "50%",
                  background: "var(--accent-primary)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", fontSize: "1.2rem", border: "2px solid var(--card-border)",
                  boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)"
                }}>
                  {getInitials(user?.name)}
                </div>
              </Link>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register" className="btn-primary">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;