const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");


const router = express.Router();

// Create Module (Requires 'write' permission)
router.post("/", authenticateToken, (req, res) => {
  const { module_name } = req.body;

  db.query("INSERT INTO modules (module_name) VALUES (?)", [module_name], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json({ message: "Module created successfully", moduleId: result.insertId });
  });
});

// Get All Modules (Requires 'read' permission)
router.get("/", authenticateToken, (req, res) => {
  db.query("SELECT * FROM modules", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json(results);
  });
});

// Update Module (Requires 'write' permission)
router.put("/:id", authenticateToken,  (req, res) => {
  const { id } = req.params;
  const { module_name } = req.body;

  db.query("UPDATE modules SET module_name = ? WHERE id = ?", [module_name, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json({ message: "Module updated successfully" });
  });
});

// Delete Module (Requires 'delete' permission)
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM modules WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json({ message: "Module deleted successfully" });
  });
});

// Assign Module to Role with Permissions
router.post("/assign", authenticateToken, (req, res) => {
  const { role_id, module_id, permission } = req.body;

  if (!["read", "write", "delete"].includes(permission)) {
    return res.status(400).json({ message: "Invalid permission type" });
  }

  db.query(
    "INSERT INTO role_modules (role_id, module_id, permission) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE permission = ?",
    [role_id, module_id, permission, permission],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json({ message: "Module assigned to role successfully" });
    }
  );
});

// Fetch Assigned Modules for a Role
router.get("/assigned/:roleId", authenticateToken, (req, res) => {
  const { roleId } = req.params;

  db.query(
    "SELECT m.id, m.module_name, rm.permission FROM modules m INNER JOIN role_modules rm ON m.id = rm.module_id WHERE rm.role_id = ?",
    [roleId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json(results);
    }
  );
});

module.exports = router;
