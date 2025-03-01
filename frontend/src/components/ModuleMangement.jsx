import React, { useEffect, useState } from "react";
import "./ModuleManagement.css"
const ModuleManagement = () => {
  const [modules, setModules] = useState([]);
  const [moduleName, setModuleName] = useState("");
  const [error, setError] = useState(""); // Store error messages
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/modules", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        setError("Invalid data format received from API");
        return;
      }

      setModules(data);
      setError("");
    } catch (error) {
      console.error("Error fetching modules:", error);
      setError("Failed to fetch modules. Check console for details.");
    }
  };

  const createModule = async () => {
    if (!moduleName) return alert("Module name is required");

    try {
      const response = await fetch("http://localhost:5000/api/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ module_name: moduleName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create module");
        return;
      }

      setModuleName("");
      fetchModules(); // Refresh list after creation
    } catch (error) {
      console.error("Error creating module:", error);
      alert("An error occurred. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Module Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Enter module name"
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
      />
      <button onClick={createModule}>Create Module</button>
      <ul>
        {modules.length > 0 ? (
          modules.map((mod) => <li key={mod.id}>{mod.module_name}</li>)
        ) : (
          <p>No modules found</p>
        )}
      </ul>
    </div>
  );
};

export default ModuleManagement;
