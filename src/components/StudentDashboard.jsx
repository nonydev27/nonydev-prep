import { useState } from 'react';

export default function StudentDashboard({ onLogout, user, onStartQuiz }) {
  const [quizzes] = useState([
    { 
      id: 1, 
      title: 'CSM 153 / EE287 - Circuit Theory', 
      questions: 80, 
      duration: 120, 
      description: 'Comprehensive Circuit Theory exam covering: Introduction, Direct Circuit Analysis, Magnetism, AC Theory, Mesh Analysis, and Nodal Analysis.',
      status: 'active',
      examPassword: 'CIRCUIT2024'
    },
  ]);

  // Get user's name - prioritize name field, fall back to reference number
  const displayName = user?.name || user?.referenceNumber || 'Student';

  return (
    <div className="cyber-bg" style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
      <div className="admin-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="admin-header">
          <h1>CSM 153 / EE287 - Circuit Theory Exam Portal</h1>
          <p style={{ color: '#a0a0b0', marginTop: '10px' }}>
            Welcome, <span style={{ color: '#53CBF3', fontWeight: 'bold' }}>{displayName}</span>
          </p>
          {user?.referenceNumber && (
            <p style={{ color: '#a0a0b0', fontSize: '14px' }}>
              Reference Number: <span style={{ color: '#FFDE42' }}>{user.referenceNumber}</span>
            </p>
          )}
        </div>

        <div className="admin-nav">
          <button className="admin-nav-btn active">
            Available Exams
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
                  📝 {quiz.questions} Questions • ⏱️ {quiz.duration} Minutes (2 Hours)
                </p>
                <p style={{ marginTop: '5px', color: '#FFDE42' }}>
                  ⚠️ Exam Time: 3:00 PM - 5:00 PM
                </p>
              </div>
              <div className="quiz-item-actions" style={{ justifyContent: 'flex-end' }}>
                {quiz.status === 'active' ? (
                  <button 
                    className="quiz-action-btn"
                    onClick={() => onStartQuiz(quiz.id)}
                    style={{ background: '#5478FF', color: '#fff' }}
                  >
                    Start Exam
                  </button>
                ) : (
                  <button 
                    className="quiz-action-btn"
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          maxWidth: '700px', 
          margin: '40px auto 0',
          padding: '20px',
          border: '1px solid #5478FF',
          borderRadius: '8px',
          background: 'rgba(84, 120, 255, 0.05)'
        }}>
          <h3 style={{ color: '#FFDE42', marginBottom: '15px' }}>⚠️ Exam Instructions</h3>
          <ul style={{ color: '#a0a0b0', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>You have exactly <strong>2 hours (120 minutes)</strong> to complete all 80 questions</li>
            <li>Once you start the exam, you cannot leave the page or refresh</li>
            <li>Copy/Paste and Print shortcuts are disabled</li>
            <li>Right-click is disabled during the exam</li>
            <li>If you try to leave the page, a warning will be triggered</li>
            <li>Make sure you have a stable internet connection before starting</li>
            <li>The exam will automatically submit when time runs out</li>
            <li>You can navigate between questions using the navigation dots</li>
            <li>Your answers are saved as you progress through questions</li>
          </ul>
        </div>

        <div style={{ 
          maxWidth: '700px', 
          margin: '20px auto 0',
          padding: '20px',
          border: '1px solid #2ed573',
          borderRadius: '8px',
          background: 'rgba(46, 213, 115, 0.05)'
        }}>
          <h3 style={{ color: '#2ed573', marginBottom: '15px' }}>📋 Exam Topics Covered</h3>
          <ul style={{ color: '#a0a0b0', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li><strong>Part 1:</strong> Fundamentals & DC Analysis - Ohm's Law, KCL, KVL, Series/Parallel circuits</li>
            <li><strong>Part 2:</strong> Nodal & Mesh Analysis - Supernodes, Supermeshes, KCL/KVL equations</li>
            <li><strong>Part 3:</strong> Magnetism & Electromagnetism - Flux density, Faraday's Law, Lenz's Law</li>
            <li><strong>Part 4:</strong> AC Theory & Sinusoids - RMS values, Reactance, Impedance, Power Factor</li>
            <li><strong>Part 5:</strong> Advanced Theorems - Thevenin, Norton, Maximum Power Transfer, Superposition</li>
            <li><strong>Part 6:</strong> Transients & Storage Elements - RC/RL time constants, energy storage</li>
            <li><strong>Part 7:</strong> Mixed Theory & Application - Dependent sources, bilateral elements</li>
            <li><strong>Part 8:</strong> Final Review & Safety - 3-phase systems, electrical safety</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
