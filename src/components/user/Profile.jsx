import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import AppNavbar from '../common/Navbar';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        department: currentUser.department || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateUser(currentUser.id, formData);
      
      // Update context and localStorage
      updateUser(formData);
      
      setSuccess('Profile updated successfully!');
      
      // Auto hide success message
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-5 pt-4">
        <Row className="justify-content-center">
          <Col xl={10}>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h2 fw-bold text-dark mb-1">My Profile</h1>
                <p className="text-muted mb-0">Manage your account information and preferences</p>
              </div>
              <Badge bg="light" text="dark" className="fs-6">
                <i className="fas fa-user me-1"></i>
                {currentUser?.role}
              </Badge>
            </div>

            <Row>
              {/* Left Column - Profile Form */}
              <Col lg={8} className="mb-4">
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-white py-3 border-bottom">
                    <h5 className="mb-0 fw-semibold">
                      <i className="fas fa-user-edit text-primary me-2"></i>
                      Personal Information
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {success && (
                      <Alert variant="success" className="d-flex align-items-center">
                        <i className="fas fa-check-circle me-2"></i>
                        {success}
                      </Alert>
                    )}
                    {error && (
                      <Alert variant="danger" className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-user me-1 text-muted"></i>
                              Full Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="border-0 bg-light py-2"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-envelope me-1 text-muted"></i>
                              Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              disabled
                              className="border-0 bg-light py-2"
                            />
                            <Form.Text className="text-muted">
                              Email cannot be changed
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-phone me-1 text-muted"></i>
                              Phone Number
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Enter your phone number"
                              className="border-0 bg-light py-2"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="fas fa-building me-1 text-muted"></i>
                              Department
                            </Form.Label>
                            <Form.Select
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              className="border-0 bg-light py-2"
                            >
                              <option value="">Select Department</option>
                              <option value="Engineering">Engineering</option>
                              <option value="Sales">Sales</option>
                              <option value="Marketing">Marketing</option>
                              <option value="HR">HR</option>
                              <option value="Finance">Finance</option>
                              <option value="Operations">Operations</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          <i className="fas fa-home me-1 text-muted"></i>
                          Address
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your complete address"
                          className="border-0 bg-light py-2"
                        />
                      </Form.Group>

                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Button
                          variant="outline-secondary"
                          size="lg"
                          className="me-md-2"
                          onClick={() => window.history.back()}
                        >
                          <i className="fas fa-arrow-left me-2"></i>
                          Back
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          size="lg"
                          disabled={loading}
                          className="px-4"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Update Profile
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              {/* Right Column - Account Info and Stats */}
              <Col lg={4}>
                {/* Account Info Card */}
                <Card className="shadow-sm border-0 mb-4">
                  <Card.Header className="bg-white py-3 border-bottom">
                    <h5 className="mb-0 fw-semibold">
                      <i className="fas fa-id-card text-primary me-2"></i>
                      Account Details
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: '50px', height: '50px' }}>
                        <i className="fas fa-user text-white fs-5"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{currentUser?.name}</h6>
                        <small className="text-muted">{currentUser?.email}</small>
                      </div>
                    </div>
                    
                    <hr />
                    
                    <div className="mb-2">
                      <small className="text-muted">User ID</small>
                      <p className="mb-0 fw-semibold">{currentUser?.id}</p>
                    </div>
                    
                    <div className="mb-2">
                      <small className="text-muted">Department</small>
                      <p className="mb-0 fw-semibold">
                        {currentUser?.department || 'Not assigned'}
                      </p>
                    </div>
                    
                    <div className="mb-2">
                      <small className="text-muted">Account Created</small>
                      <p className="mb-0 fw-semibold">
                        {currentUser?.createdAt
                          ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="mb-0">
                      <small className="text-muted">Last Updated</small>
                      <p className="mb-0 fw-semibold">
                        {currentUser?.updatedAt
                          ? new Date(currentUser.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </Card.Body>
                </Card>

                {/* Quick Stats Card */}
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white py-3 border-bottom">
                    <h5 className="mb-0 fw-semibold">
                      <i className="fas fa-chart-bar text-primary me-2"></i>
                      Quick Stats
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center">
                      <Row>
                        <Col xs={6} className="mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-calendar-check fa-lg text-success mb-2"></i>
                            <h5 className="mb-0 fw-bold">95%</h5>
                            <small className="text-muted">Attendance</small>
                          </div>
                        </Col>
                        <Col xs={6} className="mb-3">
                          <div className="border rounded p-3">
                            <i className="fas fa-umbrella-beach fa-lg text-warning mb-2"></i>
                            <h5 className="mb-0 fw-bold">12</h5>
                            <small className="text-muted">Leaves Left</small>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;