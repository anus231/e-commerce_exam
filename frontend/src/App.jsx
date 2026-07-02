import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'products', 'detail', 'checkout', 'confirm', 'orders', 'admin', 'login', 'register'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toggle Cart Drawer
  const handleCartToggle = () => setIsCartOpen(prev => !prev);
  const handleCartClose = () => setIsCartOpen(false);

  // Helper to view single order details (re-uses invoice page format)
  const handleViewInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('ansusirleaf_token');
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch invoice details');
      }

      setConfirmedOrder(data.order);
      setActivePage('confirm');
    } catch (err) {
      alert(err.message || 'Failed to load order invoice');
    }
  };

  // Main page routing logic
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home 
            onProductsNav={() => setActivePage('products')}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActivePage('detail');
            }}
          />
        );
      case 'products':
        return (
          <ProductList 
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActivePage('detail');
            }}
          />
        );
      case 'detail':
        return (
          <ProductDetail 
            productId={selectedProductId}
            onBackNav={() => setActivePage('products')}
            onSelectProduct={(id) => setSelectedProductId(id)}
          />
        );
      case 'checkout':
        return (
          <Checkout 
            onOrderConfirmed={(order) => {
              setConfirmedOrder(order);
              setActivePage('confirm');
            }}
          />
        );
      case 'confirm':
        return (
          <OrderConfirmation 
            order={confirmedOrder}
            onProductsNav={() => setActivePage('products')}
            onOrdersNav={() => setActivePage('orders')}
          />
        );
      case 'orders':
        return (
          <Orders 
            onSelectOrder={handleViewInvoice}
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            onSelectOrder={handleViewInvoice}
          />
        );
      case 'login':
        return (
          <Login 
            onRegisterNav={() => setActivePage('register')}
            onLoginSuccess={() => setActivePage('home')}
          />
        );
      case 'register':
        return (
          <Register 
            onLoginNav={() => setActivePage('login')}
            onRegisterSuccess={() => setActivePage('home')}
          />
        );
      default:
        return <Home onProductsNav={() => setActivePage('products')} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Shared Header Navigation */}
      <Navbar 
        activePage={activePage}
        onHomeNav={() => setActivePage('home')}
        onProductsNav={() => setActivePage('products')}
        onOrdersNav={() => setActivePage('orders')}
        onAdminNav={() => setActivePage('admin')}
        onLoginNav={() => setActivePage('login')}
        onCartToggle={handleCartToggle}
      />

      {/* Main Page Area */}
      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>

      {/* Shared Footer Panel */}
      <Footer />

      {/* Slid-out Shopping Cart sidebar */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onCheckoutNav={() => setActivePage('checkout')}
      />
    </div>
  );
}
