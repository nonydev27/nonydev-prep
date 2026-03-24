import { useState, useEffect } from 'react';

export default function Admin({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('results');
  const [quizResults, setQuizResults] = useState([]);

  // Registered students database
  const students = [
    { referenceNumber: '22479389', name: "Adu Boahen Jerry Nana Yaw'" },
    { referenceNumber: '22391240', name: 'Dekyi Cheryl Saah' },
    { referenceNumber: '21855561', name: 'Agyeman Nana Yaw' },
    { referenceNumber: '21839316', name: 'Benniton Otumfuo-Nyarko' },
    { referenceNumber: '21875777', name: 'Memunatu Lukman' },
    { referenceNumber: '22041319', name: 'Osei Prempeh Erica' },
    { referenceNumber: '22326459', name: 'Genevieve Nana Akua Selase' },
  ];

  // Available quizzes
  const [quizzes] = useState([
    { 
      id: 1, 
      title: 'CSM 153 - Circuit Theory', 
      questions: 80, 
      duration: 1,
      password: '12345',
      status: 'active',
      examTime: '3:00 PM - 5:00 PM'
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  
  // Merge stored results with students who haven't taken the exam
  const mergedResults = students.map(student => {
    const storedResult = quizResults.find(r => r.studentRef === student.referenceNumber);
    if (storedResult) {
      return storedResult;
    }
    return {
      quizId: 1,
      studentRef: student.referenceNumber,
      score: 0,
      totalQuestions: 80,
      warnings: 0,
      submittedAt: null,
      status: 'Not Started',
      answers: []
    };
  });
  
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: '',
    duration: '',
    password: '',
    examTime: ''
  });

  // Get student name by reference number
  const getStudentName = (refNum) => {
    const student = students.find(s => s.referenceNumber === refNum);
    return student ? student.name : 'Unknown Student';
  };

  // Get student result by reference number
  const getStudentResult = (refNum) => {
    return mergedResults.find(r => r.studentRef === refNum);
  };

  // Load quiz results from localStorage
  useEffect(() => {
    const loadResults = () => {
      const storedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      setQuizResults(storedResults);
    };
    loadResults();
    
    // Poll for new results every 5 seconds when on results tab
    const interval = setInterval(() => {
      if (activeTab === 'results') {
        loadResults();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  // Calculate statistics from quizResults
  const totalStudents = students.length;
  const completedExams = mergedResults.filter(r => r.status === 'Completed').length;
  const terminatedExams = mergedResults.filter(r => r.status === 'Terminated').length;
  const notStarted = mergedResults.filter(r => r.status === 'Not Started').length;
  const averageScore = completedExams > 0 
    ? (mergedResults.filter(r => r.status === 'Completed').reduce((acc, r) => acc + r.score, 0) / completedExams).toFixed(1)
    : 0;

  const handleViewStudent = (result) => {
    setSelectedStudent(result);
    setShowStudentModal(true);
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      // Quiz deletion logic
    }
  };

  const handleToggleQuiz = (id) => {
    // Toggle quiz status logic
  };

  return (
    <div className="cyber-bg" style={{ 
      position: 'relative', 
      minHeight: '100vh',
      zIndex: -1
    }}>
      <div className="admin-container" style={{ 
        position: 'relative', 
        zIndex: 1,
        padding: '20px'
      }}>
        <div className="admin-header">
          <h1>NONYPREP - Admin Dashboard</h1>
          <p style={{ color: '#a0a0b0', marginTop: '10px' }}>
            Welcome, {user?.name || 'Administrator'}
          </p>
        </div>

        <div className="admin-nav" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className={`admin-nav-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Exam Results
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students List
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            Manage Quizzes
          </button>
          <button 
            className="admin-nav-btn"
            onClick={onLogout}
            style={{ borderColor: '#ff4757', color: '#ff4757' }}
          >
            Logout
          </button>
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          maxWidth: '1000px',
          margin: '30px auto'
        }}>
          <div style={{
            background: 'rgba(84, 120, 255, 0.1)',
            border: '1px solid #5478FF',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#53CBF3', fontSize: '32px', margin: 0 }}>{totalStudents}</h3>
            <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Total Students</p>
          </div>
          <div style={{
            background: 'rgba(46, 213, 115, 0.1)',
            border: '1px solid #2ed573',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#2ed573', fontSize: '32px', margin: 0 }}>{completedExams}</h3>
            <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Completed</p>
          </div>
          <div style={{
            background: 'rgba(255, 222, 66, 0.1)',
            border: '1px solid #FFDE42',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#FFDE42', fontSize: '32px', margin: 0 }}>{notStarted}</h3>
            <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Not Started</p>
          </div>
          <div style={{
            background: 'rgba(255, 71, 87, 0.1)',
            border: '1px solid #ff4757',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff4757', fontSize: '32px', margin: 0 }}>{terminatedExams}</h3>
            <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Terminated</p>
          </div>
        </div>

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div>
            <h2 style={{ color: '#53CBF3', marginBottom: '20px', textAlign: 'center' }}>
              CSM 153 - Circuit Theory Exam Results
            </h2>
            <div style={{ 
              overflowX: 'auto',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'rgba(18, 18, 42, 0.8)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#5478FF' }}>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#fff' }}>Student Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#fff' }}>Reference</th>
                    <th style={{ padding: '15px', textAlign: 'center', color: '#fff' }}>Score</th>
                    <th style={{ padding: '15px', textAlign: 'center', color: '#fff' }}>Warnings</th>
                    <th style={{ padding: '15px', textAlign: 'center', color: '#fff' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'center', color: '#fff' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedResults.map((result, index) => (
                    <tr key={index} style={{ 
                      borderBottom: '1px solid rgba(84, 120, 255, 0.2)',
                      background: index % 2 === 0 ? 'transparent' : 'rgba(84, 120, 255, 0.05)'
                    }}>
                      <td style={{ padding: '15px', color: '#fff' }}>{getStudentName(result.studentRef)}</td>
                      <td style={{ padding: '15px', color: '#a0a0b0' }}>{result.studentRef}</td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#53CBF3', fontWeight: 'bold' }}>
                        {result.score}/{result.totalQuestions} ({result.totalQuestions > 0 ? ((result.score / result.totalQuestions) * 100).toFixed(1) : 0}%)
                      </td>
                      <td style={{ 
                        padding: '15px', 
                        textAlign: 'center', 
                        color: result.warnings > 0 ? '#ff4757' : '#2ed573',
                        fontWeight: 'bold'
                      }}>
                        {result.warnings}/3
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <span style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          background: result.status === 'Completed' ? 'rgba(46, 213, 115, 0.2)' : 
                                     result.status === 'Terminated' ? 'rgba(255, 71, 87, 0.2)' :
                                     'rgba(255, 222, 66, 0.2)',
                          color: result.status === 'Completed' ? '#2ed573' : 
                                result.status === 'Terminated' ? '#ff4757' : '#FFDE42',
                          fontSize: '12px'
                        }}>
                          {result.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {result.status !== 'Not Started' && (
                          <button 
                            className="quiz-action-btn"
                            onClick={() => handleViewStudent(result)}
                            style={{ padding: '5px 15px', fontSize: '12px' }}
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <h2 style={{ color: '#53CBF3', marginBottom: '20px', textAlign: 'center' }}>
              Registered Students
            </h2>
            <div className="quiz-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {students.map((student, index) => {
                const studentResult = getStudentResult(student.referenceNumber);
                return (
                  <div key={index} className="quiz-item" style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <div className="quiz-item-info">
                      <h3 style={{ color: '#53CBF3' }}>{student.name}</h3>
                      <p style={{ color: '#a0a0b0' }}>Reference: {student.referenceNumber}</p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {studentResult && studentResult.status !== 'Not Started' ? (
                        <>
                          <div>
                            <p style={{ 
                              color: studentResult.status === 'Completed' ? '#2ed573' : '#ff4757',
                              fontWeight: 'bold',
                              margin: 0
                            }}>
                              Score: {studentResult.score}/80
                            </p>
                            <p style={{ 
                              color: '#a0a0b0',
                              fontSize: '12px',
                              margin: '5px 0 0 0'
                            }}>
                              {studentResult.status}
                            </p>
                          </div>
                          <button 
                            className="quiz-action-btn"
                            onClick={() => handleViewStudent(studentResult)}
                            style={{ padding: '5px 15px', fontSize: '12px' }}
                          >
                            View
                          </button>
                        </>
                      ) : (
                        <span style={{ color: '#FFDE42' }}>Not Started</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div>
            <h2 style={{ color: '#53CBF3', marginBottom: '20px', textAlign: 'center' }}>
              Manage Quizzes
            </h2>
            <div className="quiz-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {quizzes.map((quiz, index) => (
                <div key={index} className="quiz-item" style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div className="quiz-item-info">
                    <h3 style={{ color: '#53CBF3' }}>{quiz.title}</h3>
                    <p>{quiz.questions} Questions | {quiz.duration} Minutes</p>
                    <p>Password: {quiz.password} | Exam Time: {quiz.examTime}</p>
                    <p style={{ 
                      color: quiz.status === 'active' ? '#2ed573' : '#ff4757',
                      marginTop: '5px'
                    }}>
                      Status: {quiz.status.toUpperCase()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="quiz-action-btn"
                      onClick={() => handleToggleQuiz(quiz.id)}
                    >
                      {quiz.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {showStudentModal && selectedStudent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--cyber-bg-light)',
              border: '2px solid #5478FF',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ color: '#53CBF3', marginBottom: '10px', textAlign: 'center' }}>
                Student Result Details
              </h2>
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>{getStudentName(selectedStudent.studentRef)}</h3>
                <p style={{ color: '#a0a0b0', margin: '5px 0' }}>Reference: {selectedStudent.studentRef}</p>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: 'rgba(84, 120, 255, 0.1)',
                  border: '1px solid #5478FF',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#53CBF3', margin: 0, fontSize: '24px' }}>
                    {selectedStudent.score}/{selectedStudent.totalQuestions}
                  </h3>
                  <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Score</p>
                </div>
                <div style={{
                  background: 'rgba(46, 213, 115, 0.1)',
                  border: '1px solid #2ed573',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#2ed573', margin: 0, fontSize: '24px' }}>
                    {selectedStudent.totalQuestions > 0 ? ((selectedStudent.score / selectedStudent.totalQuestions) * 100).toFixed(1) : 0}%
                  </h3>
                  <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Percentage</p>
                </div>
                <div style={{
                  background: 'rgba(255, 222, 66, 0.1)',
                  border: '1px solid #FFDE42',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#FFDE42', margin: 0, fontSize: '24px' }}>
                    {selectedStudent.warnings}/3
                  </h3>
                  <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Warnings</p>
                </div>
                <div style={{
                  background: selectedStudent.status === 'Completed' 
                    ? 'rgba(46, 213, 115, 0.1)' 
                    : selectedStudent.status === 'Terminated'
                    ? 'rgba(255, 71, 87, 0.1)'
                    : 'rgba(255, 222, 66, 0.1)',
                  border: `1px solid ${selectedStudent.status === 'Completed' ? '#2ed573' : selectedStudent.status === 'Terminated' ? '#ff4757' : '#FFDE42'}`,
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    color: selectedStudent.status === 'Completed' ? '#2ed573' : selectedStudent.status === 'Terminated' ? '#ff4757' : '#FFDE42',
                    margin: 0, 
                    required
                    min="1"
                  />
                </div>
                <div className="cyber-form-group">
                  <label>Quiz Password</label>
                  <input
                    type="text"
                    className="cyber-input"
                    placeholder="e.g., 12345"
                    value={newQuiz.password}
                    onChange={(e) => setNewQuiz({ ...newQuiz, password: e.target.value })}
                    required
                  />
                </div>
                <div className="cyber-form-group">
                  <label>Exam Time</label>
                  <input
                    type="text"
                    className="cyber-input"
                    placeholder="e.g., 3:00 PM - 5:00 PM"
                    value={newQuiz.examTime}
                    onChange={(e) => setNewQuiz({ ...newQuiz, examTime: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="cyber-btn" style={{ flex: 1 }}>
                    Create Quiz
                  </button>
                  <button 
                    type="button"
                    className="cyber-btn cyber-btn-secondary"
                    onClick={() => setShowCreateQuiz(false)}
                    style={{ flex: 1, borderColor: '#ff4757', color: '#ff4757' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {showStudentModal && selectedStudent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--cyber-bg-light)',
              border: '2px solid #5478FF',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ color: '#53CBF3', marginBottom: '10px', textAlign: 'center' }}>
                Student Result Details
              </h2>
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>{getStudentName(selectedStudent.studentRef)}</h3>
                <p style={{ color: '#a0a0b0', margin: '5px 0' }}>Reference: {selectedStudent.studentRef}</p>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: 'rgba(84, 120, 255, 0.1)',
                  border: '1px solid #5478FF',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#53CBF3', margin: 0, fontSize: '24px' }}>
                    {selectedStudent.score}/{selectedStudent.totalQuestions}
                  </h3>
                  <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Score</p>
                </div>
                <div style={{
                  background: 'rgba(46, 213, 115, 0.1)',
                  border: '1px solid #2ed573',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#2ed573', margin: 0, fontSize: '24px' }}>
                    {((selectedStudent.score / selectedStudent.totalQuestions) * 100).toFixed(1)}%
                  </h3>
                  <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Percentage</p>
                </div>
                <div style={{
                  background: 'rgba(255, 222, 66, 0.1)',
                  border: '1px solid #FFDE42',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: '#FFDE42', margin: 0, fontSize: '24px' }}>
                    {selectedStudent.warnings}/3
                  </h3>
                  <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Warnings</p>
                </div>
                <div style={{
                  background: selectedStudent.status === 'Completed' 
                    ? 'rgba(46, 213, 115, 0.1)' 
                    : 'rgba(255, 71, 87, 0.1)',
                  border: `1px solid ${selectedStudent.status === 'Completed' ? '#2ed573' : '#ff4757'}`,
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ 
                    color: selectedStudent.status === 'Completed' ? '#2ed573' : '#ff4757',
                    margin: 0, 
                    fontSize: '24px' 
                  }}>
                    {selectedStudent.status}
                  </h3>
                  <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Status</p>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ color: '#a0a0b0' }}>
                  Submitted: {selectedStudent.submittedAt}
                </p>
              </div>

              <div style={{ 
                background: 'rgba(84, 120, 255, 0.1)',
                border: '1px solid #5478FF',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#53CBF3', marginBottom: '10px' }}>Answer Summary</h4>
                <div style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px',
                  justifyContent: 'center'
                }}>
                  {selectedStudent.answers.map((answer, idx) => (
                    <span
                      key={idx}
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        background: answer !== null 
                          ? 'rgba(84, 120, 255, 0.3)' 
                          : 'rgba(255, 71, 87, 0.2)',
                        color: answer !== null ? '#53CBF3' : '#ff4757'
                      }}
                      title={`Q${idx + 1}: ${answer !== null ? 'Answered' : 'Not Answered'}`}
                    >
                      {idx + 1}
                    </span>
                  ))}
                </div>
                <p style={{ color: '#a0a0b0', marginTop: '10px', textAlign: 'center', fontSize: '12px' }}>
                  Blue = Answered | Red = Not Answered
                </p>
              </div>

              <button 
                className="cyber-btn"
                onClick={() => setShowStudentModal(false)}
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
