const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.json');

// Helper to load/save JSON database
function loadData() {
  try {
    if (!fs.existsSync(dbPath)) {
      return { inquiries: [], subscribers: [] };
    }
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DATABASE ERROR] Failed to read database JSON:', err.message);
    return { inquiries: [], subscribers: [] };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DATABASE ERROR] Failed to write database JSON:', err.message);
  }
}

// Ensure database file exists on startup
if (!fs.existsSync(dbPath)) {
  saveData({ inquiries: [], subscribers: [] });
  console.log(`[DATABASE] Created new JSON database at: ${dbPath}`);
} else {
  console.log(`[DATABASE] Using existing JSON database at: ${dbPath}`);
}

const db = {
  serialize(callback) {
    // Run serialization callback immediately
    callback();
  },

  run(sql, params, callback) {
    // Normalize SQL query
    const sqlUpper = sql.toUpperCase();
    const data = loadData();

    // Check if it's table creation
    if (sqlUpper.includes('CREATE TABLE IF NOT EXISTS')) {
      let tableName = '';
      if (sqlUpper.includes('INQUIRIES')) {
        tableName = 'inquiries';
      } else if (sqlUpper.includes('SUBSCRIBERS')) {
        tableName = 'subscribers';
      }
      
      // Ensure the key exists in data
      if (tableName && !data[tableName]) {
        data[tableName] = [];
        saveData(data);
      }

      console.log(`[DATABASE] Table "${tableName}" is ready.`);
      if (typeof callback === 'function') {
        callback.call(null, null);
      }
      return;
    }

    // Check if it's inserting inquiries
    if (sqlUpper.includes('INSERT INTO INQUIRIES')) {
      const [name, email, projectType, message] = params;
      
      if (!data.inquiries) {
        data.inquiries = [];
      }

      const newId = data.inquiries.length > 0 ? Math.max(...data.inquiries.map(i => i.id)) + 1 : 1;
      const newRecord = {
        id: newId,
        name,
        email,
        project_type: projectType,
        message,
        created_at: new Date().toISOString()
      };

      data.inquiries.push(newRecord);
      saveData(data);

      if (typeof callback === 'function') {
        callback.call({ lastID: newId }, null);
      }
      return;
    }

    // Check if it's inserting subscribers
    if (sqlUpper.includes('INSERT INTO SUBSCRIBERS')) {
      const [email] = params;

      if (!data.subscribers) {
        data.subscribers = [];
      }

      // Enforce UNIQUE constraint on email
      const exists = data.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        const err = new Error('UNIQUE constraint failed: subscribers.email');
        if (typeof callback === 'function') {
          callback.call(null, err);
        }
        return;
      }

      const newId = data.subscribers.length > 0 ? Math.max(...data.subscribers.map(s => s.id)) + 1 : 1;
      const newRecord = {
        id: newId,
        email,
        created_at: new Date().toISOString()
      };

      data.subscribers.push(newRecord);
      saveData(data);

      if (typeof callback === 'function') {
        callback.call({ lastID: newId }, null);
      }
      return;
    }

    // Default fallback for unhandled SQL statements
    if (typeof callback === 'function') {
      callback.call(null, new Error(`Unsupported SQL run statement: ${sql}`));
    }
  },

  all(sql, params, callback) {
    const sqlUpper = sql.toUpperCase();
    const data = loadData();

    if (sqlUpper.includes('FROM INQUIRIES')) {
      if (!data.inquiries) data.inquiries = [];
      // Sort by created_at DESC
      const rows = [...data.inquiries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      if (typeof callback === 'function') {
        callback(null, rows);
      }
      return;
    }

    if (sqlUpper.includes('FROM SUBSCRIBERS')) {
      if (!data.subscribers) data.subscribers = [];
      // Sort by created_at DESC
      const rows = [...data.subscribers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      if (typeof callback === 'function') {
        callback(null, rows);
      }
      return;
    }

    if (typeof callback === 'function') {
      callback(new Error(`Unsupported SQL all query: ${sql}`), null);
    }
  }
};

// Simulate startup initialization
console.log('[DATABASE] Connected to JSON database wrapper.');
const dbInstance = db;
dbInstance.serialize(() => {
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      project_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
