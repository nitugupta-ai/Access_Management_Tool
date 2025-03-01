import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement"; // Import UserManagement

const UserDashboard = () => {
  const [modules, setModules] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Check if user is admin
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "1"; // Check if admin
    setIsAdmin(adminStatus);
    fetchUserModules();
  }, []);

  const fetchUserModules = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user-modules", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 403) {
        navigate("/forbidden"); // Redirect if unauthorized
        return;
      }

      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error("Error fetching user modules:", error);
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <ul>
        {modules.length > 0 ? (
          modules.map((mod) => <li key={mod.id}>{mod.module_name}</li>)
        ) : (
          <p>No modules available</p>
        )}
      </ul>

      {/* Show User Management only if Admin */}
      {isAdmin && (
        <div>
          <h3>Admin Section</h3>
          <UserManagement />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
