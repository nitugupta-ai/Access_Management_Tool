import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Fetch all users with assigned roles
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/with-roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch all available roles
  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Assign a role to a user
  const assignRole = async (userId) => {
    if (!selectedRole[userId]) return alert("Please select a role");

    try {
      const response = await fetch("http://localhost:5000/api/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, role_id: selectedRole[userId] }),
      });

      if (response.ok) {
        alert("Role assigned successfully");
        fetchUsers(); // Refresh the list
      } else {
        alert("Failed to assign role");
      }
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Assigned Role</th>
            <th>Assign New Role</th>
            <th>Action</th>
          </tr>
        </thead>
       <tbody>
  {users.length > 0 ? (
    users.map((user, index) => (
      <tr key={`${user.id}-${index}`}>
        <td>{user.id}</td>
        <td>{user.username || "N/A"}</td>
        <td>{user.email || "N/A"}</td>
        <td>{user.role_name || "No Role Assigned"}</td>
        <td>
          <select
            value={selectedRole[user.id] || ""}
            onChange={(e) =>
              setSelectedRole({ ...selectedRole, [user.id]: e.target.value })
            }
          >
            <option value="">Select Role</option>
            {roles.map((role, roleIndex) => (
              <option key={`${role.id}-${roleIndex}`} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </td>
        <td>
          <button onClick={() => assignRole(user.id)}>Assign Role</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6">No Users Found</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default UserManagement;
