import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, Plus, Minus, ShoppingCart, MapPin, Sparkles, UserRoundCheck } from 'lucide-react';

export default function ProductDetail({ productId, onBackNav, onSelectProduct }) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [detailImgError, setDetailImgError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setQuantity(1); // Reset quantity selector
    
    // Fetch product details
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        
        // Fetch related products in the same category
        fetch(`/api/products?category=${data.product.category}`)
          .then(res => res.json())
          .then(relData => {
            // Exclude the current product from related items
            const filteredRel = relData.products.filter(p => p.id !== data.product.id).slice(0, 3);
            setRelated(filteredRel);
          })
          .catch(err => console.error(err));
          
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load product details:', err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h3>Loading craft details...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3>Craft item not found</h3>
        <button onClick={onBackNav} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    } else {
      alert(`Only ${product.stock} items available in stock.`);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  // Generate color palette based on product name length for placeholders
  const hue = (product.name.length * 15) % 360;

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Back Button */}
        <button 
          onClick={onBackNav}
          className="btn btn-text"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        {/* Product Details Split Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '50px',
          marginBottom: '80px'
        }}>
          
          {/* Left Side: Product Image */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            height: '420px',
            position: 'relative'
          }}>
            {product.image_url && !detailImgError ? (
              <img
                src={product.image_url}
                alt={product.name}
                onError={() => setDetailImgError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, hsl(${hue}, 60%, 45%), hsl(${(hue + 60) % 360}, 60%, 25%))`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                padding: '40px'
              }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }} xmlns="http://www.w3.org/2000/svg">
                  <pattern id="detail-pat" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 20 40 L 40 0" fill="none" stroke="white" strokeWidth="2" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#detail-pat)" />
                </svg>
                <Sparkles size={56} style={{ color: 'var(--accent)', marginBottom: '16px', zIndex: 1 }} />
                <h2 style={{ color: 'white', fontSize: '32px', fontFamily: 'var(--font-heading)', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  {product.name}
                </h2>
                <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginTop: '8px', zIndex: 1 }}>
                  {product.category}
                </span>
              </div>
            )}
          </div>

          {/* Right Side: Details Info */}
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
              <span className="badge badge-primary">{product.category}</span>
              {product.stock > 0 ? (
                <span className="badge badge-success">In Stock ({product.stock} available)</span>
              ) : (
                <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>Out of Stock</span>
              )}
            </div>

            <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>{product.name}</h1>
            
            {/* Price */}
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--secondary)', marginBottom: '24px' }}>
              ${parseFloat(product.price).toFixed(2)}
            </div>

            {/* Description */}
            <p style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '30px', lineHeight: '1.7' }}>
              {product.description}
            </p>

            {/* Meet the Artisan (UX Highlight / Storytelling) */}
            <div 
              style={{
                backgroundColor: 'var(--primary-light)',
                borderLeft: '4px solid var(--primary)',
                padding: '20px',
                borderRadius: '0 12px 12px 0',
                marginBottom: '32px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary)' }}>
                <UserRoundCheck size={18} />
                <h4 style={{ fontWeight: '700', fontSize: '15px' }}>Meet the Artisan</h4>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)' }}>
                This piece is handcrafted by <strong>{product.artisan_name}</strong> in the <strong>{product.artisan_location}</strong>. 
                Using sweetgrass and sisal fibers collected in their natural habitats, this item is a result of centuries-old Rwandan craftsmanship. Sourcing this product provides fair wages directly to {product.artisan_name.split(' ')[0]}'s family and her weaving collective.
              </p>
            </div>

            {/* Actions: Quantity & Add to Cart */}
            {product.stock > 0 ? (
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                
                {/* Quantity Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Quantity</span>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    height: '48px'
                  }}>
                    <button 
                      onClick={decrementQty}
                      style={{ border: 'none', background: 'none', padding: '0 16px', cursor: 'pointer', height: '100%' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 8px', fontSize: '16px', fontWeight: '700', width: '32px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button 
                      onClick={incrementQty}
                      style={{ border: 'none', background: 'none', padding: '0 16px', cursor: 'pointer', height: '100%' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Add to Basket button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                  <span style={{ height: '18px' }}></span> {/* spacer */}
                  <button 
                    onClick={handleAddToCart}
                    className="btn btn-primary"
                    style={{ height: '48px', width: '100%', fontSize: '16px' }}
                  >
                    <ShoppingCart size={18} /> Add to Basket
                  </button>
                </div>

              </div>
            ) : (
              <button className="btn btn-disabled" style={{ width: '100%', height: '48px' }} disabled>
                Out of Stock
              </button>
            )}

          </div>
        </div>

        {/* Related Items Section */}
        {related.length > 0 && (
          <div>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--border)', marginBottom: '50px' }} />
            <h3 style={{ fontSize: '26px', marginBottom: '30px' }}>Related Handcrafts</h3>
            <div className="grid-products">
              {related.map(relProd => (
                <ProductCard 
                  key={relProd.id}
                  product={relProd}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
