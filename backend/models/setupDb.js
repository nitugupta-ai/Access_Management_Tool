const db = require("../config/db.js");

//users table
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Roles Table
const createRolesTable = `
  CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
  );
`;

// Modules Table
const createModulesTable = `
  CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
// UserRoles (Many-to-Many: Users ⇄ Roles)
const createUserRolesTable = `
  CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
  );
`;

// RoleModules (Many-to-Many: Roles ⇄ Modules)
const createRoleModulesTable = `
  CREATE TABLE IF NOT EXISTS role_modules (
    role_id INT NOT NULL,
    module_id INT NOT NULL,
    permission ENUM('read', 'write', 'delete') NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, module_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
  );
`;

//RolesPermission 

const createRolePermissionTable = `CREATE TABLE IF NOT EXISTS role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  module_id INT NOT NULL,
  can_read BOOLEAN DEFAULT FALSE,
  can_write BOOLEAN DEFAULT FALSE,
  can_update BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);`;

// Execute Queries
db.query(createUsersTable, (err) => {
  if (err) console.error("Error creating users table:", err);
});

db.query(createRolesTable, (err) => {
  if (err) console.error("Error creating roles table:", err);
});

db.query(createModulesTable, (err) => {
  if (err) console.error("Error creating modules table:", err);
});

db.query(createUserRolesTable, (err) => {
  if (err) console.error("Error creating user_roles table:", err);
});

db.query(createRoleModulesTable, (err) => {
  if (err) console.error("Error creating role_modules table:", err);
});

db.query(createRolePermissionTable, (err) => {
  if (err) console.error("Error creating role_permission table:", err);
});



// Insert Default Admin User (if not exists)
db.query(
  `INSERT INTO users (username, email, password_hash, is_admin) 
   SELECT 'admin', 'admin@example.com', '$2b$10$tWIqtpbumD313c/CeZQBQeOVOItLyMzdlg031Tr2o.Y2vDJgctT0G', TRUE 
   WHERE NOT EXISTS (SELECT * FROM users WHERE email = 'admin@example.com')`,
  (err) => {
    if (err) console.error("Error inserting default admin user:", err);
    else console.log("Default Admin user ready!");
  }
);

// Insert Default Admin Role (if not exists)
db.query(
  `INSERT INTO roles (role_name, created_by) 
   SELECT 'Admin', 1 FROM DUAL 
   WHERE NOT EXISTS (SELECT * FROM roles WHERE role_name = 'Admin')`,
  (err, result) => {
    if (err) console.error("Error inserting Admin role:", err);
    else console.log("Admin role ready!");

    
  }
);
;


console.log("Database tables have been created successfully!");

db.end();