import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Navbar, Nav, Card } from 'react-bootstrap';
import axios from 'axios';
import '../styles/Attendance.css';

const API_BASE_URL = 'http://localhost:5000/api';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      const initialAttendance = {};
      response.data.forEach(student => {
        initialAttendance[student.id] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({...attendance, [studentId]: status});
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = async () => {
    try {
      for (const [studentId, status] of Object.entries(attendance)) {
        await axios.post(
          `${API_BASE_URL}/attendance`,
          { student_id: studentId, status, date: selectedDate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      alert('✅ تم حفظ سجل الحضور بنجاح');
    } catch (err) {
      console.error('Error saving attendance:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <div>
      <Navbar bg="success" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">⚡ نظام إدارة الطلاب</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="/">الرئيسية</Nav.Link>
              <Nav.Link href="/students">الطلاب</Nav.Link>
              <Nav.Link href="/specializations">التخصصات</Nav.Link>
              <Nav.Link onClick={handleLogout}>تسجيل الخروج</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="mb-4">
          <Col>
            <h2>📋 تسجيل الغياب والحضور</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <h5 className="text-success">✅ الحاضرون: {presentCount}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <h5 className="text-danger">❌ الغائبون: {absentCount}</h5>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center mb-3">
              <Card.Body>
                <h5 className="text-info">👥 الإجمالي: {students.length}</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>التاريخ</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={8} className="d-flex align-items-end gap-2">
            <Button 
              variant="success" 
              onClick={() => handleMarkAll('present')}
            >
              ✅ تسجيل الكل حاضر
            </Button>
            <Button 
              variant="danger" 
              onClick={() => handleMarkAll('absent')}
            >
              ❌ تسجيل الكل غائب
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveAttendance}
            >
              💾 حفظ السجل
            </Button>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الرقم القومي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.national_id}</td>
                  <td>
                    <Form.Check
                      type="radio"
                      label="حاضر ✅"
                      name={`attendance-${student.id}`}
                      value="present"
                      checked={attendance[student.id] === 'present'}
                      onChange={() => handleAttendanceChange(student.id, 'present')}
                    />
                    <Form.Check
                      type="radio"
                      label="غائب ❌"
                      name={`attendance-${student.id}`}
                      value="absent"
                      checked={attendance[student.id] === 'absent'}
                      onChange={() => handleAttendanceChange(student.id, 'absent')}
                    />
                    <Form.Check
                      type="radio"
                      label="متأخر 🕐"
                      name={`attendance-${student.id}`}
                      value="late"
                      checked={attendance[student.id] === 'late'}
                      onChange={() => handleAttendanceChange(student.id, 'late')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

export default Attendance;
