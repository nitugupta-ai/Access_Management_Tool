const express = require("express");
const db = require("../config/db.js");
const authenticateToken = require("../middleware/authMiddleware.js");

const router = express.Router();

//  Fetch all users (Admin only)
router.get("/users", authenticateToken, (req, res) => {
  console.log("User Info:", req.user);

  if (!req.user || req.user.isAdmin !== 1) {
    return res.status(403).json({ message: "Access Forbidden! Admins only." });
  }

  db.query("SELECT id, username, email, is_admin FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json(results);
  });
});

//  Fetch logged-in user details
router.get("/me", authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  db.query(
    "SELECT id, username, email, is_admin FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      res.json(results[0]);
    }
  );
});

// 🔹 Update user details
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  db.query(
    "UPDATE users SET username = ?, email = ? WHERE id = ?",
    [username, email, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

      res.json({ message: "User updated successfully" });
    }
  );
});

// 🔹 Assign Role to User (Admin Only)
router.post("/assign-role", authenticateToken, (req, res) => {
  const { user_id, role_id } = req.body;

  if (!req.user || req.user.isAdmin !== 1) {
    return res.status(403).json({ message: "Access Forbidden! Admins only." });
  }

  db.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE role_id = ?",
    [user_id, role_id, role_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json({ message: "Role assigned successfully" });
    }
  );
});

// 🔹 Fetch Users & Their Roles
router.get("/with-roles", authenticateToken, (req, res) => {
  const sql = `
    SELECT users.id, users.username, roles.role_name 
    FROM users 
    LEFT JOIN user_roles ON users.id = user_roles.user_id 
    LEFT JOIN roles ON user_roles.role_id = roles.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.json(results);
  });
});

// 🔹 Delete user (Admin only)
router.delete("/:id", authenticateToken, (req, res) => {
  if (!req.user || req.user.isAdmin !== 1) {
    return res.status(403).json({ message: "Access Forbidden. Admins only." });
  }

  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;
