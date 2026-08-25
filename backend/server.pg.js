const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

app.get('/api/products', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products');
  res.json(rows);
});

app.get('/api/products/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
  res.json(rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Shop running at http://localhost:${PORT}`));
