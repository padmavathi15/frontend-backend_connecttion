const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// PostgreSQL Connection Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'frontend-backend', 
  password: 'padma_postgres',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Routes ---
app.get("/", (req,res)=>{
    res.send("Hello")
})
// Get Marks Data
app.get('/marks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marks');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching marks:', error.message);
    res.status(500).send('Server Error');
  }
});

// Add Marks
app.post('/marks', async (req, res) => {
  const { studentName, subjectName, marks } = req.body;
  try {
    await pool.query(
      'INSERT INTO marks (student_name, subject_name, marks) VALUES ($1, $2, $3)',
      [studentName, subjectName, marks]
    );
    res.status(201).send('Marks Added');
  } catch (error) {
    console.error('Error adding marks:', error.message);
    res.status(500).send('Server Error');
  }
});

// Delete Marks
app.delete('/marks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM marks WHERE student_id = $1', [id]);
    res.send('Mark Deleted');
  } catch (error) {
    console.error('Error deleting mark:', error.message);
    res.status(500).send('Server Error');
  }
});

// Get Attendance Data
app.get('/attendance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance:', error.message);
    res.status(500).send('Server Error');
  }
});

// Add Attendance
app.post('/attendance', async (req, res) => {
  const { studentName, attendance, percentage } = req.body;
  try {
    await pool.query(
      'INSERT INTO attendance (student_name, attendance, percentage) VALUES ($1, $2, $3)',
      [studentName, attendance, percentage]
    );
    res.status(201).send('Attendance Added');
  } catch (error) {
    console.error('Error adding attendance:', error.message);
    res.status(500).send('Server Error');
  }
});

// Delete Attendance
app.delete('/attendance/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM attendance WHERE student_id = $1', [id]);
    res.send('Attendance Deleted');
  } catch (error) {
    console.error('Error deleting attendance:', error.message);
    res.status(500).send('Server Error');
  }
});
// Update Marks
app.put('/marks/:id', async (req, res) => {
    const { id } = req.params; // student_id from URL
    const { studentName, subjectName, marks } = req.body;
  
    try {
      // Update query for marks
      const result = await pool.query(
        'UPDATE marks SET student_name = $1, subject_name = $2, marks = $3 WHERE student_id = $4',
        [studentName, subjectName, marks, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).send('Mark not found');
      }
  
      res.send('Mark Updated');
    } catch (error) {
      console.error('Error updating mark:', error.message);
      res.status(500).send('Server Error');
    }
  });
  
  // Update Attendance
  app.put('/attendance/:id', async (req, res) => {
    const { id } = req.params; // student_id from URL
    const { studentName, attendance, percentage } = req.body;
  
    try {
      // Update query for attendance
      const result = await pool.query(
        'UPDATE attendance SET student_name = $1, attendance = $2, percentage = $3 WHERE student_id = $4',
        [studentName, attendance, percentage, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).send('Attendance record not found');
      }
  
      res.send('Attendance Updated');
    } catch (error) {
      console.error('Error updating attendance:', error.message);
      res.status(500).send('Server Error');
    }
  });
  
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
