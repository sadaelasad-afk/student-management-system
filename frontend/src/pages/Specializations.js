import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function Specializations() {
  const [specializations, setSpecializations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSpecializations();
  }, []);

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

  const handleAdd = () => {
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_BASE_URL}/specializations`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchSpecializations();
    } catch (err) {
      console.error('Error saving specialization:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <Navbar bg="info" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">⚡ نظام إدارة الطلاب</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="/">الرئيسية</Nav.Link>
              <Nav.Link href="/students">الطلاب</Nav.Link>
              <Nav.Link href="/attendance">الغياب</Nav.Link>
              <Nav.Link onClick={handleLogout}>تسجيل الخروج</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="mb-4">
          <Col>
            <h2>🎓 إدارة التخصصات</h2>
          </Col>
          <Col className="text-end">
            <Button variant="info" onClick={handleAdd}>➕ إضافة تخصص جديد</Button>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>اسم التخصص</th>
                <th>الوصف</th>
              </tr>
            </thead>
            <tbody>
              {specializations.map((spec, index) => (
                <tr key={spec.id}>
                  <td>{index + 1}</td>
                  <td>{spec.name}</td>
                  <td>{spec.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>إضافة تخصص جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>اسم التخصص</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
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

export default Specializations;
