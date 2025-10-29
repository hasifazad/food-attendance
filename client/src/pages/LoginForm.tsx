import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";


export default function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const [loading, setLoading] = useState(false);


  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // setLoading(true);
    try {
      if (isSignup) {
        // Signup API
        const res = await axiosInstance.post("/admin/signup", {
          mobile,
          email,
          password,
        });

        if (res.status === 201) {
          alert("Signup successful! Please log in now.");
          setIsSignup(false); // Switch to login form automatically
          setMobile("");
          setEmail("");
          setPassword("");
        }
      } else {
        // Login API
        const res = await axiosInstance.post("/admin/login", {
          mobile,
          password,
        });

        if (res.status === 200) {
          localStorage.setItem("admin_token", res.data.token);
          localStorage.setItem("admin_info", JSON.stringify(res.data.admin));
          navigate("/admin/dashboard");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        (isSignup ? "Signup failed" : "Login failed")
      );
    }
    // setLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
      <div className="w-full max-w-sm bg-gray-800/70 border border-gray-700 rounded-2xl p-8 shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {isSignup ? "Tenant Sign Up" : "Tenant Login"}
        </h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          {isSignup
            ? "Create your tenant account"
            : "Login to your tenant account"}
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

          {isSignup && (
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

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
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="mt-5 text-sm text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="text-gray-400 hover:text-indigo-400 transition-colors duration-150 underline-offset-2 hover:underline"
          >
            {isSignup
              ? "Already have an account? Log in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
