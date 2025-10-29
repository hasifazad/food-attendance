import React, { useEffect, useState } from "react";
import axiosInstance from "../services/api";

const AddUserForm: React.FC = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    const [admin, setAdmin] = useState<{ name?: string; email?: string; mobile?: string; id?: number } | null>(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin_info");
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, [])

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !mobile.trim()) {
            alert("Please fill out both fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/admin/add-user", {
                name,
                mobile,
                adminId: admin?.id, // temporary — replace with logged-in admin ID later
            });

            alert("✅ User added successfully!");
            console.log("User added:", res.data);
            setName("");
            setMobile("");
        } catch (err: any) {
            console.error("❌ Error adding user:", err.response?.data || err.message);
            alert(err.response?.data?.error || "Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-gray-200 p-6">
            <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg border border-gray-800">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-100">➕ Add New User</h2>

                <form onSubmit={handleAddUser} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter user's name"
                            className="w-full p-3 rounded-lg bg-[#262626] border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Mobile</label>
                        <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter mobile number"
                            className="w-full p-3 rounded-lg bg-[#262626] border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gray-100 text-black font-medium hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add User"}
                    </button>
                </form>
            </div>
        </div>

    );
};

export default AddUserForm;
