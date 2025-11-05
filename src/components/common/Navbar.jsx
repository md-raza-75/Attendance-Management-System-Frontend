import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AppNavbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-calendar-check me-2"></i>
          Attendance System
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {currentUser && (
              currentUser.role === 'ADMIN' ? (
                <>
                  <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                  <Nav.Link as={Link} to="/admin/attendance">Attendance</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  <Nav.Link as={Link} to="/attendance">My Attendance</Nav.Link>
                </>
              )
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  Welcome, <strong>{currentUser.name}</strong>
                  <span className="badge bg-primary ms-2">{currentUser.role}</span>
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-1"></i>Logout
                </Button>
              </div>
            ) : (
              <div>
                <Button variant="outline-light" size="sm" as={Link} to="/login" className="me-2">
                  Login
                </Button>
                <Button variant="primary" size="sm" as={Link} to="/signup">
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;