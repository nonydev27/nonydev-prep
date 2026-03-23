import { useState } from 'react';

export default function Admin({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('results');

  // Registered students database
  const students = [
    { referenceNumber: '22479389', name: 'Adu Boahen Jerry Nana Yao' },
    { referenceNumber: '22391240', name: 'Dekyi Cheryl Saah' },
    { referenceNumber: '21855561', name: 'Agyeman Nana Yaw' },
    { referenceNumber: '21839316', name: 'Benniton Otumfuo-Nyarko' },
    { referenceNumber: '21875777', name: 'Memunatu Lukman' },
    { referenceNumber: '22041319', name: 'Osei Prempeh Erica' },
  ];

  // Mock quiz results - in real app this would come from a database
  const quizResults = [
    { 
      quizId: 1, 
      quizTitle: 'CSM 153 - Circuit Theory',
      studentRef: '22479389',
      score: 72,
      totalQuestions: 80,
      warnings: 0,
      submittedAt: '2024-03-23 14:30:00',
      status: 'Completed'
    },
    { 
      quizId: 1, 
      quizTitle: 'CSM 153 - Circuit Theory',
      studentRef: '22391240',
      score: 65,
      totalQuestions: 80,
      warnings: 1,
      submittedAt: '2024-03-23 14:45:00',
      status: 'Completed'
    },
    { 
      quizId: 1, 
      quizTitle: 'CSM 153 - Circuit Theory',
      studentRef: '21855561',
      score: 78,
      totalQuestions: 80,
      warnings: 0,
      submittedAt: '2024-03-23 15:00:00',
      status: 'Completed'
    },
    { 
      quizId: 1, 
      quizTitle: 'CSM 153 - Circuit Theory',
      studentRef: '21839316',
      score: 0,
      totalQuestions: 80,
      warnings: 3,
      submittedAt: '2024-03-23 14:20:00',
      status: 'Terminated'
    },
    { 
      quizId: 1, 
      quizTitle: 'CSM 153 - Circuit Theory',
      studentRef: '21875777',
      score: 58,
      totalQuestions: 80,
      warnings: 0,
      submittedAt: '2024-03-23 15:15:00',
      status: 'Completed'
    },
    { 
      quizId: 1, 
      quizTitle: 'CSM 153 - Circuit Theory',
      studentRef: '22041319',
      score: 45,
      totalQuestions: 80,
      warnings: 2,
      submittedAt: '2024-03-23 14:50:00',
      status: 'Completed'
    },
  ];

  // Get student name by reference number
  const getStudentName = (refNum) => {
    const student = students.find(s => s.referenceNumber === refNum);
    return student ? student.name : 'Unknown Student';
  };

  // Calculate statistics
  const totalStudents = students.length;
  const completedExams = quizResults.filter(r => r.status === 'Completed').length;
  const terminatedExams = quizResults.filter(r => r.status === 'Terminated').length;
  const averageScore = quizResults.length > 0 
    ? (quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length).toFixed(1)
    : 0;

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

        <div className="admin-nav">
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
            <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Completed Exams</p>
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
          <div style={{
            background: 'rgba(255, 222, 66, 0.1)',
            border: '1px solid #FFDE42',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#FFDE42', fontSize: '32px', margin: 0 }}>{averageScore}%</h3>
            <p style={{ color: '#a0a0b0', margin: '5px 0 0 0' }}>Average Score</p>
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
                    <th style={{ padding: '15px', textAlign: 'left', color: '#fff' }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((result, index) => (
                    <tr key={index} style={{ 
                      borderBottom: '1px solid rgba(84, 120, 255, 0.2)',
                      background: index % 2 === 0 ? 'transparent' : 'rgba(84, 120, 255, 0.05)'
                    }}>
                      <td style={{ padding: '15px', color: '#fff' }}>{getStudentName(result.studentRef)}</td>
                      <td style={{ padding: '15px', color: '#a0a0b0' }}>{result.studentRef}</td>
                      <td style={{ padding: '15px', textAlign: 'center', color: '#53CBF3', fontWeight: 'bold' }}>
                        {result.score}/{result.totalQuestions} ({((result.score / result.totalQuestions) * 100).toFixed(1)}%)
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
                          background: result.status === 'Completed' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                          color: result.status === 'Completed' ? '#2ed573' : '#ff4757',
                          fontSize: '12px'
                        }}>
                          {result.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px', color: '#a0a0b0' }}>{result.submittedAt}</td>
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
                const studentResult = quizResults.find(r => r.studentRef === student.referenceNumber);
                return (
                  <div key={index} className="quiz-item" style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div className="quiz-item-info">
                      <h3 style={{ color: '#53CBF3' }}>{student.name}</h3>
                      <p style={{ color: '#a0a0b0' }}>Reference: {student.referenceNumber}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {studentResult ? (
                        <>
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
                        </>
                      ) : (
                        <p style={{ color: '#FFDE42', margin: 0 }}>Not Started</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
