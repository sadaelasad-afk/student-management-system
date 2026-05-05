-- Create Database
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specializations Table
CREATE TABLE IF NOT EXISTS specializations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  national_id VARCHAR(50) UNIQUE NOT NULL,
  student_code VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255),
  specialization_id INT,
  gender ENUM('male', 'female'),
  date_of_birth DATE,
  address TEXT,
  guardian_name VARCHAR(255),
  guardian_phone VARCHAR(20),
  status ENUM('active', 'inactive', 'transferred') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (specialization_id) REFERENCES specializations(id)
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (student_id, date)
);

-- Create Admin User
INSERT INTO users (email, password, role) VALUES 
('admin@school.com', '$2a$10$YIjlrMRvlKqpiMnkRmB3OOj8DXjlG8p8N3vK9C1N7M8L9O0P1Q2R3', 'admin');

-- Create Sample Specializations
INSERT INTO specializations (name, description) VALUES 
('العلوم', 'قسم العلوم - Science Department'),
('الرياضيات', 'قسم الرياضيات - Mathematics Department'),
('اللغة الإنجليزية', 'قسم اللغة الإنجليزية - English Department'),
('اللغة العربية', 'قسم اللغة العربية - Arabic Department'),
('الدراسات الاجتماعية', 'قسم الدراسات الاجتماعية - Social Studies Department');

-- Create Sample Students
INSERT INTO students (name, national_id, student_code, email, phone, password, specialization_id, gender, date_of_birth) VALUES 
('محمد أحمد', '30012345678901', 'STU001', 'student1@school.com', '01001234567', '$2a$10$YIjlrMRvlKqpiMnkRmB3OOj8DXjlG8p8N3vK9C1N7M8L9O0P1Q2R3', 1, 'male', '2008-05-15'),
('فاطمة محمود', '30012345678902', 'STU002', 'student2@school.com', '01101234567', '$2a$10$YIjlrMRvlKqpiMnkRmB3OOj8DXjlG8p8N3vK9C1N7M8L9O0P1Q2R3', 2, 'female', '2008-03-20'),
('علي محمد', '30012345678903', 'STU003', 'student3@school.com', '01201234567', '$2a$10$YIjlrMRvlKqpiMnkRmB3OOj8DXjlG8p8N3vK9C1N7M8L9O0P1Q2R3', 1, 'male', '2008-07-10'),
('أسماء عبدالله', '30012345678904', 'STU004', 'student4@school.com', '01301234567', '$2a$10$YIjlrMRvlKqpiMnkRmB3OOj8DXjlG8p8N3vK9C1N7M8L9O0P1Q2R3', 3, 'female', '2008-02-14'),
('يوسف السيد', '30012345678905', 'STU005', 'student5@school.com', '01401234567', '$2a$10$YIjlrMRvlKqpiMnkRmB3OOj8DXjlG8p8N3vK9C1N7M8L9O0P1Q2R3', 4, 'male', '2008-08-25');
