import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${apiUrl}/api`, // 👈 your backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: attach token automatically (if you’re using auth)
// axiosInstance.interceptors.request.use((config) => {
//     const adminToken = localStorage.getItem("admin_token");
//     const userToken = localStorage.getItem("user_token");

//     if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
//     if (userToken) config.headers.Authorization = `Bearer ${userToken}`;

//     return config;
// });

export default axiosInstance;
