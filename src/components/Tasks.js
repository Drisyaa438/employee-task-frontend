
import { useEffect, useState } from "react";
import { getTasks, updateTask, createTask } from "../api/taskApi";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    deadline: "",
  });

  const role = localStorage.getItem("role") || "Employee"; 
  // const userId = parseInt(localStorage.getItem("user_id")) || 1;

  //Fetch all tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      const taskArray = Array.isArray(data) ? data : data.results || [];
      setTasks(taskArray);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Mark task as completed
  const handleComplete = async (task) => {
    if (!window.confirm("Mark this task as Completed?")) return;

    try {
      await updateTask(task.id, { status: "Completed" });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Could not update the task. Try again.");
    }
  };

  //Create new task (Admin only)
  const handleCreate = async () => {
    if (!newTask.title || !newTask.description || !newTask.assigned_to) {
      alert("Please fill all fields before creating a task.");
      return;
    }

    try {
      await createTask({
        title: newTask.title,
        description: newTask.description,
        assigned_to: parseInt(newTask.assigned_to),
        deadline: newTask.deadline || null,
      });

      // Clear input fields
      setNewTask({ title: "", description: "", assigned_to: "", deadline: "" });
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Error creating task. Check backend or employee ID.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("role");
              localStorage.removeItem("user_id");
              localStorage.removeItem("username");
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Task Management</h2>
          </div>
        </div>

        {/*Create Task Form*/}
        {role === "Admin" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create New Task
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Task Title"
                className="bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Assign to Employee ID"
                className="bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTask.assigned_to}
                onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
              />
              <input
                type="date"
                placeholder="Deadline"
                className="bg-white/10 border border-white/30 rounded-xl p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
              <button
                onClick={handleCreate}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Task
              </button>
            </div>
          </div>
        )}

        {/*Task List Table*/}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="bg-white/5">
            <div className="grid grid-cols-7 gap-4 p-4 text-white/80 font-semibold text-sm uppercase">
              <div>ID</div>
              <div>Title</div>
              <div>Description</div>
              <div>Status</div>
              <div>Deadline</div>
              <div>Assigned To</div>
              <div>Action</div>
            </div>
          </div>

          {/*Task Rows*/}
          <div className="divide-y divide-white/10">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-7 gap-4 p-4 hover:bg-white/5 transition">
                  <div className="text-white">{task.id}</div>
                  <div className="text-white">{task.title}</div>
                  <div className="text-white/80 truncate">{task.description || "-"}</div>
                  <div className="text-white">
                    {task.status === "Completed" ? (
                      <span className="text-green-400 font-semibold">Completed</span>
                    ) : (
                      <span className="text-yellow-400 font-semibold">{task.status}</span>
                    )}
                  </div>
                  <div className="text-white/80">{task.deadline || "—"}</div>
                  <div className="text-white/80">{task.assigned_to_username || task.assigned_to}</div>
                  <div>
                    {task.status !== "Completed" && role === "Employee" && (
                      <button
                        onClick={() => handleComplete(task)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-white/60">No tasks available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
