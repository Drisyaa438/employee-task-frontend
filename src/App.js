
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./Dashboard"; 
import Tasks from "./components/Tasks"; 
import EmployeesPage from "./components/EmployeesPage"; // For Admins only

function App() {
  //  Load token & role from localStorage
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  //  When login succeeds
  const handleLogin = (data) => {
    localStorage.setItem("access_token", data.access);

    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }

    setToken(data.access);
  };

  //  Logout clearss locl storage
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setToken(null);
    setRole(null);
  };


  const getDashboardRoute = () => {
    if (role === "SuperAdmin") return "/admin-dashboard";
    if (role === "Admin") return "/admin-dashboard";
    if (role === "Employee") return "/employee-dashboard";
    return "/";
  };

  return (
    // <>
    //   <h1
    //     style={{
    //       color: "white",
    //       backgroundColor: "black",
    //       textAlign: "center",
    //       padding: "10px",
    //     }}
    //   >
    //      React Loaded — App.js Running
    //   </h1>

      <Router>
        <Routes>
          {/*LOGIN PAGE*/}
          <Route
            path="/"
            element={
              !token ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to={getDashboardRoute()} />
              )
            }
          />

          {/*ADMIN  DASHBOARD*/}
          <Route
            path="/admin-dashboard"
            element={
              token && (role === "Admin" || role === "SuperAdmin") ? (
                <Dashboard role={role} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/*EMPLOYEE DASHBOARD*/}
          <Route
            path="/employee-dashboard"
            element={
              token && role === "Employee" ? <Tasks /> : <Navigate to="/" />
            }
          />

          {/*TASKS PAGE*/}
          <Route
            path="/tasks"
            element={token ? <Tasks /> : <Navigate to="/" />}
          />

          {/*EMPLOYEE MANAGEMENT*/}
          <Route
            path="/users"
            element={
              token && (role === "Admin" || role === "SuperAdmin") ? (
                <EmployeesPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/*FALLBACK*/}
          <Route
            path="*"
            element={<Navigate to={token ? getDashboardRoute() : "/"} />}
          />
        </Routes>
      </Router>
  
  );
}

export default App;
