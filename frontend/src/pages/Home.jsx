import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Gift, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export default function Home({ onProductsNav, onSelectProduct }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products (limit to 4)
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.products.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      
      {/* 1. HERO SECTION */}
      <section className="imigongo-hero" style={{ padding: '80px 0', minHeight: '520px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div>
            <span style={{ 
              backgroundColor: 'var(--accent)', 
              color: 'var(--dark)', 
              fontWeight: '700', 
              fontSize: '12px', 
              padding: '6px 12px', 
              borderRadius: 'var(--radius-sm)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              Authentic Made in Rwanda
            </span>
            <h1 style={{ 
              fontSize: 'clamp(36px, 5vw, 56px)', 
              color: 'white', 
              marginBottom: '20px',
              lineHeight: '1.15'
            }}>
              Preserving Heritage, <br />
              <span style={{ color: 'var(--accent)' }}>Empowering Artisans.</span>
            </h1>
            <p style={{ 
              fontSize: '17px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginBottom: '32px',
              maxWidth: '500px'
            }}>
              Discover premium, hand-woven baskets, geometrically sculpted Imigongo paintings, and traditional crafts crafted in the heart of Rwanda.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={onProductsNav} className="btn btn-primary" style={{ padding: '14px 28px' }}>
                Explore Collection <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => {
                  const section = document.getElementById('artisans');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="btn btn-outline" 
                style={{ borderColor: 'white', color: 'white', padding: '14px 28px' }}
              >
                Meet the Artisans
              </button>
            </div>
          </div>
          
          {/* Creative Graphical Showcase */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            position: 'relative'
          }}>
            <div style={{
              width: '320px',
              height: '320px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              textAlign: 'center'
            }}>
              {/* Inner graphic decoration */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                bottom: '12px',
                border: '2px dashed rgba(255,255,255,0.2)',
                borderRadius: 'inherit'
              }}></div>
              <Sparkles size={56} style={{ color: 'white', marginBottom: '16px' }} />
              <h3 style={{ color: 'white', fontSize: '24px', marginBottom: '8px' }}>Ansu Sirleaf Collection</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Woven in Huye. A symbol of reconciliation, peace, and mutual respect.</p>
              <span style={{ 
                marginTop: '16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                color: 'white',
                fontWeight: '600'
              }}>
                Featured Item
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STATS */}
      <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--primary)', padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px' }}>
                <HeartHandshake size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>100% Fair Trade</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>We return 85% of all proceeds directly to local artisan weavers and wood sculptors.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--secondary)', padding: '12px', backgroundColor: '#e6f4ea', borderRadius: '12px' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>Local Sourcing</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Crafted with sustainably gathered local sweetgrass, sisal fibers, and jacaranda wood.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent)', padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                <Gift size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>Gift Packaging</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Each basket contains a card detailing the artisan’s name, Province, and personal story.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES ROW */}
      <section style={{ padding: '60px 0' }} className="imigongo-pattern">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Craft Categories</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>Filter by traditional specialties sourced from distinct regions of Rwanda.</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {['Baskets', 'Art & Painting', 'Home Decor', 'Apparel & Accessories'].map(cat => (
              <div 
                key={cat} 
                onClick={onProductsNav}
                className="glass card-hover" 
                style={{ 
                  padding: '30px 20px', 
                  textAlign: 'center', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: 'pointer',
                  borderTop: '4px solid var(--primary)'
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>{cat}</h3>
                <span style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Browse items <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '32px' }}>Featured Artistry</h2>
              <p style={{ color: 'var(--text-muted)' }}>Popular hand-crafted selections from our regional collectives.</p>
            </div>
            <button onClick={onProductsNav} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              View All Products <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Loading products...
            </div>
          ) : (
            <div className="grid-products">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onSelect={onSelectProduct} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. ARTISAN NARRATIVE (Innovation Bonus) */}
      <section id="artisans" style={{ padding: '80px 0', backgroundColor: 'var(--secondary)', color: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
          
          {/* Swatch/Illustration */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              width: '100%',
              height: '350px',
              background: 'linear-gradient(135deg, var(--accent), var(--primary))',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'var(--dark)', fontSize: '28px', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                Marie Mukamanzi
              </h3>
              <p style={{ color: 'var(--dark)', fontWeight: '500', fontSize: '15px' }}>
                Huye Weaver Collective
              </p>
              <div style={{ 
                marginTop: '20px', 
                padding: '10px 20px', 
                backgroundColor: 'rgba(26,28,32,0.15)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '13px',
                maxWidth: '240px'
              }}>
                "Wove her first basket in 2004"
              </div>
            </div>
          </div>

          <div>
            <span style={{
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'block',
              marginBottom: '12px'
            }}>
              Featured Artisan
            </span>
            <h2 style={{ fontSize: '36px', color: 'white', marginBottom: '20px' }}>
              The Hands Behind <br />the Baskets
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.7' }}>
              Marie Mukamanzi is a mother of four living in Huye District. Following the traditional methods taught by her grandmother, she meticulously selects sisal fibers and dyes them with natural extracts from bark and roots. 
            </p>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px', lineHeight: '1.7' }}>
              "Weaving together in our cooperative is not just work; it is how we share stories, support one another, and build schools for our children. Every basket is woven with love and hopes for our country’s future."
            </p>
            <button onClick={onProductsNav} className="btn" style={{ backgroundColor: 'var(--accent)', color: 'var(--dark)', fontWeight: '700' }}>
              Shop Marie's Baskets
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
