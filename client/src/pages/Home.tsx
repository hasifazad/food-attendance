
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-3">🍽️ Hostel Food Manager</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Reduce food waste — quickly mark your meals for the day.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => nav("/admin")}
            className="py-3 rounded-xl bg-indigo-600 font-medium hover:bg-indigo-500 transition-all duration-200"
          >
            I’m a Tenant (Admin)
          </button>
          <button
            onClick={() => nav("/user")}
            className="py-3 rounded-xl bg-gray-700 font-medium hover:bg-gray-600 transition-all duration-200"
          >
            I’m a Hosteller (User)
          </button>
        </div>
      </div>
    </div>

  );
}
