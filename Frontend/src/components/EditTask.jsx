import { useState } from "react";
import axios from "axios";

function EditTask({ task, onClose, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate?.split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskUpdated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <h3 style={{marginBottom: "1.5rem"}}>Edit Task</h3>
        <form onSubmit={handleSave} style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem"}}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            style={{gridColumn: "1 / -1"}}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            style={{gridColumn: "1 / -1", minHeight: "100px"}}
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

          <div className="modal-actions" style={{gridColumn: "1 / -1"}}>
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;