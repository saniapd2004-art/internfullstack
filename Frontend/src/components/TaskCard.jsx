function TaskCard({ task, onEdit, onDelete, toggleComplete }) {
  const getBadgeClass = () => {
    switch (task.priority) {
      case "High":
        return "badge-high";
      case "Medium":
        return "badge-medium";
      case "Low":
        return "badge-low";
      default:
        return "badge-medium";
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "Completed":
        return "var(--success)";
      case "In Progress":
        return "var(--accent-primary)";
      default:
        return "var(--danger)";
    }
  };

  return (
    <div className="glass-panel task-card">
      <div className="task-header">
        <div>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-desc" style={{ marginTop: "0.25rem" }}>
            {task.description || "No description provided."}
          </p>
        </div>

        <span className={`badge ${getBadgeClass()}`}>
          {task.priority}
        </span>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.9rem",
        }}
      >
        <span
          style={{
            color: getStatusColor(),
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: getStatusColor(),
            }}
          ></span>
          {task.status}
        </span>

        <span style={{ color: "var(--text-secondary)" }}>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No Date"}
        </span>
      </div>

      <div className="task-actions">
        <button
          className="btn-complete"
          onClick={() =>
            toggleComplete(task._id, task.status)
          }
        >
          {task.status === "Completed"
            ? "Mark Pending"
            : "Mark Complete"}
        </button>

        <button
          className="btn-edit"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="btn-delete"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;