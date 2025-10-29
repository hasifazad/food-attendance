import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  role: "admin" | "user";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  // Example: retrieve auth info from localStorage
  const token = localStorage.getItem(`${role}_token`);

  if (!token) {
    // Redirect to respective login page
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
};

export default PrivateRoute;
