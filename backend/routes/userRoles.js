const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Assign Role to User
router.post("/", authenticateToken, (req, res) => {
  const { user_id, role_id } = req.body;

  if (!user_id || !role_id) {
    return res.status(400).json({ message: "User ID and Role ID are required" });
  }

  db.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
    [user_id, role_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json({ message: "Role assigned successfully", result });
    }
  );
});

// Get all assigned roles
router.get("/", authenticateToken, (req, res) => {
    db.query(
      `SELECT ur.user_id, ur.role_id, u.username, r.role_name 
       FROM user_roles ur 
       JOIN users u ON ur.user_id = u.id 
       JOIN roles r ON ur.role_id = r.id`,
      (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
  
        res.json(results);
      }
    );
  });
  

module.exports = router;
