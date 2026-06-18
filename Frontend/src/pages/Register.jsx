import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    name: "",
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

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      login(data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("register error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="container auth-container">
      <div className="glass-panel auth-card">
        <form onSubmit={handleSubmit}>
          <h2 style={{textAlign: "center", marginBottom: "2rem"}}>Create Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary" style={{marginTop: "1rem"}}>
            Join TaskFlow
          </button>
          
          <p style={{textAlign: "center", color: "var(--text-secondary)", marginTop: "1rem"}}>
            Already have an account?{" "}
            <span
              style={{color: "var(--accent-primary)", cursor: "pointer", fontWeight: "500"}}
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;