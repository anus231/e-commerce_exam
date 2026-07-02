import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'var(--dark)', 
      color: 'rgba(255, 255, 255, 0.7)', 
      padding: '60px 0 30px 0', 
      marginTop: 'auto',
      borderTop: '5px solid var(--accent)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Column 1: Brand & Bio */}
          <div>
            <h3 style={{ 
              color: 'white', 
              fontFamily: 'var(--font-heading)', 
              fontSize: '22px', 
              marginBottom: '20px' 
            }}>
              Ansu <span style={{ color: 'var(--accent)' }}>Sirleaf</span>
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              Celebrating Rwandan heritage by bringing authentic, hand-woven baskets, Imigongo art, and handmade crafts from local artisans straight to the global market.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {/* Simple Social Icons placeholders */}
              <span style={{ color: 'white', fontWeight: 'bold' }}>#VisitRwanda</span>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>#MadeInRwanda</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>About the Artisans</a>
              </li>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>The Ansu Sirleaf Story</a>
              </li>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>Imigongo Art Process</a>
              </li>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>Sustainable Harvesting</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Customer Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>Shipping & Returns</a>
              </li>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>Secure Payments (Mobile Money)</a>
              </li>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>FAQ</a>
              </li>
              <li style={{ marginBottom: '10px', fontSize: '14px' }}>
                <a href="#" style={{ color: 'inherit' }} onClick={e => e.preventDefault()}>Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Local Contact Info */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Our Office
            </h4>
            <p style={{ fontSize: '14px', marginBottom: '10px', lineHeight: '1.6' }}>
              <strong>Ansu Sirleaf Ltd.</strong><br />
              Street KK 508 ST<br />
              Kigali, Gasabo District, Rwanda
            </p>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>
              <strong>Phone:</strong> +250 791 591 773
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Email:</strong> info@ansusirleaf.rw
            </p>
          </div>
        </div>

        <hr style={{ border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '20px' }} />

        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '20px', fontSize: '13px' }}>
          <p>© {new Date().getFullYear()} Ansu Sirleaf. Developed for UNILAK E-Commerce Final Project.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
