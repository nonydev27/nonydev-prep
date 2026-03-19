import { useState } from 'react';
import './cyber-theme.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import StudentDashboard from './components/StudentDashboard';
import Quiz from './components/Quiz';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('dashboard');
    }
  };

  // Handle signup
  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setSelectedQuiz(null);
  };

  // Start a quiz
  const handleStartQuiz = (quizId) => {
    setSelectedQuiz(quizId);
    setCurrentPage('quiz');
  };

  // Switch to signup
  const handleSwitchToSignup = () => {
    setCurrentPage('signup');
  };

  // Switch to login
  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignup={handleSwitchToSignup}
          />
        );
      case 'signup':
        return (
          <Signup 
            onSignup={handleSignup} 
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case 'admin':
        return (
          <Admin 
            user={user} 
            onLogout={handleLogout}
          />
        );
      case 'dashboard':
        return (
          <StudentDashboard 
            user={user}
            onLogout={handleLogout}
            onStartQuiz={handleStartQuiz}
          />
        );
      case 'quiz':
        return (
          <Quiz 
            user={user}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignup={handleSwitchToSignup}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
