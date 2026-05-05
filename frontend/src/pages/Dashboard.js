import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">⚡ نظام إدارة الطلاب - البرق</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="/students">الطلاب</Nav.Link>
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
            <h2>مرحباً بك في نظام إدارة الطلاب</h2>
          </Col>
        </Row>

        <Row>
          <Col md={3} className="mb-3">
            <Card className="dashboard-card">
              <Card.Body>
                <h5>👥 الطلاب</h5>
                <p className="text-muted">إدارة بيانات الطلاب</p>
                <Button variant="primary" onClick={() => navigate('/students')}>عرض</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="dashboard-card">
              <Card.Body>
                <h5>📋 الغياب والحضور</h5>
                <p className="text-muted">تسجيل الغياب السريع</p>
                <Button variant="success" onClick={() => navigate('/attendance')}>تسجيل</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="dashboard-card">
              <Card.Body>
                <h5>🎓 التخصصات</h5>
                <p className="text-muted">إدارة التخصصات والأقسام</p>
                <Button variant="info" onClick={() => navigate('/specializations')}>عرض</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="dashboard-card">
              <Card.Body>
                <h5>📊 التقارير</h5>
                <p className="text-muted">عرض التقارير الإحصائية</p>
                <Button variant="warning" disabled>قريباً</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
