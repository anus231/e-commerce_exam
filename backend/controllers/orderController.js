const db = require('../config/db');

// Create Order (uses database transaction)
async function createOrder(req, res) {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      shippingAddress, 
      paymentMethod, 
      items 
    } = req.body;

    const userId = req.user ? req.user.id : null; // null if guest checkout

    // Basic Input Validation
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !paymentMethod || !items || !items.length) {
      return res.status(400).json({ message: 'All fields are required and cart cannot be empty' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: 'Invalid customer email address' });
    }

    // Rwandan phone number validation support (+25078..., +25079..., +25072..., +25073... or 078..., etc.)
    const rwPhoneRegex = /^(?:\+250|0)?7[2389]\d{7}$/;
    if (!rwPhoneRegex.test(customerPhone.replace(/[\s-]/g, ''))) {
      return res.status(400).json({ message: 'Invalid Rwandan phone number format. Use e.g. +250 788 XX XX XX' });
    }

    // Process order inside a transaction
    const orderDetails = await db.transaction(async (trxQuery) => {
      let totalAmount = 0;
      const verifiedItems = [];

      // 1. Verify products and check/update inventory
      for (const item of items) {
        const productResult = await trxQuery('SELECT * FROM products WHERE id = $1', [item.productId]);
        const product = productResult.rows[0];

        if (!product) {
          throw new Error(`Product with ID ${item.productId} does not exist`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        // Deduct inventory
        await trxQuery('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.productId]);

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        verifiedItems.push({
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          price: product.price
        });
      }

      // Simulate payment status - since it's a simulated checkout, set status to 'paid' immediately
      const orderStatus = 'paid';

      // 2. Insert order header
      const orderInsertSql = `
        INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, shipping_address, payment_method, total_amount, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, customer_name, customer_email, total_amount, status, created_at
      `;
      const orderInsertParams = [
        userId, 
        customerName, 
        customerEmail.toLowerCase(), 
        customerPhone, 
        shippingAddress, 
        paymentMethod, 
        totalAmount, 
        orderStatus
      ];

      const orderResult = await trxQuery(orderInsertSql, orderInsertParams);
      let order = orderResult.rows[0];

      // SQLite compatibility for RETURNING
      if (!order && db.dbType === 'sqlite') {
        const insertId = orderResult.insertId;
        const fetchResult = await trxQuery(
          'SELECT id, customer_name, customer_email, total_amount, status, created_at FROM orders WHERE id = $1',
          [insertId]
        );
        order = fetchResult.rows[0];
      }

      const orderId = order.id;

      // 3. Insert order items
      for (const item of verifiedItems) {
        await trxQuery(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.productId, item.quantity, item.price]
        );
      }

      return {
        ...order,
        items: verifiedItems
      };
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: orderDetails
    });

  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(400).json({ message: error.message || 'Failed to place the order' });
  }
}

// Get Order by ID (checks permissions - must be the user who ordered, or admin)
async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    
    // Fetch order details
    const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    const order = orderResult.rows[0];

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions: admins can see all, customers can only see their own
    if (req.user.role !== 'admin' && order.user_id !== req.user.id && order.customer_email !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized to view this order' });
    }

    // Fetch order items with product details
    const itemsResult = await db.query(`
      SELECT oi.*, p.name as product_name, p.image_url, p.category 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);

    order.items = itemsResult.rows;
    res.json({ order });
  } catch (error) {
    console.error('Get Order by ID Error:', error);
    res.status(500).json({ message: 'Failed to retrieve order details' });
  }
}

// Get Logged-in Customer Orders
async function getMyOrders(req, res) {
  try {
    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 OR customer_email = $2 ORDER BY created_at DESC',
      [req.user.id, req.user.email]
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ message: 'Failed to retrieve order history' });
  }
}

// Get All Orders (Admin only)
async function getAllOrders(req, res) {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ message: 'Failed to retrieve orders list' });
  }
}

// Update Order Status (Admin only)
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );

    let updatedOrder = result.rows[0];

    // SQLite compatibility
    if (!updatedOrder && db.dbType === 'sqlite') {
      const checkResult = await db.query('SELECT id, status FROM orders WHERE id = $1', [id]);
      updatedOrder = checkResult.rows[0];
    }

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
