const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, '../db/shop.db'));
const app = express();

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/products', (req, res) => {
  res.json(db.prepare('SELECT * FROM products').all());
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Shop running at http://localhost:${PORT}`));
