const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

//  Assign Permissions to a Role (Admin Only)
router.post("/assign-permissions", authenticateToken, (req, res) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: "Access Forbidden! Admins only." });
  }

  const { role_id, module_id, can_read, can_write, can_update, can_delete } = req.body;

  db.query(
    "INSERT INTO role_permissions (role_id, module_id, can_read, can_write, can_update, can_delete) VALUES (?, ?, ?, ?, ?, ?)",
    [role_id, module_id, can_read, can_write, can_update, can_delete],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json({ message: "Permissions assigned successfully" });
    }
  );
});

//  Get Role Permissions
router.get("/role/:roleId", authenticateToken, (req, res) => {
  const roleId = req.params.roleId;

  db.query(
    "SELECT * FROM role_permissions WHERE role_id = ?",
    [roleId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json(results);
    }
  );
});

module.exports = router;
