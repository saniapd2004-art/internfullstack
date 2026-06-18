import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pending = total - completed;

  return (
    <div className="container">
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem"}}>
        <h2 style={{marginBottom: 0}}>Dashboard Overview</h2>
      </div>

      <div className="summary-cards">
        <div className="glass-panel stat-card">
          <h3>Total Tasks</h3>
          <p>{total}</p>
        </div>

        <div className="glass-panel stat-card" style={{borderTop: "4px solid var(--success)"}}>
          <h3>Completed</h3>
          <p style={{color: "var(--success)"}}>{completed}</p>
        </div>

        <div className="glass-panel stat-card" style={{borderTop: "4px solid var(--accent-primary)"}}>
          <h3>Pending</h3>
          <p style={{color: "var(--accent-primary)"}}>{pending}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;