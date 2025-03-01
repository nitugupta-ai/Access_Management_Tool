const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "access_management",
});

db.connect((err) => {
    if(err){
        console.log("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database!")
});

module.exports = db;