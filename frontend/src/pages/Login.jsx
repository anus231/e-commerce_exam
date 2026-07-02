import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login({ onRegisterNav, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '80px 0 120px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to view your orders and manage profile.</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            marginBottom: '24px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input" 
                placeholder="e.g. buyer@example.com"
                style={{ paddingLeft: '40px' }}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input" 
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'} <LogIn size={16} style={{ marginLeft: '4px' }} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onRegisterNav(); }}
            style={{ color: 'var(--primary)', fontWeight: '600' }}
          >
            Create Account
          </a>
        </div>

        {/* Demo Credentials Help Box */}
        <div style={{ 
          marginTop: '30px', 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px', 
          fontSize: '13px',
          borderLeft: '4px solid var(--secondary)'
        }}>
          <h4 style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--secondary)' }}>Demo Account Details:</h4>
          <p><strong>Admin:</strong> admin@ansusirleaf.rw / admin123</p>
          <p style={{ marginTop: '4px' }}><strong>Note:</strong> Guest checkout is supported; you do not need to register to place orders!</p>
        </div>

      </div>
    </div>
  );
}
