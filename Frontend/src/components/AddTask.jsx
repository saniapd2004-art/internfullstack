import { useState } from "react";
import axios from "axios";

function AddTask({ onTaskAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
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
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskAdded(res.data);

      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel" style={{padding: "2rem", marginBottom: "2rem"}}>
      <h3 style={{marginBottom: "1.5rem"}}>Create New Task</h3>
      <form onSubmit={handleSubmit} style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem"}}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{gridColumn: "1 / -1"}}
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          style={{gridColumn: "1 / -1", minHeight: "100px", resize: "vertical"}}
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary" style={{gridColumn: "1 / -1", marginTop: "0.5rem"}}>
          Add Task
        </button>
      </form>
    </div>
  );
}

export default AddTask;