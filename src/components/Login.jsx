import { useState } from 'react';

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock authentication - in real app, this would call an API
    if (email === 'admin@cyberquiz.com' && password === 'admin123') {
      onLogin({ email, role: 'admin' });
    } else if (email && password) {
      onLogin({ email, role: 'student' });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="cyber-bg" style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
      <div className="cyber-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="cyber-card" style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
          <h2>Cyber Login</h2>
          
          {error && (
            <div style={{ 
              color: '#ff4757', 
              textAlign: 'center', 
              marginBottom: '20px',
              padding: '10px',
              background: 'rgba(255, 71, 87, 0.1)',
              borderRadius: '4px',
              border: '1px solid #ff4757'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="cyber-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="cyber-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="cyber-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="cyber-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="cyber-btn">
              Access System
            </button>
          </form>

          <div className="cyber-form-footer">
            <p style={{ color: '#a0a0b0' }}>
              Don't have an account?{' '}
              <span 
                className="cyber-link" 
                onClick={onSwitchToSignup}
                style={{ cursor: 'pointer' }}
              >
                Register Now
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
