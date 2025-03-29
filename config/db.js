const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'protectmyacnt',  // Change this if you have a password
    database: 'rescuebite'
});

module.exports = db;

