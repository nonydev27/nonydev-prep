import { useState, useEffect } from 'react';

export default function Quiz({ onLogout, user }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 minutes (2 hours) in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCheatAlert, setShowCheatAlert] = useState(false);
  const [cheatAlertMessage, setCheatAlertMessage] = useState('');
  const [cheatCount, setCheatCount] = useState(0);
  const [showFinalAlert, setShowFinalAlert] = useState(false);

  // Circuit Theory Quiz Data - All 80 Questions
  const quizData = {
    title: 'CSM 153 / EE287 - Circuit Theory',
    duration: 120,
    questions: [
      // Part 1: Fundamentals & DC Analysis (Questions 1-10)
      { id: 1, text: 'Which of the following is a passive element?', options: ['A) Voltage Source', 'B) Current Source', 'C) Resistor', 'D) Battery'], correct: 2 },
      { id: 2, text: 'According to Ohm\'s Law, if resistance is halved and voltage remains constant, current will:', options: ['A) Stay the same', 'B) Double', 'C) Be halved', 'D) Quadruple'], correct: 1 },
      { id: 3, text: 'KCL (Kirchhoff\'s Current Law) is based on the law of conservation of:', options: ['A) Energy', 'B) Power', 'C) Mass', 'D) Charge'], correct: 3 },
      { id: 4, text: 'KVL (Kirchhoff\'s Voltage Law) states that the algebraic sum of voltages around a closed loop is:', options: ['A) Proportional to resistance', 'B) Zero', 'C) Infinite', 'D) Equal to the highest voltage source'], correct: 1 },
      { id: 5, text: 'An ideal ammeter should have:', options: ['A) Zero resistance', 'B) Infinite resistance', 'C) 1 Ohm resistance', 'D) High conductance'], correct: 0 },
      { id: 6, text: 'An ideal voltmeter should have:', options: ['A) Zero resistance', 'B) Infinite resistance', 'C) Low capacitance', 'D) High power rating'], correct: 1 },
      { id: 7, text: 'In a series circuit, which parameter remains constant across all components?', options: ['A) Voltage', 'B) Power', 'C) Current', 'D) Resistance'], correct: 2 },
      { id: 8, text: 'In a parallel circuit, which parameter remains constant across all branches?', options: ['A) Current', 'B) Voltage', 'C) Resistance', 'D) Energy'], correct: 1 },
      { id: 9, text: 'The unit of conductance is:', options: ['A) Ohm', 'B) Siemens (or Mho)', 'C) Henry', 'D) Farad'], correct: 1 },
      { id: 10, text: 'Power in a DC circuit is calculated as:', options: ['A) P = V / I', 'B) P = I squared x R', 'C) P = V squared x R', 'D) P = R / V'], correct: 1 },

      // Part 2: Nodal & Mesh Analysis (Questions 11-20)
      { id: 11, text: 'Nodal analysis is based primarily on:', options: ['A) KVL', 'B) KCL', 'C) Faraday\'s Law', 'D) Thevenin\'s Theorem'], correct: 1 },
      { id: 12, text: 'Mesh analysis is based primarily on:', options: ['A) KCL', 'B) KVL', 'C) Norton\'s Theorem', 'D) Superposition'], correct: 1 },
      { id: 13, text: 'A "Supernode" is formed when a ________ is connected between two non-reference nodes.', options: ['A) Resistor', 'B) Current source', 'C) Voltage source', 'D) Capacitor'], correct: 2 },
      { id: 14, text: 'A "Supermesh" is formed when a ________ is shared between two meshes.', options: ['A) Voltage source', 'B) Resistor', 'C) Current source', 'D) Ground wire'], correct: 2 },
      { id: 15, text: 'How many equations are required for Nodal analysis if there are \'n\' nodes?', options: ['A) n', 'B) n + 1', 'C) n - 1', 'D) 2n'], correct: 2 },
      { id: 16, text: 'In Mesh analysis, a mesh is defined as:', options: ['A) Any closed loop', 'B) A loop that does not contain any other loops inside it', 'C) A junction where three wires meet', 'D) A branch with a voltage source'], correct: 1 },
      { id: 17, text: 'If a circuit has 4 nodes (including reference), how many KCL equations are needed?', options: ['A) 4', 'B) 5', 'C) 3', 'D) 2'], correct: 2 },
      { id: 18, text: 'When applying Mesh analysis, the direction of mesh current is usually assumed to be:', options: ['A) Clockwise', 'B) Counter-clockwise', 'C) Out of the page', 'D) It doesn\'t matter, as long as it is consistent'], correct: 0 },
      { id: 19, text: 'Nodal analysis is usually preferred over Mesh analysis when:', options: ['A) There are many loops but few nodes', 'B) There are many nodes but few loops', 'C) There are only voltage sources', 'D) There are only resistors'], correct: 0 },
      { id: 20, text: 'In Nodal analysis, the reference node is usually called the:', options: ['A) Peak node', 'B) Ground node', 'C) Active node', 'D) Floating node'], correct: 1 },

      // Part 3: Magnetism & Electromagnetism (Questions 21-30)
      { id: 21, text: 'The unit of magnetic flux density is:', options: ['A) Weber', 'B) Tesla', 'C) Henry', 'D) Ampere-turn'], correct: 1 },
      { id: 22, text: 'Which material has the highest permeability?', options: ['A) Air', 'B) Copper', 'C) Ferromagnetic materials', 'D) Plastic'], correct: 2 },
      { id: 23, text: 'The magnetic equivalent of resistance in an electrical circuit is:', options: ['A) Flux', 'B) Reluctance', 'C) Inductance', 'D) Permeance'], correct: 1 },
      { id: 24, text: 'Faraday\'s Law relates induced EMF to the rate of change of:', options: ['A) Current', 'B) Resistance', 'C) Magnetic Flux', 'D) Voltage'], correct: 2 },
      { id: 25, text: 'Lenz\'s Law is used to determine the ________ of induced EMF.', options: ['A) Magnitude', 'B) Frequency', 'C) Direction', 'D) Phase angle'], correct: 2 },
      { id: 26, text: 'The Magnetomotive Force (MMF) is measured in:', options: ['A) Volts', 'B) Ampere-turns', 'C) Teslas', 'D) Watts'], correct: 1 },
      { id: 27, text: 'Self-inductance is measured in:', options: ['A) Farads', 'B) Ohms', 'C) Henrys', 'D) Webers'], correct: 2 },
      { id: 28, text: 'What happens to the inductance of a coil if the number of turns is doubled?', options: ['A) It doubles', 'B) It stays the same', 'C) It quadruples', 'D) It is halved'], correct: 2 },
      { id: 29, text: 'Hysteresis is a phenomenon found in:', options: ['A) Resistors', 'B) Capacitors', 'C) Magnetic materials', 'D) Ideal wires'], correct: 2 },
      { id: 30, text: 'The force on a current-carrying conductor in a magnetic field is given by:', options: ['A) F = B x I x L x sin(theta)', 'B) F = V x I', 'C) F = m x a', 'D) F = B x A'], correct: 0 },

      // Part 4: AC Theory & Sinusoids (Questions 31-40)
      { id: 31, text: 'The frequency of a DC signal is:', options: ['A) 50 Hz', 'B) 60 Hz', 'C) 0 Hz', 'D) Infinite'], correct: 2 },
      { id: 32, text: 'For a standard sine wave, the RMS value is equal to:', options: ['A) 0.707 x Vpeak', 'B) 0.637 x Vpeak', 'C) 1.414 x Vpeak', 'D) Vpeak / 2'], correct: 0 },
      { id: 33, text: 'Reactance (XL) of an inductor ________ as frequency increases.', options: ['A) Decreases', 'B) Increases', 'C) Stays constant', 'D) Drops to zero'], correct: 1 },
      { id: 34, text: 'Reactance (XC) of a capacitor ________ as frequency increases.', options: ['A) Decreases', 'B) Increases', 'C) Stays constant', 'D) Becomes infinite'], correct: 0 },
      { id: 35, text: 'In a purely resistive AC circuit, the phase angle between voltage and current is:', options: ['A) 90 degrees', 'B) 180 degrees', 'C) 0 degrees', 'D) 45 degrees'], correct: 2 },
      { id: 36, text: 'In a purely inductive circuit, the current ________ the voltage by 90 degrees.', options: ['A) Leads', 'B) Lags', 'C) Is in phase with', 'D) Opposes'], correct: 1 },
      { id: 37, text: 'In a purely capacitive circuit, the current ________ the voltage by 90 degrees.', options: ['A) Leads', 'B) Lags', 'C) Is in phase with', 'D) Opposes'], correct: 0 },
      { id: 38, text: 'Impedance (Z) is the combination of:', options: ['A) Resistance and Conductance', 'B) Resistance and Reactance', 'C) Voltage and Current', 'D) Power and Energy'], correct: 1 },
      { id: 39, text: 'The unit of Apparent Power is:', options: ['A) Watts (W)', 'B) Volt-Amps (VA)', 'C) Volt-Amps Reactive (VAR)', 'D) Joules (J)'], correct: 1 },
      { id: 40, text: 'The Power Factor is defined as the ratio of:', options: ['A) Apparent Power to Real Power', 'B) Real Power to Apparent Power', 'C) Reactive Power to Real Power', 'D) Voltage to Current'], correct: 1 },

      // Part 5: Advanced Theorems & Analysis (Questions 41-50)
      { id: 41, text: 'Thevenin\'s Theorem replaces a complex circuit with:', options: ['A) A voltage source in parallel with a resistor', 'B) A current source in series with a resistor', 'C) A voltage source in series with a resistor', 'D) A current source in parallel with a resistor'], correct: 2 },
      { id: 42, text: 'To find the Norton current (IN), you must ________ the load terminals.', options: ['A) Open-circuit', 'B) Short-circuit', 'C) Ground', 'D) Connect to a battery'], correct: 1 },
      { id: 43, text: 'To find Thevenin resistance (Rth), independent voltage sources should be:', options: ['A) Open-circuited', 'B) Short-circuited', 'C) Left as they are', 'D) Replaced by capacitors'], correct: 1 },
      { id: 44, text: 'Maximum Power Transfer occurs when the load resistance is:', options: ['A) Zero', 'B) Infinite', 'C) Equal to the Thevenin resistance', 'D) Double the Thevenin resistance'], correct: 2 },
      { id: 45, text: 'Superposition theorem is applicable only to ________ circuits.', options: ['A) Non-linear', 'B) Linear', 'C) Passive', 'D) High voltage'], correct: 1 },
      { id: 46, text: 'When using Superposition, current sources are replaced by:', options: ['A) Short circuits', 'B) Open circuits', 'C) Resistors', 'D) Voltage sources'], correct: 1 },
      { id: 47, text: 'In an RLC series circuit at resonance, the impedance is:', options: ['A) Maximum', 'B) Minimum', 'C) Zero', 'D) Infinite'], correct: 1 },
      { id: 48, text: 'At resonance, the power factor of a circuit is:', options: ['A) 0', 'B) 0.5', 'C) 1 (Unity)', 'D) Lagging'], correct: 2 },
      { id: 49, text: 'The "Q" factor of a resonant circuit relates to its:', options: ['A) Quantity of charge', 'B) Selectivity/Sharpness', 'C) Quickness of response', 'D) Quality of insulation'], correct: 1 },
      { id: 50, text: 'Admittance (Y) is the reciprocal of:', options: ['A) Resistance', 'B) Reactance', 'C) Impedance', 'D) Susceptance'], correct: 2 },

      // Part 6: Transients & Storage Elements (Questions 51-60)
      { id: 51, text: 'A capacitor stores energy in its:', options: ['A) Magnetic field', 'B) Electric field', 'C) Resistor', 'D) Dielectric heat'], correct: 1 },
      { id: 52, text: 'An inductor stores energy in its:', options: ['A) Electric field', 'B) Magnetic field', 'C) Core material', 'D) Terminals'], correct: 1 },
      { id: 53, text: 'The time constant (tau) of an RC circuit is:', options: ['A) R / C', 'B) C / R', 'C) R x C', 'D) 1 / (RC)'], correct: 2 },
      { id: 54, text: 'The time constant (tau) of an RL circuit is:', options: ['A) R x L', 'B) L / R', 'C) R / L', 'D) 1 / (RL)'], correct: 1 },
      { id: 55, text: 'After how many time constants is a capacitor considered fully charged?', options: ['A) 1', 'B) 3', 'C) 5', 'D) 10'], correct: 2 },
      { id: 56, text: 'In the steady state (DC), a capacitor acts as an:', options: ['A) Short circuit', 'B) Open circuit', 'C) Voltage source', 'D) Resistor'], correct: 1 },
      { id: 57, text: 'In the steady state (DC), an inductor acts as a:', options: ['A) Short circuit', 'B) Open circuit', 'C) Current source', 'D) Capacitor'], correct: 0 },
      { id: 58, text: 'The energy stored in a capacitor is given by:', options: ['A) 1/2 x C x V squared', 'B) 1/2 x L x I squared', 'C) V x I x t', 'D) I squared x R'], correct: 0 },
      { id: 59, text: 'The energy stored in an inductor is given by:', options: ['A) 1/2 x C x V squared', 'B) 1/2 x L x I squared', 'C) V x I x t', 'D) L x I'], correct: 1 },
      { id: 60, text: 'The voltage across a capacitor cannot change:', options: ['A) Gradually', 'B) Periodically', 'C) Instantaneously', 'D) At all'], correct: 2 },

      // Part 7: Mixed Theory & Application (Questions 61-70)
      { id: 61, text: 'A "dependent" source is one whose value depends on:', options: ['A) The manufacturer', 'B) A voltage or current elsewhere in the circuit', 'C) The time of day', 'D) The temperature'], correct: 1 },
      { id: 62, text: 'A node with 3 or more branches connected to it is called a:', options: ['A) Simple node', 'B) Principal node', 'C) Supernode', 'D) Mesh node'], correct: 1 },
      { id: 63, text: 'The sum of powers absorbed in a circuit must equal:', options: ['A) The total resistance', 'B) The sum of powers supplied', 'C) Zero always', 'D) The highest voltage squared'], correct: 1 },
      { id: 64, text: 'A bilateral element is one that:', options: ['A) Only allows current in one direction', 'B) Has different properties in different directions', 'C) Performs the same regardless of current direction', 'D) Has two terminals only'], correct: 2 },
      { id: 65, text: 'Which of the following is a non-linear element?', options: ['A) Resistor', 'B) Diode', 'C) Inductor', 'D) Capacitor'], correct: 1 },
      { id: 66, text: 'The unit of frequency is:', options: ['A) Seconds', 'B) Hertz', 'C) Radians', 'D) Teslas'], correct: 1 },
      { id: 67, text: 'Angular frequency (omega) is equal to:', options: ['A) 2 x pi x f', 'B) f / (2 x pi)', 'C) 1 / f', 'D) 2 x f'], correct: 0 },
      { id: 68, text: 'Real power is measured in:', options: ['A) VA', 'B) VAR', 'C) Watts', 'D) Ohms'], correct: 2 },
      { id: 69, text: 'A lagging power factor implies the load is primarily:', options: ['A) Resistive', 'B) Inductive', 'C) Capacitive', 'D) Non-linear'], correct: 1 },
      { id: 70, text: 'A leading power factor implies the load is primarily:', options: ['A) Resistive', 'B) Inductive', 'C) Capacitive', 'D) Superconducting'], correct: 2 },

      // Part 8: Final Review & Safety (Questions 71-80)
      { id: 71, text: 'Double insulation is a safety feature used to prevent:', options: ['A) Short circuits', 'B) Electric shock', 'C) Overheating', 'D) High electricity bills'], correct: 1 },
      { id: 72, text: 'A fuse is always connected in ________ with the circuit it protects.', options: ['A) Parallel', 'B) Series', 'C) Delta', 'D) Star'], correct: 1 },
      { id: 73, text: 'In a 3-phase system, the phases are separated by:', options: ['A) 90 degrees', 'B) 180 degrees', 'C) 120 degrees', 'D) 360 degrees'], correct: 2 },
      { id: 74, text: 'The "neutral" wire in a domestic circuit is usually at what potential?', options: ['A) 240 V', 'B) 110 V', 'C) 0 V (Ground)', 'D) -240 V'], correct: 2 },
      { id: 75, text: 'What instrument measures electrical energy consumption?', options: ['A) Voltmeter', 'B) Wattmeter', 'C) Energy meter (kWh meter)', 'D) Galvanometer'], correct: 2 },
      { id: 76, text: 'Susceptance is the imaginary part of:', options: ['A) Impedance', 'B) Admittance', 'C) Reactance', 'D) Resistance'], correct: 1 },
      { id: 77, text: 'The reciprocal of Reluctance is:', options: ['A) Permeance', 'B) Inductance', 'C) Capacitance', 'D) Resistance'], correct: 0 },
      { id: 78, text: 'Eddy current losses can be reduced by using:', options: ['A) Thicker wires', 'B) Laminated cores', 'C) More insulation', 'D) DC instead of AC'], correct: 1 },
      { id: 79, text: 'The source of magnetism in a permanent magnet is:', options: ['A) Flow of protons', 'B) Alignment of electron spins', 'C) High voltage', 'D) Ambient temperature'], correct: 1 },
      { id: 80, text: 'In KNUST CSM 153/EE287, the primary tool for solving complex circuits is:', options: ['A) Guesswork', 'B) Systems of linear equations (Matrices)', 'C) Thermodynamics', 'D) Chemical analysis'], correct: 1 },
    ]
  };

  // Function to increment cheat count and auto-end if exceeds 3
  const incrementCheatCount = (message) => {
    const newCount = cheatCount + 1;
    setCheatCount(newCount);
    setCheatAlertMessage(`${message} (Warning ${newCount}/3)`);
    setShowCheatAlert(true);
    
    if (newCount >= 3) {
      setShowFinalAlert(true);
    }
  };

  // Anti-cheating: Disable specific keyboard shortcuts
  useEffect(() => {
    if (!quizStarted) return;
    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        incrementCheatCount('Printing is disabled during the exam!');
        return false;
      }
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        incrementCheatCount('Copying is disabled during the exam!');
        return false;
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        incrementCheatCount('Saving is disabled during the exam!');
        return false;
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        incrementCheatCount('View source is disabled during the exam!');
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        incrementCheatCount('Developer tools are disabled during the exam!');
        return false;
      }
    };

    const handleContextMenu = (e) => {
      if (quizStarted) {
        e.preventDefault();
        incrementCheatCount('Right-click is disabled during the exam!');
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [quizStarted, cheatCount]);

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
        incrementCheatCount('You are not allowed to leave the exam page!');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [quizStarted, cheatCount]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
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
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '12345') {
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
    let score = 0;
    quizData.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        score++;
      }
    });
    
    const answered = Object.keys(answers).length;
    const unanswered = quizData.questions.length - answered;
    
    alert(
      `Exam Summary:\n\n` +
      `Questions Answered: ${answered}/${quizData.questions.length}\n` +
      `Questions Unanswered: ${unanswered}\n` +
      `Cheating Warnings: ${cheatCount}/3\n` +
      `Estimated Score: ${score}/${quizData.questions.length}\n\n` +
      `Exam has been submitted.`
    );
    onLogout();
  };

  const currentQ = quizData.questions[currentQuestion];
  const displayName = user?.name || user?.referenceNumber || 'Student';

  return (
    <div className="cyber-bg" style={{ 
      position: 'relative', 
      minHeight: '100vh',
      zIndex: -1
    }}>
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="password-modal">
          <div className="password-modal-content">
            <h3>Enter Exam Password</h3>
            <p style={{ color: '#a0a0b0', marginBottom: '20px' }}>
              You have <strong>2 hours (120 minutes)</strong> to complete this exam.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="cyber-form-group">
                <input
                  type="password"
                  className="cyber-input"
                  placeholder="Enter exam password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              {passwordError && (
                <p style={{ color: '#ff4757', marginBottom: '15px' }}>{passwordError}</p>
              )}
              <button type="submit" className="cyber-btn">
                Start Exam
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cheat Detection Alert */}
      {showCheatAlert && (
        <div className="cyber-alert" onClick={() => setShowCheatAlert(false)}>
          <div className="cyber-alert-box" onClick={e => e.stopPropagation()}>
            <h3>Warning! ({cheatCount}/3)</h3>
            <p>{cheatAlertMessage}</p>
            <p style={{ color: '#ff4757', marginTop: '10px' }}>
              {3 - cheatCount} warning(s) remaining before exam is terminated.
            </p>
            <button 
              className="cyber-btn" 
              onClick={() => setShowCheatAlert(false)}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Final Alert - Quiz Terminated */}
      {showFinalAlert && (
        <div className="cyber-alert">
          <div className="cyber-alert-box" style={{ borderColor: '#ff4757' }}>
            <h3>EXAM TERMINATED!</h3>
            <p>You have exceeded the maximum number of warnings (3).</p>
            <p style={{ color: '#ff4757', marginTop: '15px' }}>
              Your exam has been automatically submitted due to academic dishonesty.
            </p>
            <button 
              className="cyber-btn" 
              onClick={() => {
                setShowFinalAlert(false);
                handleSubmitQuiz();
              }}
              style={{ background: '#ff4757', marginTop: '20px' }}
            >
              Exit Exam
            </button>
          </div>
        </div>
      )}

      {/* Exit Alert */}
      {showExitAlert && quizStarted && (
        <div className="cyber-alert">
          <div className="cyber-alert-box">
            <h3>Warning! ({cheatCount}/3)</h3>
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
          Time: {formatTime(timeLeft)} | Warnings: {cheatCount}/3
        </div>
      )}

      {/* User Info Header */}
      {quizStarted && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '20px',
          zIndex: 100,
          color: '#53CBF3',
          fontSize: '14px'
        }}>
          Student: {displayName}
        </div>
      )}

      {/* Quiz Content */}
      {quizStarted && (
        <div className="quiz-container" style={{ 
          position: 'relative', 
          zIndex: 1,
          padding: '80px 20px 40px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
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
                  <span>{option.substring(3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
            <button 
              className="cyber-btn cyber-btn-secondary"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              style={{ opacity: currentQuestion === 0 ? 0.5 : 1, width: 'auto', padding: '12px 24px' }}
            >
              Previous
            </button>

            <button 
              className="cyber-btn cyber-btn-secondary"
              onClick={handleNextQuestion}
              disabled={currentQuestion === quizData.questions.length - 1}
              style={{ opacity: currentQuestion === quizData.questions.length - 1 ? 0.5 : 1, width: 'auto', padding: '12px 24px' }}
            >
              Next
            </button>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {currentQuestion === quizData.questions.length - 1 ? (
              <button 
                className="cyber-btn"
                onClick={handleSubmitQuiz}
                style={{ background: 'linear-gradient(135deg, #2ed573, #1e8449)', width: '100%' }}
              >
                Submit Exam
              </button>
            ) : null}
          </div>

          {/* Question Navigation Dots */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px', 
            flexWrap: 'wrap',
            maxWidth: '800px',
            margin: '0 auto',
            paddingBottom: '40px'
          }}>
            {quizData.questions.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: idx === currentQuestion ? '#53CBF3' : 
                             answers[idx] !== undefined ? '#5478FF' : 'transparent',
                  border: `2px solid ${idx === currentQuestion ? '#53CBF3' : '#5478FF'}`,
                  color: idx === currentQuestion ? '#0a0a1a' : '#ffffff',
                  fontSize: '11px',
                  transition: 'all 0.2s ease',
                  fontWeight: idx === currentQuestion ? 'bold' : 'normal'
                }}
                title={`Question ${idx + 1}${answers[idx] !== undefined ? ' (Answered)' : ''}`}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Question Jump Select */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
