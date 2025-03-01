import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "1"; // Ensure correct type checking

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user-dashboard" />; // Redirect normal users away from admin pages
  }

  return children;
};

export default PrivateRoute;
