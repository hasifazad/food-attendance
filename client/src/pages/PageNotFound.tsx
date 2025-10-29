import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-gray-200 p-6">
            <h1 className="text-[5rem] font-bold text-gray-100 tracking-wider">404</h1>
            <p className="text-gray-400 text-lg mb-8 text-center">
                Oops! The page you’re looking for doesn’t exist.
            </p>

            <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-lg bg-gray-100 text-black font-medium hover:bg-gray-300 transition"
            >
                Go Back Home
            </button>

            <div className="absolute bottom-6 text-sm text-gray-600">
                © {new Date().getFullYear()} Hostel Food System
            </div>
        </div>
    );
};

export default PageNotFound;
