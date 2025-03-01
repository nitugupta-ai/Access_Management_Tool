const db = require("../config/db.js");

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userId = req.user.id;
    let moduleId = req.body.module_id || req.query.module_id;

    // Extract module_id from request URL if available (for cases like GET requests)
    if (!moduleId && req.params.moduleId) {
      moduleId = req.params.moduleId;
    }

    // If module_id is still missing, deny access
    if (!moduleId) {
      return res.status(400).json({ message: "Module ID is required for permission check." });
    }

    db.query(
      `SELECT permission FROM role_modules 
       JOIN user_roles ON role_modules.role_id = user_roles.role_id
       WHERE user_roles.user_id = ? AND role_modules.module_id = ? AND role_modules.permission = ?`,
      [userId, moduleId, requiredPermission],
      (err, results) => {
        if (err) {
          console.error("Database error in permission check:", err);
          return res.status(500).json({ message: "Internal server error." });
        }

        if (results.length === 0) {
          return res.status(403).json({ message: "Access Denied! You don't have permission." });
        }

        next();
      }
    );
  };
};

module.exports = checkPermission;
