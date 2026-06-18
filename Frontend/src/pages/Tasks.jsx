

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import TaskCard from "../components/TaskCard";
import AddTask from "../components/AddTask";
import EditTask from "../components/EditTask";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    toast.success("Task added successfully");
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );

    toast.success("Task updated successfully");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3000/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );

      toast.success("Task deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      const newStatus =
        currentStatus === "Completed"
          ? "Pending"
          : "Completed";

      const res = await axios.patch(
        `http://localhost:3000/api/tasks/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? res.data : task
        )
      );

      toast.success(
        newStatus === "Completed"
          ? "Task marked complete"
          : "Task marked pending"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  /* Counts */

  const totalCount = tasks.length;

  const pendingCount = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const highPriorityCount = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  /* Search + Filter */

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesFilter = true;

    switch (activeFilter) {
      case "Pending":
        matchesFilter =
          task.status !== "Completed";
        break;

      case "Completed":
        matchesFilter =
          task.status === "Completed";
        break;

      case "High Priority":
        matchesFilter =
          task.priority === "High";
        break;

      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Tasks...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Tasks</h2>

      <AddTask onTaskAdded={handleTaskAdded} />

      {selectedTask && (
        <EditTask
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Search + Filters */}

      <div className="controls-container">
        <div className="search-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === "All"
              ? "active"
              : ""
              }`}
            onClick={() => setActiveFilter("All")}
          >
            All
            <span className="filter-count">
              {totalCount}
            </span>
          </button>

          <button
            className={`filter-tab ${activeFilter === "Pending"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setActiveFilter("Pending")
            }
          >
            Pending
            <span className="filter-count">
              {pendingCount}
            </span>
          </button>

          <button
            className={`filter-tab ${activeFilter === "Completed"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setActiveFilter("Completed")
            }
          >
            Completed
            <span className="filter-count">
              {completedCount}
            </span>
          </button>

          <button
            className={`filter-tab ${activeFilter === "High Priority"
              ? "active"
              : ""
              }`}
            onClick={() =>
              setActiveFilter(
                "High Priority"
              )
            }
          >
            High Priority
            <span className="filter-count">
              {highPriorityCount}
            </span>
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <h3>No matching tasks found</h3>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={setSelectedTask}
              onDelete={handleDelete}
              toggleComplete={toggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;