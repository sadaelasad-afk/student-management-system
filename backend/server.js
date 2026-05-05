const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ Authentication Routes ============

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await pool.getConnection();
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    
    connection.release();
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ Student Routes ============

// Get all students
app.get('/api/students', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.execute(
      `SELECT s.*, t.name as specialization 
       FROM students s 
       LEFT JOIN specializations t ON s.specialization_id = t.id`
    );
    connection.release();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
app.get('/api/students/:id', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.execute(
      `SELECT s.*, t.name as specialization 
       FROM students s 
       LEFT JOIN specializations t ON s.specialization_id = t.id 
       WHERE s.id = ?`,
      [req.params.id]
    );
    connection.release();
    
    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(students[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search student by national ID or code
app.get('/api/students/search/:query', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.execute(
      `SELECT s.*, t.name as specialization 
       FROM students s 
       LEFT JOIN specializations t ON s.specialization_id = t.id 
       WHERE s.national_id LIKE ? OR s.student_code LIKE ? OR s.email LIKE ?`,
      [`%${req.params.query}%`, `%${req.params.query}%`, `%${req.params.query}%`]
    );
    connection.release();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new student
app.post('/api/students', authenticate, async (req, res) => {
  try {
    const { name, national_id, email, phone, specialization_id } = req.body;
    const connection = await pool.getConnection();
    
    const password = await bcrypt.hash('student123', 10);
    const student_code = 'STU' + Date.now();
    
    await connection.execute(
      `INSERT INTO students (name, national_id, student_code, email, phone, password, specialization_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, national_id, student_code, email, phone, password, specialization_id]
    );
    
    connection.release();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
app.put('/api/students/:id', authenticate, async (req, res) => {
  try {
    const { name, email, phone, specialization_id } = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      `UPDATE students SET name = ?, email = ?, phone = ?, specialization_id = ?, updated_at = NOW() 
       WHERE id = ?`,
      [name, email, phone, specialization_id, req.params.id]
    );
    
    connection.release();
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student password
app.put('/api/students/:id/password', authenticate, async (req, res) => {
  try {
    const { new_password } = req.body;
    const connection = await pool.getConnection();
    
    const hashedPassword = await bcrypt.hash(new_password, 10);
    
    await connection.execute(
      `UPDATE students SET password = ?, updated_at = NOW() WHERE id = ?`,
      [hashedPassword, req.params.id]
    );
    
    connection.release();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
app.delete('/api/students/:id', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ Attendance Routes ============

// Record attendance
app.post('/api/attendance', authenticate, async (req, res) => {
  try {
    const { student_id, status, date } = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      `INSERT INTO attendance (student_id, status, date, recorded_at) 
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE status = ?, recorded_at = NOW()`,
      [student_id, status, date, status]
    );
    
    connection.release();
    res.status(201).json({ message: 'Attendance recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance report
app.get('/api/attendance/report/:student_id', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [attendance] = await connection.execute(
      `SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC`,
      [req.params.student_id]
    );
    connection.release();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ Specialization Routes ============

// Get all specializations
app.get('/api/specializations', authenticate, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [specs] = await connection.execute('SELECT * FROM specializations');
    connection.release();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add specialization
app.post('/api/specializations', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      `INSERT INTO specializations (name, description, created_at) VALUES (?, ?, NOW())`,
      [name, description]
    );
    
    connection.release();
    res.status(201).json({ message: 'Specialization added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ Server Start ============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
