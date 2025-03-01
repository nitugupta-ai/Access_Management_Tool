import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; 

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, isAdmin }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Redirect based on role
        if (isAdmin) {
          navigate("/admin-dashboard"); 
        } else {
          navigate("/user-dashboard"); 
        }
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label>Signup as Admin</label>
        </div>
        <button onClick={handleSignup} className="signup-btn">Signup</button>
      </div>
    </div>
  );
};

export default Signup;
