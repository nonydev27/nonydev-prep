import { useState } from 'react';

export default function Login({ onLogin, onSwitchToSignup }) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Registered students database with reference numbers
  const registeredStudents = {
    '22479389': 'Adu Boahen Jerry Nana Yao',
    '22391240': 'Dekyi Cheryl Saah',
    '21855561': 'Agyeman Nana Yaw',
    '21839316': 'Benniton Otumfuo-Nyarko',
    '21875777': 'Memunatu Lukman',

  };

  // Default password for all students
  const DEFAULT_PASSWORD = '12345';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!referenceNumber || !password) {
      setError('Please fill in all fields');
      return;
    }

    const refNum = referenceNumber.toUpperCase().trim();
    
    // Check if student is registered
    if (registeredStudents[refNum]) {
      const studentName = registeredStudents[refNum];
      if (password === DEFAULT_PASSWORD) {
        onLogin({ 
          referenceNumber: refNum, 
          name: studentName, 
          role: 'student' 
        });
      } else {
        setError('Invalid password. Please try again.');
      }
    } else {
      // Check for admin login
      if (refNum === 'ADMIN' && password === 'admin123') {
        onLogin({ referenceNumber: 'ADMIN', name: 'Administrator', role: 'admin' });
      } else {
        setError('Reference number not found. Please register first.');
      }
    }
  };

  return (
    <div className="cyber-bg" style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: -1,
      overflow: 'auto'
    }}>
      <div className="cyber-container" style={{ 
        position: 'relative', 
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="cyber-card" style={{ 
          position: 'relative', 
          zIndex: 1, 
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '420px'
        }}>
          <h2>CSM 153 / EE287 - Circuit Theory Exam</h2>
          <p style={{ color: '#a0a0b0', marginBottom: '20px', textAlign: 'center' }}>
            Login to access your exam
          </p>
          
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
              <label htmlFor="referenceNumber">Reference Number</label>
              <input
                type="text"
                id="referenceNumber"
                className="cyber-input"
                placeholder="Enter your reference number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                autoComplete="username"
                style={{ textTransform: 'uppercase' }}
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

            <button type="submit" className="cyber-btn" style={{ width: '100%' }}>
              Access Exam
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
