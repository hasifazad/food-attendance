const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hostel.db");

function init() {
  db.serialize(() => {
    // Admins table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        mobile TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        mobile TEXT UNIQUE,
        password TEXT,
        room_no TEXT,
        admin_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(admin_id) REFERENCES admins(id)
      )
    `);

    // Food status table
    db.run(`
      CREATE TABLE IF NOT EXISTS food_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        date TEXT,
        breakfast BOOLEAN DEFAULT 0,
        lunch BOOLEAN DEFAULT 0,
        dinner BOOLEAN DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);
  });
}

module.exports = { db, init };
