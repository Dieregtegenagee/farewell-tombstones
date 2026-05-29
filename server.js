require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'farwell.db');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'farwell-admin-token';

const dataDirectory = path.dirname(DB_PATH);
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Unable to open database:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submittedAt TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productType TEXT NOT NULL,
    material TEXT NOT NULL,
    size TEXT NOT NULL,
    engraving TEXT,
    quantity INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    notes TEXT,
    orderedAt TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    available INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL
  )`);

  db.get('SELECT COUNT(*) as count FROM materials', (err, row) => {
    if (!err && row && row.count === 0) {
      const now = new Date().toISOString();
      const stmt = db.prepare('INSERT INTO materials (name, description, available, createdAt) VALUES (?, ?, ?, ?)');
      stmt.run('Black Granite', 'Durable and classic finish.', 1, now);
      stmt.run('Gray Granite', 'Neutral tone with strong durability.', 1, now);
      stmt.run('White Marble', 'Elegant and polished memorial stone.', 1, now);
      stmt.finalize();
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid admin password.' });
  }

  res.json({ success: true, token: ADMIN_TOKEN });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please complete all fields.' });
  }

  const submittedAt = new Date().toISOString();
  const sql = `INSERT INTO contacts (name, email, message, submittedAt) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, email, message, submittedAt], function (err) {
    if (err) {
      console.error('Contact save error:', err);
      return res.status(500).json({ success: false, message: 'Unable to save contact right now.' });
    }

    console.log('New contact:', { id: this.lastID, name, email, message, submittedAt });
    res.json({ success: true, message: 'Your message has been submitted.' });
  });
});

app.post('/api/order', (req, res) => {
  const { productType, material, size, engraving, quantity, name, email, notes } = req.body;
  if (!productType || !material || !size || !name || !email) {
    return res.status(400).json({ success: false, message: 'Please complete all required order fields.' });
  }

  const orderedAt = new Date().toISOString();
  const sql = `INSERT INTO orders (productType, material, size, engraving, quantity, name, email, notes, orderedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [productType, material, size, engraving || '', quantity, name, email, notes || '', orderedAt], function (err) {
    if (err) {
      console.error('Order save error:', err);
      return res.status(500).json({ success: false, message: 'Unable to submit order right now.' });
    }

    console.log('New order:', { id: this.lastID, productType, material, size, engraving, quantity, name, email, notes, orderedAt });
    res.json({ success: true, message: 'Your order request has been received. We will follow up soon.' });
  });
});

app.get('/api/contacts', requireAdmin, (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY submittedAt DESC', [], (err, rows) => {
    if (err) {
      console.error('Contacts fetch error:', err);
      return res.status(500).json({ success: false, message: 'Unable to load contacts.' });
    }
    res.json({ contacts: rows });
  });
});

app.get('/api/orders', requireAdmin, (req, res) => {
  db.all('SELECT * FROM orders ORDER BY orderedAt DESC', [], (err, rows) => {
    if (err) {
      console.error('Orders fetch error:', err);
      return res.status(500).json({ success: false, message: 'Unable to load orders.' });
    }
    res.json({ orders: rows });
  });
});

app.get('/api/materials', (req, res) => {
  db.all('SELECT * FROM materials ORDER BY id ASC', [], (err, rows) => {
    if (err) {
      console.error('Materials fetch error:', err);
      return res.status(500).json({ success: false, message: 'Unable to load materials.' });
    }
    res.json({ materials: rows });
  });
});

app.post('/api/materials', requireAdmin, (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Material name is required.' });
  }

  const createdAt = new Date().toISOString();
  const sql = `INSERT INTO materials (name, description, available, createdAt) VALUES (?, ?, 1, ?)`;
  db.run(sql, [name, description || '', createdAt], function (err) {
    if (err) {
      console.error('Material save error:', err);
      return res.status(500).json({ success: false, message: 'Unable to save material.' });
    }
    res.json({ success: true, material: { id: this.lastID, name, description: description || '', available: 1, createdAt } });
  });
});

app.put('/api/materials/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, available } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Material name is required.' });
  }

  const sql = `UPDATE materials SET name = ?, description = ?, available = ? WHERE id = ?`;
  db.run(sql, [name, description || '', available ? 1 : 0, id], function (err) {
    if (err) {
      console.error('Material update error:', err);
      return res.status(500).json({ success: false, message: 'Unable to update material.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Material not found.' });
    }
    res.json({ success: true, message: 'Material updated.' });
  });
});

app.listen(PORT, () => {
  console.log(`Farwell Tombstones server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  db.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});
