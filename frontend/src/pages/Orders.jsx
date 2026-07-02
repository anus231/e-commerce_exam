import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Package, MapPin, DollarSign, Eye } from 'lucide-react';

export default function Orders({ onSelectOrder }) {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authFetch('/api/orders/my-orders')
      .then(data => {
        setOrders(data.orders);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load orders:', err);
        setError(err.message || 'Failed to retrieve order history');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h3>Loading your order history...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3 style={{ color: '#dc2626' }}>{error}</h3>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Track shipment updates and review receipts of past purchases.</p>

        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <Package size={48} style={{ strokeWidth: '1.5', marginBottom: '16px', color: 'var(--text-muted)', opacity: 0.5 }} />
            <h3>No orders found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>You haven't placed any orders with this account yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div 
                key={order.id} 
                className="glass card-hover"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '20px',
                  alignItems: 'center'
                }}
              >
                {/* Order Meta details */}
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '16px' }}>Order #AGS-00{order.id}</span>
                    <span className={`badge ${
                      order.status === 'delivered' ? 'badge-success' :
                      order.status === 'shipped' ? 'badge-primary' :
                      order.status === 'cancelled' ? 'badge-danger' :
                      'badge-warning'
                    }`} style={order.status === 'cancelled' ? { backgroundColor: '#fee2e2', color: '#dc2626' } : {}}>
                      {order.status}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '20px', 
                    fontSize: '13px', 
                    color: 'var(--text-muted)' 
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={14} /> Total: <strong>${parseFloat(order.total_amount).toFixed(2)}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> Address: {order.shipping_address.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Inspect button */}
                <div>
                  <button 
                    onClick={() => onSelectOrder(order.id)}
                    className="btn btn-outline"
                    style={{ 
                      padding: '10px 16px', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye size={14} /> View Invoice
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
