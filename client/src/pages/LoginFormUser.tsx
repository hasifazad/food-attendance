import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";

export default function LoginFormUser() {
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    let navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!mobile || !password) {
            setError("Please fill in all fields");
            return;
        }

        console.log("User login data:", { mobile, password });
        // TODO: call your backend API -> /api/users/login
        try {
            const response = await axiosInstance.post('/user/login', {
                mobile,
                password
            });

            // Save token and user info in localStorage
            localStorage.setItem("user_token", response.data.token);
            localStorage.setItem("user_info", JSON.stringify(response.data.user));

            navigate('/user/dashboard');
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.error || "Login failed. Please try again.");
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
            <div className="w-full max-w-sm bg-gray-800/70 border border-gray-700 rounded-2xl p-8 shadow-lg backdrop-blur-md">
                <h2 className="text-2xl font-semibold mb-2 text-center">User Login</h2>
                <p className="text-gray-400 text-sm mb-6 text-center">
                    Log in to mark your meal preferences
                </p>

                {error && <div className="text-sm text-red-500 mb-3">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Mobile number"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 font-medium"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}
