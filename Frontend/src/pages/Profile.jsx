import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { name: formData.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateUser(res.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="container"><h2 style={{textAlign: "center"}}>Loading Profile...</h2></div>;

  return (
    <div className="container auth-container">
      <div className="glass-panel auth-card" style={{maxWidth: "500px"}}>
        <h2 style={{textAlign: "center", marginBottom: "2rem"}}>Your Profile</h2>
        
        {message && (
          <div style={{
            padding: "1rem", 
            marginBottom: "1rem", 
            borderRadius: "8px", 
            background: message.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
            color: message.type === "success" ? "#34d399" : "#f87171",
            textAlign: "center"
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div style={{marginBottom: "1rem"}}>
            <label style={{display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)"}}>Email (Read Only)</label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{opacity: 0.6, cursor: "not-allowed"}}
            />
          </div>

          <div style={{marginBottom: "1.5rem"}}>
            <label style={{display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)"}}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
