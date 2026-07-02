const db = require('../config/db');

// Get Admin Analytics Dashboard Data
async function getDashboardStats(req, res) {
  try {
    // 1. Total revenue and total orders count
    const summaryResult = await db.query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_revenue, 
        COUNT(id) as total_orders 
      FROM orders 
      WHERE status != 'cancelled'
    `);
    const { total_revenue, total_orders } = summaryResult.rows[0];

    // 2. Orders broken down by status
    const statusResult = await db.query(`
      SELECT status, COUNT(id) as count 
      FROM orders 
      GROUP BY status
    `);
    const statusBreakdown = statusResult.rows;

    // 3. Sales by category
    const categoryResult = await db.query(`
      SELECT 
        p.category, 
        SUM(oi.quantity) as items_sold, 
        COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.category
      ORDER BY revenue DESC
    `);
    const categorySales = categoryResult.rows;

    // 4. Top selling products
    const topProductsResult = await db.query(`
      SELECT 
        p.id,
        p.name, 
        p.category, 
        p.artisan_name,
        SUM(oi.quantity) as quantity_sold, 
        COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id, p.name, p.category, p.artisan_name
      ORDER BY total_revenue DESC
      LIMIT 5
    `);
    const topProducts = topProductsResult.rows;

    // 5. Recent orders
    const recentOrdersResult = await db.query(`
      SELECT id, customer_name, customer_email, total_amount, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);
    const recentOrders = recentOrdersResult.rows;

    res.json({
      summary: {
        totalRevenue: parseFloat(total_revenue),
        totalOrders: parseInt(total_orders),
        averageOrderValue: total_orders > 0 ? parseFloat(total_revenue) / parseInt(total_orders) : 0
      },
      statusBreakdown,
      categorySales,
      topProducts,
      recentOrders
    });

  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Failed to retrieve analytics data' });
  }
}

module.exports = {
  getDashboardStats
};
