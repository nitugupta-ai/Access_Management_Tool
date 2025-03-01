const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");
const db = require("../config/db"); // MySQL connection
require("dotenv").config();


const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, results) => {
    if (err) {
      console.error("Database Error (Checking User):", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const isAdminValue = isAdmin ? 1 : 0;

      db.query(
        "INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, isAdminValue],
        (err, result) => {
          if (err) {
            console.error("Database Error (Inserting User):", err);
            return res.status(500).json({ message: "Database error", error: err });
          }

          // Corrected user object (using result.insertId)
          const token = jwt.sign(
            { id: result.insertId, is_admin: isAdminValue },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.json({ message: "Signup successful", token });
        }
      );
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

// User Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.is_admin ? 1 : 0 },  // Ensuring proper boolean
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token: token,
      isAdmin: user.is_admin ? 1 : 0  
    });
  });
});

module.exports = router;
