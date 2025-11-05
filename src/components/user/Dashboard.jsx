import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner, Badge, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../common/Navbar';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todayStatus, setTodayStatus] = useState(null);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('PRESENT');
  const [markingLoading, setMarkingLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
      checkTodayAttendance();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const statsData = await attendanceService.getAttendanceStats(currentUser.id);
      const attendanceData = await attendanceService.getUserAttendance(currentUser.id);
      setStats(statsData);
      setRecentAttendance(attendanceData.slice(0, 5));
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await attendanceService.getUserAttendance(currentUser.id);
      const todayRecord = response.find(record => 
        record.date.split('T')[0] === today
      );
      setTodayStatus(todayRecord?.status || null);
    } catch (error) {
      console.error('Error checking today attendance:', error);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      setMarkingLoading(true);
      await attendanceService.markAttendance({
        userId: currentUser.id,
        status: selectedStatus,
        date: new Date().toISOString()
      });
      
      setShowMarkModal(false);
      setTodayStatus(selectedStatus);
      await fetchUserData(); // Refresh data
      
      // Show success message
      setError('');
    } catch (error) {
      setError('Failed to mark attendance');
    } finally {
      setMarkingLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PRESENT: 'success',
      ABSENT: 'danger',
      HALF_DAY: 'warning',
      LATE: 'info'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getTodayStatusColor = () => {
    const colors = {
      PRESENT: 'success',
      ABSENT: 'danger',
      HALF_DAY: 'warning',
      LATE: 'info'
    };
    return colors[todayStatus] || 'secondary';
  };

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="mt-4 text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 bg-light">
              <Card.Body className="text-center py-4">
                <h2>Welcome back, {currentUser.name}! 👋</h2>
                <p className="text-muted mb-0">
                  {todayStatus ? (
                    <span>
                      Today's attendance: <Badge bg={getTodayStatusColor()}>{todayStatus}</Badge>
                    </span>
                  ) : (
                    "Mark your attendance for today"
                  )}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={3}>
                    <Button 
                      variant={todayStatus ? "outline-success" : "success"}
                      className="w-100"
                      onClick={() => setShowMarkModal(true)}
                      disabled={todayStatus}
                    >
                      {todayStatus ? 'Attendance Marked' : 'Mark Today'}
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-primary" 
                      className="w-100"
                      onClick={() => navigate('/attendance')}
                    >
                      View All Records
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-info" 
                      className="w-100"
                      onClick={() => navigate('/profile')}
                    >
                      Update Profile
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-warning" 
                      className="w-100"
                      onClick={fetchUserData}
                    >
                      Refresh Data
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stats-card shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Total Days</h6>
                <h3>{stats?.statistics?.totalDays || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card present shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Present</h6>
                <h3 className="text-success">{stats?.statistics?.presentDays || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card absent shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Absent</h6>
                <h3 className="text-danger">{stats?.statistics?.absentDays || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card percentage shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted">Attendance %</h6>
                <h3 className="text-warning">{stats?.attendancePercentage?.toFixed(1) || 0}%</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Attendance */}
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Attendance</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/attendance')}
                >
                  View All
                </Button>
              </Card.Header>
              <Card.Body>
                {recentAttendance.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Marked By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAttendance.map((record) => (
                        <tr key={record.id}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                          <td>{getStatusBadge(record.status)}</td>
                          <td>{record.markedBy?.name || 'System'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No attendance records found.</p>
                    <Button variant="primary" onClick={() => setShowMarkModal(true)}>
                      Mark First Attendance
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mark Attendance Modal */}
        <Modal show={showMarkModal} onHide={() => setShowMarkModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Mark Today's Attendance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Status</Form.Label>
                <Form.Select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="PRESENT">Present</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                </Form.Select>
              </Form.Group>
              <div className="text-muted small">
                <strong>Date:</strong> {new Date().toLocaleDateString()} • 
                <strong> Day:</strong> {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMarkModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleMarkAttendance}
              disabled={markingLoading}
            >
              {markingLoading ? <Spinner size="sm" /> : 'Mark Attendance'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Dashboard;