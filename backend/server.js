require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), database: db.dbType, environment: process.env.NODE_ENV || 'development' });
});

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

async function initPostgres() {
  if (db.dbType !== 'postgres') return;
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    await db.query(schema);
    console.log('PostgreSQL schema applied.');
    const check = await db.query('SELECT COUNT(*) FROM users');
    if (parseInt(check.rows[0].count) === 0) {
      const seed = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');
      await db.query(seed);
      console.log('PostgreSQL seed data loaded.');
    }
  } catch (err) {
    console.error('PostgreSQL init error:', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initPostgres();
});
