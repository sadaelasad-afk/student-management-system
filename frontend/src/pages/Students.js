import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import '../styles/Students.css';

const API_BASE_URL = 'http://localhost:5000/api';

function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    national_id: '',
    email: '',
    phone: '',
    specialization_id: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
    fetchSpecializations();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/specializations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpecializations(response.data);
    } catch (err) {
      console.error('Error fetching specializations:', err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = students.filter(student =>
      student.name.includes(term) || 
      student.national_id.includes(term) ||
      student.student_code.includes(term)
    );
    setFilteredStudents(filtered);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      national_id: '',
      email: '',
      phone: '',
      specialization_id: ''
    });
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      national_id: student.national_id,
      email: student.email,
      phone: student.phone,
      specialization_id: student.specialization_id
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/students/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/students`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      try {
        await axios.delete(`${API_BASE_URL}/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">⚡ نظام إدارة الطلاب</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="/">الرئيسية</Nav.Link>
              <Nav.Link href="/attendance">الغياب</Nav.Link>
              <Nav.Link href="/specializations">التخصصات</Nav.Link>
              <Nav.Link onClick={handleLogout}>تسجيل الخروج</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="mb-4">
          <Col>
            <h2>إدارة الطلاب</h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={handleAdd}>➕ إضافة طالب جديد</Button>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 ابحث عن طالب (الاسم، الرقم القومي، كود الطالب)"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الرقم القومي</th>
                <th>كود الطالب</th>
                <th>البريد الإلكتروني</th>
                <th>الهاتف</th>
                <th>التخصص</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.national_id}</td>
                  <td>{student.student_code}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.specialization}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm"
                      onClick={() => handleEdit(student)}
                      className="me-2"
                    >
                      ✏️ تعديل
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(student.id)}
                    >
                      🗑️ حذف
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'تعديل الطالب' : 'إضافة طالب جديد'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الرقم القومي</Form.Label>
              <Form.Control
                type="text"
                value={formData.national_id}
                onChange={(e) => setFormData({...formData, national_id: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الهاتف</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>التخصص</Form.Label>
              <Form.Select
                value={formData.specialization_id}
                onChange={(e) => setFormData({...formData, specialization_id: e.target.value})}
              >
                <option value="">اختر التخصص</option>
                {specializations.map(spec => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>إغلاق</Button>
          <Button variant="primary" onClick={handleSave}>حفظ</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Students;
