import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, LogOut, Menu, X, Settings } from 'lucide-react';

export default function Navbar({ onCartToggle, onAdminNav, onHomeNav, onProductsNav, onLoginNav, onOrdersNav, activePage }) {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onHomeNav();
    setMobileMenuOpen(false);
  };

  return (
    <header className="header-wrapper glass">
      <div className="imigongo-accent-border"></div>
      <div className="container flex-between" style={{ height: '72px' }}>
        {/* Logo / Brand */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onHomeNav(); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
          }}>
            A
          </span>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '22px', 
            fontWeight: '700', 
            letterSpacing: '0.5px',
            color: 'var(--dark)'
          }}>
            Ansu <span style={{ color: 'var(--primary)' }}>Sirleaf</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="desktop-only">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onHomeNav(); }}
            style={{ fontWeight: activePage === 'home' ? '600' : '400', color: activePage === 'home' ? 'var(--primary)' : 'var(--text-main)' }}
          >
            Home
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onProductsNav(); }}
            style={{ fontWeight: activePage === 'products' ? '600' : '400', color: activePage === 'products' ? 'var(--primary)' : 'var(--text-main)' }}
          >
            Shop Crafts
          </a>
          {user && (
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onOrdersNav(); }}
              style={{ fontWeight: activePage === 'orders' ? '600' : '400', color: activePage === 'orders' ? 'var(--primary)' : 'var(--text-main)' }}
            >
              My Orders
            </a>
          )}
          {isAdmin && (
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onAdminNav(); }}
              style={{ 
                fontWeight: activePage === 'admin' ? '600' : '400', 
                color: activePage === 'admin' ? 'var(--secondary)' : 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(21, 94, 69, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              <Settings size={16} /> Admin Panel
            </a>
          )}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* User Profile / Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-only">
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Muraho, <strong>{user.name.split(' ')[0]}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-text"
                style={{ padding: '6px', color: 'var(--text-muted)' }}
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginNav}
              className="btn btn-outline desktop-only"
              style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
            >
              Sign In
            </button>
          )}

          {/* Cart Icon Toggler */}
          <button 
            onClick={onCartToggle}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              position: 'relative',
              padding: '6px',
              color: 'var(--dark)'
            }}
            aria-label="Toggle Shopping Cart"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggler */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
            className="mobile-only"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '72px',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: 'var(--shadow-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99
        }} className="mobile-only animate-fade-in">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onHomeNav(); setMobileMenuOpen(false); }}
            style={{ fontSize: '16px', fontWeight: activePage === 'home' ? '600' : '400', color: activePage === 'home' ? 'var(--primary)' : 'var(--text-main)' }}
          >
            Home
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onProductsNav(); setMobileMenuOpen(false); }}
            style={{ fontSize: '16px', fontWeight: activePage === 'products' ? '600' : '400', color: activePage === 'products' ? 'var(--primary)' : 'var(--text-main)' }}
          >
            Shop Crafts
          </a>
          {user && (
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onOrdersNav(); setMobileMenuOpen(false); }}
              style={{ fontSize: '16px', fontWeight: activePage === 'orders' ? '600' : '400', color: activePage === 'orders' ? 'var(--primary)' : 'var(--text-main)' }}
            >
              My Orders
            </a>
          )}
          {isAdmin && (
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onAdminNav(); setMobileMenuOpen(false); }}
              style={{ 
                fontSize: '16px', 
                fontWeight: activePage === 'admin' ? '600' : '400', 
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Settings size={18} /> Admin Dashboard
            </a>
          )}
          <hr style={{ border: 'none', borderBottom: '1px solid var(--border)' }} />
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '14px' }}>Logged in as: <strong>{user.email}</strong></div>
              <button 
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { onLoginNav(); setMobileMenuOpen(false); }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Sign In
            </button>
          )}
        </div>
      )}
      
      {/* CSS stylesheet helper for layout responsiveness within component */}
      <style>{`
        @media(min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media(max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </header>
  );
}
