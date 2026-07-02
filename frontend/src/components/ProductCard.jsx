import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, MapPin, Sparkles } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigating to detail page when clicking button
    addToCart(product, 1);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  // Generative SVG placeholder (used as fallback when real image fails to load)
  const renderPlaceholderImage = () => {
    const hue = (product.name.length * 15) % 360;
    return (
      <div style={{
        width: '100%',
        height: '240px',
        background: `linear-gradient(135deg, hsl(${hue}, 60%, 45%), hsl(${(hue + 60) % 360}, 60%, 25%))`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
          <pattern id={`pat-${product.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 40 L 20 0 L 40 40 Z" fill="none" stroke="white" strokeWidth="2" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pat-${product.id})`} />
        </svg>
        <Sparkles size={40} style={{ marginBottom: '12px', zIndex: 1, color: 'var(--accent)' }} />
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          {product.name}
        </h4>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginTop: '5px', zIndex: 1 }}>
          {product.category}
        </span>
      </div>
    );
  };

  // Track whether the real image failed to load
  const [imgError, setImgError] = React.useState(false);

  return (
    <div 
      className="glass card-hover" 
      onClick={() => onSelect(product.id)}
      style={{
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Product Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '240px',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s ease'
            }}
          />
        ) : (
          renderPlaceholderImage()
        )}

        {/* Category Badge */}
        <span 
          className="badge badge-primary"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontSize: '11px',
            letterSpacing: '0.5px'
          }}
        >
          {product.category}
        </span>

        {/* Stock Alerts */}
        {isOutOfStock && (
          <span 
            className="badge" 
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#ef4444',
              color: 'white'
            }}
          >
            Out of Stock
          </span>
        )}
        {isLowStock && (
          <span 
            className="badge badge-warning" 
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px'
            }}
          >
            Only {product.stock} Left
          </span>
        )}
      </div>

      {/* Product Details */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontFamily: 'var(--font-body)', 
          fontWeight: '600',
          lineHeight: '1.4',
          marginBottom: '8px',
          color: 'var(--dark)'
        }}>
          {product.name}
        </h3>
        
        {/* Artisan Info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          fontSize: '13px', 
          color: 'var(--text-muted)',
          marginBottom: '15px'
        }}>
          <MapPin size={14} style={{ color: 'var(--primary)' }} />
          <span>By {product.artisan_name} ({product.artisan_location.split(',')[0]})</span>
        </div>

        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flexGrow: 1
        }}>
          {product.description}
        </p>

        {/* Price and Cart Button */}
        <div className="flex-between" style={{ marginTop: 'auto' }}>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: 'var(--secondary)' 
          }}>
            ${parseFloat(product.price).toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'}`}
            style={{ 
              padding: '8px 12px', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px'
            }}
            aria-label="Add to Cart"
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
