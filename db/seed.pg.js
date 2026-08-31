const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adjectives = ['Classic', 'Slim Fit', 'Vintage', 'Casual', 'Premium', 'Sporty', 'Urban', 'Relaxed'];
const items = ['T-Shirt', 'Denim Jacket', 'Hoodie', 'Sneakers', 'Cap', 'Jeans', 'Summer Dress', 'Scarf', 'Wool Coat', 'Shorts', 'Sweater', 'Skirt'];

async function seed() {
  await pool.query(fs.readFileSync(path.join(__dirname, 'schema.pg.sql'), 'utf8'));

  const { rows } = await pool.query('SELECT COUNT(*) AS n FROM products');
  if (Number(rows[0].n) > 0) {
    console.log(`Already seeded (${rows[0].n} products). Truncate the products table to reseed.`);
    await pool.end();
    return;
  }

  for (const [i, item] of items.entries()) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const name = `${adjective} ${item}`;
    const price = Math.round((Math.random() * 100 + 15) * 100) / 100;
    const image = `https://placehold.co/500x600?text=Item+${i}`;
    const description = `A ${adjective.toLowerCase()} ${item.toLowerCase()} made for everyday wear.`;
    await pool.query(
      'INSERT INTO products (name, price, image, description) VALUES ($1, $2, $3, $4)',
      [name, price, image, description]
    );
  }

  console.log(`Seeded ${items.length} products.`);
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
