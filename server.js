import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = './quiz-results.json';

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read results
const getResults = () => {
  try {
    const data = readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to save results
const saveResults = (results) => {
  writeFileSync(DATA_FILE, JSON.stringify(results, null, 2));
};

// Get all quiz results
app.get('/api/results', (req, res) => {
  const results = getResults();
  res.json(results);
});

// Submit quiz result
app.post('/api/results', (req, res) => {
  const { quizId, studentRef, studentName, score, totalQuestions, warnings, status, submittedAt, answers } = req.body;
  
  if (!studentRef || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const results = getResults();
  
  // Remove existing result for this student
  const filteredResults = results.filter(r => r.studentRef !== studentRef);
  
  // Add new result
  const newResult = {
    quizId: quizId || 1,
    studentRef,
    studentName: studentName || 'Unknown Student',
    score,
    totalQuestions,
    warnings,
    status,
    submittedAt: submittedAt || new Date().toISOString(),
    answers
  };
  
  filteredResults.push(newResult);
  saveResults(filteredResults);
  
  res.json({ success: true, result: newResult });
});

// Clear all results (for testing)
app.delete('/api/results', (req, res) => {
  saveResults([]);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Quiz Results Server running on http://localhost:${PORT}`);
});
