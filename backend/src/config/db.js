const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[DATABASE ERROR] Failed to connect to SQLite:', err.message);
  } else {
    console.log(`[DATABASE] Connected to SQLite database at: ${dbPath}`);
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // 1. Create inquiries table
    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        project_type TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('[DATABASE ERROR] Failed to create inquiries table:', err.message);
      } else {
        console.log('[DATABASE] Table "inquiries" is ready.');
      }
    });

    // 2. Create subscribers table
    db.run(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('[DATABASE ERROR] Failed to create subscribers table:', err.message);
      } else {
        console.log('[DATABASE] Table "subscribers" is ready.');
      }
    });
  });
}

module.exports = db;
