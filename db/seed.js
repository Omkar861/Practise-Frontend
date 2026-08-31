const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'shop.db'));
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

const already = db.prepare('SELECT COUNT(*) AS n FROM products').get().n;
if (already > 0) {
  console.log(`Already seeded (${already} products). Delete db/shop.db to reseed.`);
  process.exit(0);
}

const adjectives = ['Classic', 'Slim Fit', 'Vintage', 'Casual', 'Premium', 'Sporty', 'Urban', 'Relaxed'];
const items = ['T-Shirt', 'Denim Jacket', 'Hoodie', 'Sneakers', 'Cap', 'Jeans', 'Summer Dress', 'Scarf', 'Wool Coat', 'Shorts', 'Sweater', 'Skirt'];

const insert = db.prepare('INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)');

items.forEach((item, i) => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const name = `${adjective} ${item}`;
  const price = Math.round((Math.random() * 100 + 15) * 100) / 100;
  const image = `https://placehold.co/500x600?text=Item+${i}`;
  const description = `A ${adjective.toLowerCase()} ${item.toLowerCase()} made for everyday wear.`;
  insert.run(name, price, image, description);
});

console.log(`Seeded ${items.length} products.`);
