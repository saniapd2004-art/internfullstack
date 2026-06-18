import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    login(data.token);

    navigate("/dashboard");
  };

  return (
    <div className="container auth-container">
      <div className="glass-panel auth-card">
        <form onSubmit={handleSubmit}>
          <h2 style={{textAlign: "center", marginBottom: "2rem"}}>Welcome Back</h2>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary" style={{marginTop: "1rem"}}>
            Login to TaskFlow
          </button>
          
          <p style={{textAlign: "center", color: "var(--text-secondary)", marginTop: "1rem"}}>
            Don't have an account?{" "}
            <span
              style={{color: "var(--accent-primary)", cursor: "pointer", fontWeight: "500"}}
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;