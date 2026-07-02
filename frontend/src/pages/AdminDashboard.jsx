import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, ShoppingCart, BarChart3, TrendingUp, RefreshCw, Eye } from 'lucide-react';

export default function AdminDashboard({ onSelectOrder }) {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch Dashboard statistics on load & whenever refreshed
  useEffect(() => {
    setLoading(true);
    authFetch('/api/analytics/stats')
      .then(data => {
        setStats(data);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats:', err);
        setError(err.message || 'Failed to load dashboard statistics.');
        setLoading(false);
      });
  }, [refreshKey]);

  // Update order status from the table
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const result = await authFetch(`/api/orders/admin/status/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      // Trigger dashboard reload
      setRefreshKey(k => k + 1);
      alert(`Order #${orderId} updated to: ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update order status');
    }
  };

  if (loading && !stats) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h3>Loading Analytics Dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3 style={{ color: '#dc2626' }}>{error}</h3>
        <button onClick={() => setRefreshKey(k => k + 1)} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Retry
        </button>
      </div>
    );
  }

  const { summary, statusBreakdown, categorySales, topProducts, recentOrders } = stats;

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Dashboard Title */}
        <div className="flex-between" style={{ marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Business Intelligence Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-time sales, order fulfillment, and artisan collective metrics.</p>
          </div>
          <button 
            onClick={() => setRefreshKey(k => k + 1)} 
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} /> Refresh Metrics
          </button>
        </div>

        {/* 1. METRICS GRID CARD */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Card 1: Total Sales */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '5px solid var(--secondary)' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Total Revenue</span>
              <div style={{ padding: '6px', backgroundColor: '#e6f4ea', color: 'var(--secondary)', borderRadius: '6px' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--dark)' }}>
              ${summary.totalRevenue.toFixed(2)}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              Gross sales from completed orders.
            </span>
          </div>

          {/* Card 2: Total Orders */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '5px solid var(--primary)' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Total Orders</span>
              <div style={{ padding: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '6px' }}>
                <ShoppingCart size={18} />
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--dark)' }}>
              {summary.totalOrders}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              Customer transactions placed.
            </span>
          </div>

          {/* Card 3: AOV */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '5px solid var(--accent)' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Average Order Value</span>
              <div style={{ padding: '6px', backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--accent)', borderRadius: '6px' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--dark)' }}>
              ${summary.averageOrderValue.toFixed(2)}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              Mean checkout basket value.
            </span>
          </div>
        </div>

        {/* 2. ANALYTICS SPLIT SECTION */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Top Products */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Top Selling Products
            </h3>
            {topProducts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No sales data available yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {topProducts.map((prod, index) => (
                  <div key={prod.id} className="flex-between" style={{ fontSize: '14px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: 'var(--primary)', width: '20px' }}>#{index + 1}</span>
                      <div>
                        <h4 style={{ fontWeight: '600' }}>{prod.name}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Category: {prod.category} | By {prod.artisan_name}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', display: 'block' }}>${parseFloat(prod.total_revenue).toFixed(2)}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{prod.quantity_sold} sold</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sales by Category */}
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Category Distribution
            </h3>
            {categorySales.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No sales data available yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {categorySales.map(cat => {
                  const percent = summary.totalRevenue > 0 
                    ? (parseFloat(cat.revenue) / summary.totalRevenue) * 100 
                    : 0;
                  return (
                    <div key={cat.category} style={{ fontSize: '14px' }}>
                      <div className="flex-between" style={{ marginBottom: '6px' }}>
                        <span style={{ fontWeight: '600' }}>{cat.category}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          ${parseFloat(cat.revenue).toFixed(2)} ({percent.toFixed(0)}%)
                        </span>
                      </div>
                      {/* Simple Pure CSS progress bar */}
                      <div style={{ height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${percent}%`, 
                          height: '100%', 
                          backgroundColor: 'var(--secondary)', 
                          borderRadius: 'inherit',
                          transition: 'width 0.6s ease'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 3. RECENT ORDERS FULL TABLE */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            Recent Transactions & Fulfillment
          </h3>
          
          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>No orders have been placed yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Order ID</th>
                  <th style={{ padding: '12px 8px' }}>Customer Details</th>
                  <th style={{ padding: '12px 8px' }}>Amount</th>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                  <th style={{ padding: '12px 8px' }}>Current Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 8px', fontWeight: '700' }}>#AGS-00{order.id}</td>
                    <td style={{ padding: '16px 8px' }}>
                      <span style={{ fontWeight: '600', display: 'block' }}>{order.customer_name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.customer_email}</span>
                    </td>
                    <td style={{ padding: '16px 8px', fontWeight: '700', color: 'var(--secondary)' }}>
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span className={`badge ${
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'shipped' ? 'badge-primary' :
                        order.status === 'cancelled' ? 'badge-danger' :
                        'badge-warning'
                      }`} style={order.status === 'cancelled' ? { backgroundColor: '#fee2e2', color: '#dc2626' } : {}}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        {/* Status update select */}
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '12px', width: 'auto', marginBottom: 0 }}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          onClick={() => onSelectOrder(order.id)}
                          className="btn btn-text"
                          style={{ padding: '6px', color: 'var(--text-muted)' }}
                          title="Inspect Order Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
