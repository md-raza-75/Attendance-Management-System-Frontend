import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import AppNavbar from '../common/Navbar';

const MyAttendance = () => {
  const { currentUser } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (currentUser) {
      fetchAttendance();
    }
  }, [currentUser]);

  useEffect(() => {
    filterAttendanceByMonth();
  }, [attendance, filterMonth, filterYear]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getUserAttendance(currentUser.id);
      setAttendance(data);
    } catch (error) {
      setError('Failed to load attendance records');
      console.error('Attendance fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAttendanceByMonth = () => {
    const filtered = attendance.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() + 1 === parseInt(filterMonth) &&
        recordDate.getFullYear() === parseInt(filterYear)
      );
    });
    setFilteredAttendance(filtered);
  };

  const calculateStats = () => {
    const present = filteredAttendance.filter(r => r.status === 'PRESENT').length;
    const absent = filteredAttendance.filter(r => r.status === 'ABSENT').length;
    const total = filteredAttendance.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { present, absent, total, percentage };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading attendance...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 bg-primary text-white">
              <Card.Body className="text-center py-4">
                <h2 className="fw-bold">My Attendance 📅</h2>
                <p className="mb-0">Track your attendance records</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <i className="fas fa-calendar fa-2x text-info mb-2"></i>
                <h4 className="fw-bold">{stats.total}</h4>
                <p className="text-muted mb-0">Total Days</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                <h4 className="fw-bold">{stats.present}</h4>
                <p className="text-muted mb-0">Present</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <i className="fas fa-times-circle fa-2x text-danger mb-2"></i>
                <h4 className="fw-bold">{stats.absent}</h4>
                <p className="text-muted mb-0">Absent</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <i className="fas fa-chart-pie fa-2x text-warning mb-2"></i>
                <h4 className="fw-bold">{stats.percentage}%</h4>
                <p className="text-muted mb-0">Attendance</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filter Section */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Select Month</Form.Label>
                      <Form.Select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Select Year</Form.Label>
                      <Form.Select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                      >
                        {[2023, 2024, 2025, 2026].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={filterAttendanceByMonth}
                    >
                      <i className="fas fa-filter me-2"></i>
                      Apply Filter
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Attendance Table */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Attendance Records</h5>
              </Card.Header>
              <Card.Body>
                {filteredAttendance.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Marked By</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((record, index) => (
                        <tr key={record.id}>
                          <td>{index + 1}</td>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                          </td>
                          <td>
                            <Badge
                              bg={record.status === 'PRESENT' ? 'success' : 'danger'}
                            >
                              {record.status}
                            </Badge>
                          </td>
                          <td>{record.markedBy?.name || 'System'}</td>
                          <td>
                            {new Date(record.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-calendar-times fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">No attendance records found</h5>
                    <p className="text-muted">
                      No attendance marked for {new Date(filterYear, filterMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyAttendance;
