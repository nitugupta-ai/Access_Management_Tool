const express = require("express");
const db = require("../config/db.js");
const authenticateToken = require("../middleware/authMiddleware.js");

const router = express.Router();

// Assign Role to a User (Admin Only)
router.post("/assign-role", authenticateToken, (req, res) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ message: "Access Forbidden! Admins only." });
  }

  const { user_id, role_id } = req.body;

  db.query(
    "INSERT INTO user_roles (user_id, role_id) SELECT ?, ? WHERE NOT EXISTS (SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?)",
    [user_id, role_id, user_id, role_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Role assigned successfully!" });
    }
  );
});

// Assign Permissions to Role (Admin Only)
router.post("/assign-permission", authenticateToken, (req, res) => {
    if (!req.user.is_admin) {
      return res.status(403).json({ message: "Access Forbidden! Admins only." });
    }
  
    const { role_id, module_id, permission } = req.body;
  
    db.query(
      "INSERT INTO role_modules (role_id, module_id, permission) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT * FROM role_modules WHERE role_id = ? AND module_id = ? AND permission = ?)",
      [role_id, module_id, permission, role_id, module_id, permission],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Permission assigned successfully!" });
      }
    );
  });

//Get Permissions for a User Based on Their Role

router.get("/permissions/:user_id", authenticateToken, (req, res) => {
  const { user_id } = req.params;

  db.query(
    `SELECT m.module_name, rm.permission 
     FROM role_modules rm
     JOIN modules m ON rm.module_id = m.id
     JOIN user_roles ur ON rm.role_id = ur.role_id
     WHERE ur.user_id = ?`,
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.json(results);
    }
  );
});
  

module.exports = router;
