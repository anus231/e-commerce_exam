import React from 'react';
import { CheckCircle, Calendar, MapPin, Truck, ExternalLink } from 'lucide-react';

export default function OrderConfirmation({ order, onProductsNav, onOrdersNav }) {
  if (!order) return null;

  // Estimate delivery dates based on standard rules
  const getDeliveryEstimation = () => {
    const today = new Date(order.created_at || new Date());
    const minDays = 2;
    const maxDays = 5;
    
    const minDelivery = new Date(today);
    minDelivery.setDate(today.getDate() + minDays);

    const maxDelivery = new Date(today);
    maxDelivery.setDate(today.getDate() + maxDays);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${minDelivery.toLocaleDateString('en-US', options)} - ${maxDelivery.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '60px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        
        {/* Success Tick Banner */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <CheckCircle size={72} style={{ color: 'var(--secondary)', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Turiya Muhire!</h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Thank you for supporting local artisans. Your order has been placed.</p>
        </div>

        {/* Invoice styled Details */}
        <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
          {/* Traditional motif header */}
          <div className="imigongo-accent-border" style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '20px 20px 0 0' }}></div>
          
          <div style={{ marginTop: '10px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Order ID</span>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>#AGS-00{order.id}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</span>
                <span className="badge badge-success" style={{ display: 'block', marginTop: '4px' }}>Paid (Simulated)</span>
              </div>
            </div>

            {/* Delivery Estimation Card */}
            <div style={{ 
              backgroundColor: 'var(--primary-light)', 
              borderRadius: 'var(--radius-md)', 
              padding: '20px', 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'center',
              marginBottom: '30px' 
            }}>
              <Truck size={36} style={{ color: 'var(--primary)' }} />
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '15px' }}>Estimated Delivery</h4>
                <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--secondary)' }}>{getDeliveryEstimation()}</p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Standard delivery is 2 days for Kigali, and 5 days for upcountry.</span>
              </div>
            </div>

            {/* Customer Details Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              <div>
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Shipping To</h4>
                <p style={{ fontSize: '15px', fontWeight: '600' }}>{order.customer_name}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'flex', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {order.shipping_address}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Phone: {order.customer_phone}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Billing Summary</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-main)' }}>Payment: <strong>{order.payment_method === 'MoMo' ? 'Mobile Money' : 'Credit Card'}</strong></p>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '4px' }}>Email: {order.customer_email}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Items Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
              {order.items && order.items.map(item => (
                <div key={item.productId} className="flex-between" style={{ fontSize: '14px' }}>
                  <span>{item.name} <strong>x {item.quantity}</strong></span>
                  <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Total Block */}
            <div className="flex-between" style={{ fontSize: '20px', fontWeight: '800' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--secondary)' }}>${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>

          </div>
        </div>

        {/* Action button rows */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '40px', justifyContent: 'center' }}>
          <button onClick={onProductsNav} className="btn btn-primary">
            Continue Shopping
          </button>
          <button 
            onClick={onOrdersNav} 
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            View Order History <ExternalLink size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
