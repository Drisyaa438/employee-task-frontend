
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../src/api/taskApi";

export default function Dashboard({ role: propRole, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

 
  const role = propRole || localStorage.getItem("role");
  const userId = parseInt(localStorage.getItem("user_id"));
  const username = localStorage.getItem("username") || "User";

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      let taskArray = Array.isArray(data)
        ? data
        : data.results && Array.isArray(data.results)
        ? data.results
        : [];

      //  Role based filtering
      if (role === "Admin") {
        taskArray = taskArray.filter((task) => task.assigned_by === userId);
      }

      // SuperAdmin
      setTasks(taskArray);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
  fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  //  Task counts 
  const totalTasks = tasks.length || 0;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">
                {role === "SuperAdmin" ? "SuperAdmin Dashboard" :
                 role === "Admin" ? "Admin Dashboard" :
                 "User Dashboard"}
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
          <p className="text-white/90 text-lg">
            Welcome, {username}! Your role: <strong>{role}</strong>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Total Tasks", count: totalTasks, color: "blue" },
            { title: "Completed Tasks", count: completedTasks, color: "green" },
            { title: "Pending Tasks", count: pendingTasks, color: "yellow" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-white">{item.title}</h2>
              <p className="text-3xl mt-2 text-white font-bold">{item.count}</p>
            </div>
          ))}
        </div>

        
        {role === "Admin" && (
          <div className="flex flex-wrap gap-4">
            {/* <button
              onClick={() => navigate("/tasks")}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Manage All Tasks
            </button> */}
            <button
              onClick={() => navigate("/users")}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-4 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Manage Employees
            </button>
             <button
            onClick={() => navigate("/tasks")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View & Assign Tasks
          </button>
          

          </div>
        )}

        {/* {role === "Admin" && (
          <button
            onClick={() => navigate("/tasks")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View 
          </button>
          
          

        )} */}
      </div>
    </div>
  );
}
