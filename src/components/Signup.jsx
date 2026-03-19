import { useState } from 'react';

export default function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Mock signup - in real app, this would call an API
    onSignup({ name, email, role: 'student' });
  };

  return (
    <div className="cyber-bg" style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
      <div className="cyber-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="cyber-card" style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
          <h2>Cyber Register</h2>
          
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
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                className="cyber-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="cyber-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="cyber-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="cyber-btn">
              Create Account
            </button>
          </form>

          <div className="cyber-form-footer">
            <p style={{ color: '#a0a0b0' }}>
              Already have an account?{' '}
              <span 
                className="cyber-link" 
                onClick={onSwitchToLogin}
                style={{ cursor: 'pointer' }}
              >
                Login Here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
