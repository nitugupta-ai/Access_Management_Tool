import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleManagement.css"
const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "1";

  useEffect(() => {
    fetchRoles();
  }, []);

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

  const handleCreateRole = async () => {
    if (!roleName) return alert("Role name is required");
    try {
      const response = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_name: roleName }),
      });
      if (response.ok) {
        fetchRoles();
        setRoleName("");
      } else {
        alert("Failed to create role");
      }
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleEditRole = async (id) => {
    if (!roleName) return alert("Role name is required");
    try {
      const response = await fetch(`http://localhost:5000/api/roles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_name: roleName }),
      });
      if (response.ok) {
        fetchRoles();
        setRoleName("");
        setEditingRole(null);
      } else {
        alert("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/roles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchRoles();
      else alert("Failed to delete role");
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Role Management</h2>
      {isAdmin && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          {editingRole ? (
            <button onClick={() => handleEditRole(editingRole)}>Update</button>
          ) : (
            <button onClick={handleCreateRole}>Create</button>
          )}
        </div>
      )}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Role Name</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.role_name}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => setEditingRole(role.id)}>Edit</button>
                  <button onClick={() => handleDeleteRole(role.id)} style={{ marginLeft: "10px" }}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
