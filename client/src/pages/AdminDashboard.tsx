
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";

interface UserMeal {
  id: number;
  name: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

const AdminDashboard: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);


  const [admin, setAdmin] = useState<{ name?: string; email?: string; mobile?: string; id?: number } | null>(null);


  // Sample data — later this can come from your backend
  const [users, setUsers] = useState<UserMeal[]>([]);

  let navigate = useNavigate()

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin_info");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, [])


  console.log(admin);

  useEffect(() => {

    axiosInstance
      .get(`/admin/get-all-users/?admin_id=${admin?.id}&date=${date}`)
      .then((res) => {
        console.log(res.data.users);

        // const formatted = res.data.users.map((u: any) => ({
        //   id: u.id,
        //   name: u.name,
        //   breakfast: false,
        //   lunch: false,
        //   dinner: false,
        // }));
        // console.log(formatted);

        setUsers(res.data.users);
      })
      .catch((err) => console.error("Error fetching users:", err));

  }, [date, admin]);

  // Calculate totals
  const totals = {
    breakfast: users.filter((u) => u.breakfast).length,
    lunch: users.filter((u) => u.lunch).length,
    dinner: users.filter((u) => u.dinner).length,
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 p-6">


      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-100">🏠 Admin Dashboard</h1>

            {admin && (
              <p className="text-sm text-gray-400 mt-1">
                Logged in as <span className="text-gray-200">{admin.email || admin.mobile}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-700 text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <button
              onClick={() => navigate('/admin/add-user')}
              className="px-4 py-2 rounded-lg bg-gray-100 text-black font-medium hover:bg-gray-300 transition whitespace-nowrap"
            >
              ➕ Add User
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("admin_info");
                localStorage.removeItem("admin_token");
                navigate("/admin");
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        </header>




        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Breakfast", value: totals.breakfast },
            { label: "Lunch", value: totals.lunch },
            { label: "Dinner", value: totals.dinner },
          ].map((meal) => (
            <div
              key={meal.label}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 text-center shadow"
            >
              <p className="text-gray-400 text-sm">{meal.label}</p>
              <h2 className="text-2xl font-semibold text-gray-100">{meal.value}</h2>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#141414] border-b border-gray-700">
              <tr>
                <th className="p-4 text-gray-400 font-medium">Name</th>
                <th className="p-4 text-gray-400 font-medium text-center">Breakfast</th>
                <th className="p-4 text-gray-400 font-medium text-center">Lunch</th>
                <th className="p-4 text-gray-400 font-medium text-center">Dinner</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-800 hover:bg-[#222222]">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4 text-center">
                    {u.breakfast ? (
                      <span className="text-green-400">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {u.lunch ? (
                      <span className="text-green-400">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {u.dinner ? (
                      <span className="text-green-400">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
