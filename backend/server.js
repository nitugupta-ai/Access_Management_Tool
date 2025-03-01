const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/userRoutes.js");
const roleRoutes = require("./routes/roleRoutes.js");
const moduleRoutes = require("./routes/moduleRoutes.js");
const permissionRoutes = require("./routes/permissions");
const rbacRoutes = require("./routes/rbac.js");
const userRoles = require("./routes/userRoles.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/roles", roleRoutes);        
app.use("/api/modules", moduleRoutes); 
app.use("/api/permissions", permissionRoutes);
app.use("/api/rbac", rbacRoutes);
app.use("/api/user-roles", userRoles);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
