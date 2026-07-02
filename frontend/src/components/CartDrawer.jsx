import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onCheckoutNav }) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onCheckoutNav();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }} onClick={onClose}>
      
      {/* Drawer content pane */}
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'white',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }} 
        className="animate-slide-in"
        onClick={e => e.stopPropagation()} // Prevent closing drawer when clicking inside
      >
        {/* Drawer Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }} className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-body)', fontWeight: '700' }}>Your Basket</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Items List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px' }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <ShoppingBag size={48} style={{ strokeWidth: '1.5', marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Your basket is empty</p>
              <p style={{ fontSize: '13px' }}>Browse our collection of beautiful Rwandan handicrafts to add items.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  {/* Small colored swatch as a mock image */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {item.name.charAt(0)}
                  </div>

                  {/* Item Details */}
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ 
                      fontSize: '15px', 
                      fontFamily: 'var(--font-body)', 
                      fontWeight: '600',
                      marginBottom: '4px',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      Category: {item.category}
                    </span>

                    {/* Quantity Controls & Delete */}
                    <div className="flex-between">
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden'
                      }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                          style={{ border: 'none', background: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                          style={{ border: 'none', background: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--dark)' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Checkout Panel */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--light)'
          }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Estimated Total</span>
              <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--secondary)' }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Secure Checkout
            </button>

            <button 
              onClick={clearCart}
              className="btn btn-text"
              style={{ width: '100%', marginTop: '12px', fontSize: '13px', color: '#dc2626' }}
            >
              Empty Shopping Basket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
