
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import LoginForm from "./pages/LoginForm";
import LoginFormUser from "./pages/LoginFormUser";
import AddUserForm from "./pages/AddUserForm";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./pages/PrivateRoute";

export default function App() {
  return (
    <>
      {/* <Route path="/admin" element={<AuthPage role="admin" />} /> */}
      {/* <Route path="/user" element={<AuthPage role="user" />} /> */}
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<LoginFormUser />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/admin" element={<LoginForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-user" element={<AddUserForm />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<LoginFormUser />} />
        <Route path="/admin" element={<LoginForm />} />

        {/* 🔒 Protected User Route */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute role="user">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        {/* 🔒 Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <PrivateRoute role="admin">
              <AddUserForm />
            </PrivateRoute>
          }
        />

        <Route path="/*" element={<PageNotFound />} />
      </Routes>


    </>
  );
}
