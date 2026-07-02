import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function Register({ onLoginNav, onRegisterSuccess }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      onRegisterSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '80px 0 120px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '440px', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join us to save shipping details and track order histories.</p>
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
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-input" 
                placeholder="e.g. Marie Keza"
                style={{ paddingLeft: '40px' }}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          </div>

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
            <label className="form-label">Password (Min 6 chars)</label>
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
            {loading ? 'Creating Account...' : 'Create Account'} <UserPlus size={16} style={{ marginLeft: '4px' }} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onLoginNav(); }}
            style={{ color: 'var(--primary)', fontWeight: '600' }}
          >
            Sign In
          </a>
        </div>

      </div>
    </div>
  );
}
