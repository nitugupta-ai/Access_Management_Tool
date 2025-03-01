const express = require("express");
const db = require("../config/db.js");
const authenticateToken = require("../middleware/authMiddleware.js");

const router = express.Router();

// Create Role (Admin Only)
router.post("/", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access Forbidden! Admins only." });
  }

  const { role_name } = req.body;
  const created_by = req.user.id;

  if (!role_name) {
    return res.status(400).json({ message: "Role name is required" });
  }


  db.query(
    "INSERT INTO roles (role_name, created_by) VALUES (?, ?)",
    [role_name, created_by],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ message: "Role created successfully", roleId: result.insertId });
    }
  );
});

// Get All Roles
router.get("/", authenticateToken, (req, res) => {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

router.put("/:id", authenticateToken, (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access Forbidden! Admins only." });
    }
  
    const { id } = req.params;
    const { role_name } = req.body;
  
    db.query("UPDATE roles SET role_name = ? WHERE id = ?", [role_name, id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
  
      res.json({ message: "Role updated successfully" });
    });
  });
  
//delete role
router.delete("/:id", authenticateToken, (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access Forbidden! Admins only." });
    }
  
    const { id } = req.params;
  
    db.query("DELETE FROM roles WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
  
      res.json({ message: "Role deleted successfully" });
    });
  });

// Assign Role to a User (Admin Only)
router.post("/assign-role", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access Forbidden! Admins only." });
  }

  const { user_id, role_id } = req.body;
  db.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
    [user_id, role_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Role assigned successfully" });
    }
  );
});

// Remove Role from a User (Admin Only)
router.delete("/remove-role", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access Forbidden! Admins only." });
  }

  const { user_id, role_id } = req.body;
  db.query(
    "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?",
    [user_id, role_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Role removed successfully" });
    }
  );
});

// Get User Roles
router.get("/user-roles/:user_id", authenticateToken, (req, res) => {
  const { user_id } = req.params;
  db.query(
    "SELECT roles.id, roles.role_name FROM user_roles INNER JOIN roles ON user_roles.role_id = roles.id WHERE user_roles.user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json(results);
    }
  );
});

router.get("/user-modules", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT DISTINCT m.id, m.module_name
     FROM modules m
     JOIN role_modules rm ON m.id = rm.module_id
     JOIN user_roles ur ON rm.role_id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json(results);
    }
  );
});

  

module.exports = router;
