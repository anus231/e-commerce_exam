import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Smartphone, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function Checkout({ onOrderConfirmed }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MoMo'); // 'MoMo' or 'Card'

  // Payment Sim States
  const [momoNumber, setMomoNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UI States
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Validate Rwandan phone number format
  const validatePhone = (phone) => {
    const rawPhone = phone.replace(/[\s-]/g, '');
    const rwPhoneRegex = /^(?:\+250|0)?7[2389]\d{7}$/;
    return rwPhoneRegex.test(rawPhone);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate main details
    if (!customerName.trim()) newErrors.customerName = 'Full name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) newErrors.customerEmail = 'Please provide a valid email address';
    
    if (!validatePhone(customerPhone)) {
      newErrors.customerPhone = 'Provide a valid Rwandan phone number (e.g. +250 788 XX XX XX or 0788 XXXXXX)';
    }

    if (!shippingAddress.trim()) newErrors.shippingAddress = 'Shipping address is required';

    // Validate payment sub-details
    if (paymentMethod === 'MoMo') {
      if (!validatePhone(momoNumber)) {
        newErrors.momoNumber = 'Provide a valid MoMo phone number (+250 78/79/72/73...)';
      }
    } else {
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) newErrors.cardExpiry = 'Expiry must be MM/YY';
      if (!/^\d{3}$/.test(cardCvv)) newErrors.cardCvv = 'CVV must be 3 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process payment simulation and order creation
    setErrors({});
    setIsProcessing(true);

    try {
      if (paymentMethod === 'MoMo') {
        setProcessingStep('Sending Mobile Money prompt to your phone...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessingStep('Awaiting your approval (simulated)...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        setProcessingStep('Authorizing credit card transaction with bank...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setProcessingStep('Creating order and updating inventory...');
      
      // Call Backend API to create order
      const token = localStorage.getItem('ansusirleaf_token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          paymentMethod,
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success
      clearCart();
      setIsProcessing(false);
      onOrderConfirmed(data.order);

    } catch (err) {
      console.error(err);
      alert(err.message || 'Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3>Your shopping cart is empty</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Add items to your cart before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0', position: 'relative' }}>
      <div className="container">
        
        <h1 style={{ fontSize: '36px', marginBottom: '32px' }}>Secure Checkout</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1.3fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* Left Side: Form Details */}
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Shipping & Customer Information
            </h3>

            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Marie Keza"
                />
                {errors.customerName && <div className="form-error">{errors.customerName}</div>}
              </div>

              <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    value={customerEmail} 
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="form-input"
                    placeholder="e.g. keza@example.com"
                  />
                  {errors.customerEmail && <div className="form-error">{errors.customerEmail}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input 
                    type="tel" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="form-input"
                    placeholder="e.g. +250 788 123 456"
                  />
                  {errors.customerPhone && <div className="form-error">{errors.customerPhone}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address (District, Sector, Street)</label>
                <textarea 
                  value={shippingAddress} 
                  onChange={e => setShippingAddress(e.target.value)}
                  className="form-input"
                  rows="3"
                  placeholder="e.g. Kigali, Gasabo, Kimironko, KK 123 St, House 45"
                  style={{ resize: 'vertical' }}
                />
                {errors.shippingAddress && <div className="form-error">{errors.shippingAddress}</div>}
              </div>

              {/* Payment Selector */}
              <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                Payment Method (Simulated)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div 
                  onClick={() => setPaymentMethod('MoMo')}
                  style={{
                    border: paymentMethod === 'MoMo' ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: paymentMethod === 'MoMo' ? 'var(--primary-light)' : 'white',
                    transition: 'var(--transition)'
                  }}
                >
                  <Smartphone size={24} style={{ color: paymentMethod === 'MoMo' ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '8px' }} />
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>Mobile Money</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MTN MoMo / Airtel Money</span>
                </div>

                <div 
                  onClick={() => setPaymentMethod('Card')}
                  style={{
                    border: paymentMethod === 'Card' ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: paymentMethod === 'Card' ? 'var(--primary-light)' : 'white',
                    transition: 'var(--transition)'
                  }}
                >
                  <CreditCard size={24} style={{ color: paymentMethod === 'Card' ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '8px' }} />
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>Credit / Debit Card</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Visa / Mastercard</span>
                </div>
              </div>

              {/* Payment Details Subform */}
              {paymentMethod === 'MoMo' ? (
                <div className="form-group animate-fade-in">
                  <label className="form-label">MTN/Airtel Registered Phone Number</label>
                  <input 
                    type="tel" 
                    value={momoNumber} 
                    onChange={e => setMomoNumber(e.target.value)}
                    className="form-input"
                    placeholder="e.g. +250 788 123 456"
                  />
                  {errors.momoNumber && <div className="form-error">{errors.momoNumber}</div>}
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                    You will receive a simulated push prompt on this number to approve payment.
                  </span>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Marie Keza" defaultValue={customerName} />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="form-input" 
                      placeholder="4000 1234 5678 9010" 
                    />
                    {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input 
                        type="text" 
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="form-input" 
                        placeholder="MM/YY" 
                      />
                      {errors.cardExpiry && <div className="form-error">{errors.cardExpiry}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV Code</label>
                      <input 
                        type="password" 
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        className="form-input" 
                        placeholder="123" 
                        maxLength="3"
                      />
                      {errors.cardCvv && <div className="form-error">{errors.cardCvv}</div>}
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: '20px', display: 'flex', gap: '8px' }}
              >
                Place Order (${cartTotal.toFixed(2)}) <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Right Side: Order Summary */}
          <div>
            <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {cartItems.map(item => (
                  <div key={item.id} className="flex-between">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}>
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="flex-between" style={{ fontSize: '14px' }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '14px' }}>
                  <span>Shipping (Rwanda Standard)</span>
                  <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>FREE</span>
                </div>
                <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />
                <div className="flex-between" style={{ fontSize: '18px', fontWeight: '800' }}>
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--secondary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              padding: '20px',
              color: 'var(--text-muted)',
              fontSize: '13px'
            }}>
              <ShieldCheck size={36} style={{ color: 'var(--secondary)' }} />
              <span>Your transaction is encrypted securely. Funds are released to the artisan collective after successful craft inspection.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Simulated Payment Overlay Loader */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '24px'
        }}>
          <Loader2 size={64} className="animate-spin" style={{ color: 'var(--accent)', marginBottom: '24px', animation: 'spin 1.5s linear infinite' }} />
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-body)', fontWeight: '700', marginBottom: '12px' }}>
            Processing Transaction
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '400px' }}>
            {processingStep}
          </p>
        </div>
      )}

      {/* CSS Spin Helper */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          display: inline-block;
        }
      `}</style>

    </div>
  );
}
