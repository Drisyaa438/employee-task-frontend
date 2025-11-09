import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Login API
            const response = await axiosInstance.post("/users/login/", {
                username,
                password,
            });

            const data = response.data;

            // Save tokens
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            //Fetch user info
            const userResponse = await axiosInstance.get("/users/me/");
            const userData = userResponse.data;

            // Save user info to localStorage
            localStorage.setItem("role", userData.role);
            localStorage.setItem("user_id", userData.id);
            localStorage.setItem("username", userData.username);

            // Update App state
            onLogin({
                access: data.access,
                refresh: data.refresh,
                role: userData.role,
                id: userData.id,
                username: userData.username,
            });

        
            
            if (userData.role === "Admin") {
                window.location.href = "/admin-dashboard";
            } else if (userData.role === "Employee") {
                window.location.href = "/employee-dashboard";
            } else {
                window.location.href = "/dashboard"; 
            }

        } catch (err) {
            console.error("Login failed:", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Invalid credentials or server error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 bg-white rounded-full opacity-90"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
                        <p className="text-white/70 text-sm">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    {/* Username input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="w-5 h-5 text-white/60">
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Password input */}
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="w-5 h-5 text-white/60">
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Login button */}
                    <div
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold p-4 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] shadow-lg cursor-pointer text-center"
                    >
                        Sign In
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white/60">
                                Secure Access
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-white/60 text-xs">
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
