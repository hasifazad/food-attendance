import React, { useEffect, useState } from "react";
import axiosInstance from "../services/api";

const UserDashboard: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const toggleMeal = (meal: "breakfast" | "lunch" | "dinner") => {
    setMeals({ ...meals, [meal]: !meals[meal] });
  };



  const [user, setUser] = useState<{ name: string; mobile: string; id?: number } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  useEffect(() => {
    const fetchFoodStatus = async () => {
      try {
        if (!date || !user?.id) return
        const res = await axiosInstance.get("/user/food-status/single", {
          params: { user_id: user?.id, date },
        });
        setMeals(res.data);
        console.log("🍱 Food preferences loaded:", res.data);
      } catch (err: any) {
        console.error("❌ Error fetching food status:", err.response?.data || err.message);
      }
    };

    fetchFoodStatus();
  }, [date, user]);


  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/user/food-status", {
        user_id: user?.id,
        date,
        breakfast: meals.breakfast,
        lunch: meals.lunch,
        dinner: meals.dinner,
      });
      console.log("✅ Food status saved:", res.data);
      alert("Your food preference has been updated!");
    } catch (err: any) {
      console.error("❌ Error saving food status:", err.response?.data || err.message);
      alert("Failed to update food status.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-gray-200 p-6">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-100">
          🍽️ Food Preference
        </h1>


        {user && (
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-100">
              👋 Welcome, {user.name}
            </h2>
            <p className="text-sm text-gray-400">📱 {user.mobile}</p>
          </div>
        )}


        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#262626] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
          />
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user_token");
            localStorage.removeItem("user_info");
            window.location.href = "/user";
          }}
          className="absolute top-6 right-6 text-sm bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
        >
          Logout
        </button>


        <div className="space-y-4 mb-6">
          {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
            <div
              key={meal}
              className="flex items-center justify-between bg-[#262626] px-4 py-3 rounded-lg border border-gray-700"
            >
              <span className="capitalize text-gray-300">{meal}</span>
              <button
                onClick={() => toggleMeal(meal)}
                className={`w-12 h-6 rounded-full transition-colors ${meals[meal] ? "bg-green-500" : "bg-gray-600"
                  } relative`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${meals[meal] ? "translate-x-6" : ""
                    }`}
                ></span>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-gray-100 text-black font-medium hover:bg-gray-300 transition"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
