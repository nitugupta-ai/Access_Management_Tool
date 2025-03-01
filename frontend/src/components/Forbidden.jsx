import React from "react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>403 - Access Forbidden</h2>
      <p>You do not have permission to access this page.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default Forbidden;
