import { useState } from 'react';

export default function StudentDashboard({ onLogout, user, onStartQuiz }) {
  const [quizzes] = useState([
    { 
      id: 1, 
      title: 'JavaScript Fundamentals', 
      questions: 20, 
      duration: 30, 
      description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
      status: 'active' 
    },
    { 
      id: 2, 
      title: 'React Basics', 
      questions: 15, 
      duration: 20, 
      description: 'Learn about React components, hooks, and state management.',
      status: 'active' 
    },
    { 
      id: 3, 
      title: 'Python Programming', 
      questions: 25, 
      duration: 45, 
      description: 'Python fundamentals including data types, loops, and functions.',
      status: 'coming_soon' 
    },
  ]);

  return (
    <div className="cyber-bg" style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
      <div className="admin-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="admin-header">
          <h1>Cyber Quiz Portal</h1>
          <p style={{ color: '#a0a0b0', marginTop: '10px' }}>
            Welcome, {user?.name || user?.email || 'Student'}
          </p>
        </div>

        <div className="admin-nav">
          <button className="admin-nav-btn active">
            Available Quizzes
          </button>
          <button 
            className="admin-nav-btn"
            onClick={onLogout}
            style={{ borderColor: '#ff4757', color: '#ff4757' }}
          >
            Logout
          </button>
        </div>

        <div className="quiz-list">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-item" style={{ flexDirection: 'column', gap: '15px' }}>
              <div className="quiz-item-info">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <p style={{ marginTop: '10px', color: '#53CBF3' }}>
                  📝 {quiz.questions} Questions • ⏱️ {quiz.duration} Minutes
                </p>
              </div>
              <div className="quiz-item-actions" style={{ justifyContent: 'flex-end' }}>
                {quiz.status === 'active' ? (
                  <button 
                    className="quiz-action-btn"
                    onClick={() => onStartQuiz(quiz.id)}
                    style={{ background: '#5478FF', color: '#fff' }}
                  >
                    Start Quiz
                  </button>
                ) : (
                  <button 
                    className="quiz-action-btn"
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          maxWidth: '600px', 
          margin: '40px auto 0',
          padding: '20px',
          border: '1px solid #5478FF',
          borderRadius: '8px',
          background: 'rgba(84, 120, 255, 0.05)'
        }}>
          <h3 style={{ color: '#FFDE42', marginBottom: '15px' }}>⚠️ Important Instructions</h3>
          <ul style={{ color: '#a0a0b0', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Once you start a quiz, you cannot leave the page</li>
            <li>Copy/Paste and Print shortcuts are disabled</li>
            <li>Right-click is disabled during the exam</li>
            <li>If you try to leave the page, a warning will be triggered</li>
            <li>Make sure you have a stable internet connection</li>
            <li>Keep the quiz password safe - you'll need it to start</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
