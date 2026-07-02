import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export default function ProductList({ onSelectProduct, initialCategory = '' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Fetch unique categories on mount
  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  // Fetch products whenever filters or search terms change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (selectedCategory) params.append('category', selectedCategory);
    if (sortBy) params.append('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, [search, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Rwandan Craft Collection</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse through unique items hand-made by women weaving and sculpting collectives.</p>
        </div>

        {/* Filter Controls Bar */}
        <div 
          className="glass"
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center'
          }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
            <input 
              type="text" 
              placeholder="Search crafts, categories, or artisans..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px', marginBottom: 0 }}
            />
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
            <Filter size={16} style={{ color: 'var(--primary)' }} />
            <select 
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="form-input"
              style={{ padding: '10px 14px', marginBottom: 0 }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sorting Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--primary)' }} />
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-input"
              style={{ padding: '10px 14px', marginBottom: 0 }}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(search || selectedCategory || sortBy !== 'newest') && (
            <button 
              onClick={handleResetFilters}
              className="btn btn-text"
              style={{ fontSize: '14px', fontWeight: '600' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Products Grid list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>Fetching artisan products...</div>
            <p>Please wait a moment.</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No items match your search</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Try typing a different keyword or resetting your filters.</p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Show All Crafts
            </button>
          </div>
        ) : (
          <div className="grid-products">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
