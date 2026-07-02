const db = require('../config/db');

// Get All Products (with filtering, search, and sorting)
async function getAllProducts(req, res) {
  try {
    const { q, category, sort } = req.query;
    
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCounter = 1;

    // Search query (case-insensitive across name, description, and artisan details)
    if (q) {
      sql += ` AND (LOWER(name) LIKE $${paramCounter} OR LOWER(description) LIKE $${paramCounter} OR LOWER(artisan_name) LIKE $${paramCounter})`;
      params.push(`%${q.toLowerCase()}%`);
      paramCounter++;
    }

    // Category filter
    if (category) {
      sql += ` AND category = $${paramCounter}`;
      params.push(category);
      paramCounter++;
    }

    // Sorting
    if (sort === 'price_asc') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY price DESC';
    } else {
      sql += ' ORDER BY created_at DESC'; // default sort by newest
    }

    const result = await db.query(sql, params);
    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get All Products Error:', error);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
}

// Get Product by ID
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    const product = result.rows[0];

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get Product by ID Error:', error);
    res.status(500).json({ message: 'Failed to retrieve product details' });
  }
}

// Get Distinct Product Categories
async function getCategories(req, res) {
  try {
    const result = await db.query('SELECT DISTINCT category FROM products ORDER BY category ASC');
    const categories = result.rows.map(row => row.category);
    res.json({ categories });
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ message: 'Failed to retrieve product categories' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getCategories
};
