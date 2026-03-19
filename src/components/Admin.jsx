import { useState } from 'react';

export default function Admin({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [quizzes, setQuizzes] = useState([
    { 
      id: 1, 
      title: 'JavaScript Fundamentals', 
      questions: 20, 
      duration: 30, 
      password: 'JS2024',
      status: 'active' 
    },
    { 
      id: 2, 
      title: 'React Basics', 
      questions: 15, 
      duration: 20, 
      password: 'REACT24',
      status: 'active' 
    },
    { 
      id: 3, 
      title: 'Python Programming', 
      questions: 25, 
      duration: 45, 
      password: 'PYTHON24',
      status: 'draft' 
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: '',
    duration: '',
    password: ''
  });

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    const quiz = {
      id: quizzes.length + 1,
      ...newQuiz,
      questions: parseInt(newQuiz.questions),
      duration: parseInt(newQuiz.duration),
      status: 'draft'
    };
    setQuizzes([...quizzes, quiz]);
    setShowCreateForm(false);
    setNewQuiz({ title: '', questions: '', duration: '', password: '' });
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setQuizzes(quizzes.map(q => {
      if (q.id === id) {
        return { ...q, status: q.status === 'active' ? 'draft' : 'active' };
      }
      return q;
    }));
  };

  return (
    <div className="cyber-bg" style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
      <div className="admin-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="admin-header">
          <h1>Cyber Quiz Admin</h1>
          <p style={{ color: '#a0a0b0', marginTop: '10px' }}>
            Welcome, {user?.email || 'Administrator'}
          </p>
        </div>

        <div className="admin-nav">
          <button 
            className={`admin-nav-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            Manage Quizzes
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => { setActiveTab('create'); setShowCreateForm(true); }}
          >
            Create Quiz
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            View Results
          </button>
          <button 
            className="admin-nav-btn"
            onClick={onLogout}
            style={{ borderColor: '#ff4757', color: '#ff4757' }}
          >
            Logout
          </button>
        </div>

        {activeTab === 'quizzes' && (
          <div className="quiz-list">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="quiz-item">
                <div className="quiz-item-info">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.questions} Questions • {quiz.duration} Minutes • Password: {quiz.password}</p>
                  <p style={{ marginTop: '5px', color: quiz.status === 'active' ? '#2ed573' : '#ff4757' }}>
                    Status: {quiz.status.toUpperCase()}
                  </p>
                </div>
                <div className="quiz-item-actions">
                  <button 
                    className="quiz-action-btn"
                    onClick={() => handleToggleStatus(quiz.id)}
                  >
                    {quiz.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    className="quiz-action-btn danger"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="cyber-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Create New Quiz</h2>
            <form onSubmit={handleCreateQuiz}>
              <div className="cyber-form-group">
                <label htmlFor="quizTitle">Quiz Title</label>
                <input
                  type="text"
                  id="quizTitle"
                  className="cyber-input"
                  placeholder="Enter quiz title"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  required
                />
              </div>

              <div className="cyber-form-group">
                <label htmlFor="quizQuestions">Number of Questions</label>
                <input
                  type="number"
                  id="quizQuestions"
                  className="cyber-input"
                  placeholder="Enter number of questions"
                  value={newQuiz.questions}
                  onChange={(e) => setNewQuiz({ ...newQuiz, questions: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className="cyber-form-group">
                <label htmlFor="quizDuration">Duration (minutes)</label>
                <input
                  type="number"
                  id="quizDuration"
                  className="cyber-input"
                  placeholder="Enter duration in minutes"
                  value={newQuiz.duration}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className="cyber-form-group">
                <label htmlFor="quizPassword">Quiz Password</label>
                <input
                  type="text"
                  id="quizPassword"
                  className="cyber-input"
                  placeholder="Enter quiz password"
                  value={newQuiz.password}
                  onChange={(e) => setNewQuiz({ ...newQuiz, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="cyber-btn">
                Create Quiz
              </button>
            </form>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="quiz-list">
            <div className="quiz-item">
              <div className="quiz-item-info">
                <h3>No results yet</h3>
                <p>Students haven't taken any quizzes yet.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
