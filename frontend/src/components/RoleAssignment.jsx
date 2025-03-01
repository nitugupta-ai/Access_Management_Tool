import React, { useEffect, useState } from "react";
import "./RoleAssignment.css"

const RoleAssignment = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const token = localStorage.getItem("token");

  // Fetch users, roles, and assigned roles when component loads
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchAssignedRoles();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch all roles
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

  // Fetch assigned roles
  const fetchAssignedRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user-roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAssignedRoles(data);
    } catch (error) {
      console.error("Error fetching assigned roles:", error);
    }
  };

  // Assign a role to a user
  const assignRole = async () => {
    if (!selectedUser || !selectedRole) {
      alert("Please select a user and a role");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/user-roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: selectedUser, role_id: selectedRole }),
      });

      if (response.ok) {
        alert("Role assigned successfully!");
        fetchAssignedRoles(); // Refresh list
      } else {
        alert("Failed to assign role");
      }
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  return (
    <div>
      <h2>Role Assignment</h2>

      <label>Select User:</label>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">-- Select User --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <label>Select Role:</label>
      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
        <option value="">-- Select Role --</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.role_name}
          </option>
        ))}
      </select>
        <br />
        <br/>
      <button onClick={assignRole}>Assign Role</button>

      <h3>Assigned Roles</h3>
      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {assignedRoles.length === 0 ? (
            <tr>
              <td colSpan="2">No roles assigned yet.</td>
            </tr>
          ) : (
            assignedRoles.map((assign) => (
              <tr key={assign.user_id + "-" + assign.role_id}>
                <td>{assign.username}</td>
                <td>{assign.role_name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleAssignment;
