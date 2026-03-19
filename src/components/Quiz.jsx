import { useState, useEffect, useCallback } from 'react';

export default function Quiz({ onLogout, user }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCheatAlert, setShowCheatAlert] = useState(false);
  const [cheatAlertMessage, setCheatAlertMessage] = useState('');

  // Sample quiz data
  const quizData = {
    title: 'JavaScript Fundamentals',
    duration: 30, // minutes
    questions: [
      {
        id: 1,
        text: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var myVar = 5', 'variable myVar = 5', 'let = 5', 'int myVar = 5'],
        correct: 0
      },
      {
        id: 2,
        text: 'Which method is used to add an element to the end of an array?',
        options: ['add()', 'append()', 'push()', 'insert()'],
        correct: 2
      },
      {
        id: 3,
        text: 'What does === operator do in JavaScript?',
        options: [
          'Assigns a value',
          'Compares value only',
          'Compares value and type',
          'Creates a function'
        ],
        correct: 2
      },
      {
        id: 4,
        text: 'Which keyword is used to define a constant in JavaScript?',
        options: ['var', 'let', 'const', 'constant'],
        correct: 2
      },
      {
        id: 5,
        text: 'What is the output of typeof null?',
        options: ['null', 'undefined', 'object', 'boolean'],
        correct: 2
      }
    ]
  };

  // Anti-cheating: Disable specific keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        triggerCheatAlert('Printing is disabled during the exam!');
        return false;
      }
      
      // Disable Ctrl+C (Copy)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        triggerCheatAlert('Copying is disabled during the exam!');
        return false;
      }
      
      // Disable Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        triggerCheatAlert('Saving is disabled during the exam!');
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        triggerCheatAlert('View source is disabled during the exam!');
        return false;
      }

      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        triggerCheatAlert('Developer tools are disabled during the exam!');
        return false;
      }

      // Disable Right Click
      if (e.button === 2) {
        e.preventDefault();
        triggerCheatAlert('Right-click is disabled during the exam!');
        return false;
      }
    };

    // Disable context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerCheatAlert('Right-click is disabled during the exam!');
      return false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Anti-cheating: Detect when user tries to leave the site
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      setShowExitAlert(true);
      return '';
    };

    const handleVisibilityChange = () => {
      if (document.hidden && quizStarted) {
        setShowExitAlert(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [quizStarted]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - submit quiz
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted]);

  const triggerCheatAlert = (message) => {
    setCheatAlertMessage(message);
    setShowCheatAlert(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'JS2024') {
      setShowPasswordModal(false);
      setQuizStarted(true);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let score = 0;
    quizData.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        score++;
      }
    });
    
    alert(`Quiz submitted!\nYour score: ${score}/${quizData.questions.length}`);
    onLogout();
  };

  const currentQ = quizData.questions[currentQuestion];

  return (
    <div className="cyber-bg" style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="password-modal">
          <div className="password-modal-content">
            <h3>🔒 Enter Quiz Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="cyber-form-group">
                <input
                  type="password"
                  className="cyber-input"
                  placeholder="Enter quiz password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              {passwordError && (
                <p style={{ color: '#ff4757', marginBottom: '15px' }}>{passwordError}</p>
              )}
              <button type="submit" className="cyber-btn">
                Start Quiz
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cheat Detection Alert */}
      {showCheatAlert && (
        <div className="cyber-alert" onClick={() => setShowCheatAlert(false)}>
          <div className="cyber-alert-box" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Warning!</h3>
            <p>{cheatAlertMessage}</p>
            <button 
              className="cyber-btn" 
              onClick={() => setShowCheatAlert(false)}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Exit Alert */}
      {showExitAlert && quizStarted && (
        <div className="cyber-alert">
          <div className="cyber-alert-box">
            <h3>⚠️ Cheating Alert!</h3>
            <p>You are not allowed to leave the exam page!</p>
            <button 
              className="cyber-btn" 
              onClick={() => setShowExitAlert(false)}
            >
              Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* Timer */}
      {quizStarted && (
        <div className={`cyber-timer ${timeLeft < 300 ? 'warning' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      )}

      {/* Quiz Content */}
      {quizStarted && (
        <div className="quiz-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="quiz-header">
            <div className="quiz-title">{quizData.title}</div>
            <div className="quiz-progress">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </div>
          </div>

          <div className="question-card">
            <div className="question-number">
              Question {currentQuestion + 1}
            </div>
            <div className="question-text">
              {currentQ.text}
            </div>

            <div className="answer-options">
              {currentQ.options.map((option, idx) => (
                <div 
                  key={idx}
                  className={`answer-option ${answers[currentQuestion] === idx ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(idx)}
                >
                  <div className="answer-option-marker">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <button 
              className="cyber-btn cyber-btn-secondary"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>

            {currentQuestion === quizData.questions.length - 1 ? (
              <button 
                className="cyber-btn"
                onClick={handleSubmitQuiz}
                style={{ background: 'linear-gradient(135deg, #2ed573, #1e8449)' }}
              >
                Submit Quiz
              </button>
            ) : (
              <button 
                className="cyber-btn"
                onClick={handleNextQuestion}
              >
                Next Question
              </button>
            )}
          </div>

          {/* Question Navigation Dots */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '10px', 
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            {quizData.questions.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: idx === currentQuestion ? '#53CBF3' : 
                             answers[idx] !== undefined ? '#5478FF' : 'transparent',
                  border: `2px solid ${idx === currentQuestion ? '#53CBF3' : '#5478FF'}`,
                  color: idx === currentQuestion ? '#0a0a1a' : '#ffffff',
                  fontSize: '12px',
                  transition: 'all 0.3s ease'
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
