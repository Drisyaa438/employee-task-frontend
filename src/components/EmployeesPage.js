
import { useEffect, useState } from "react";
import { getEmployees, createEmployee } from "../api/employeesApi";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    designation: "",
  });

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      const list = Array.isArray(data) ? data : data.results || [];
      setEmployees(list);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Create new employee
  const handleCreate = async () => {
    if (!form.username || !form.password) {
      alert("Username and password are required.");
      return;
    }

    try {
      await createEmployee({
        username: form.username,
        email: form.email,
        password: form.password,
        role: "Employee",
        designation: form.designation,
      });

      setForm({ username: "", email: "", password: "", designation: "" });
      fetchEmployees();
    } catch (err) {
      console.error("Failed to create employee:", err);
      alert("Error creating employee. Please check your backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>

      {/* Create Form */}
      <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded bg-white/10 border border-white/30"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-white/10 border border-white/30"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-white/10 border border-white/30"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Designation"
            className="p-3 rounded bg-white/10 border border-white/30"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Create Employee
          </button>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Employee List</h2>
        {employees.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-white/70 text-sm uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Designation</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-white/10">
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.username}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.role}</td>
                  <td className="p-3">{emp.designation || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-white/70">No employees found.</p>
        )}
      </div>
    </div>
  );
}
