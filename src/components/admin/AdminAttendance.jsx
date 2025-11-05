import React, { useEffect, useState } from 'react';
import { 
  Container, Table, Button, Spinner, Alert, Card,
  Row, Col, Form, Badge 
} from 'react-bootstrap';
import { attendanceService } from '../../services/attendanceService';
import { userService } from '../../services/userService';
import AppNavbar from '../common/Navbar';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markingLoading, setMarkingLoading] = useState({});

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching REAL data from backend...');
      
      // REAL API calls - remove mock data
      const [attResponse, usersResponse] = await Promise.all([
        attendanceService.getAttendanceByDate(selectedDate),
        userService.getAllUsers()
      ]);
      
      console.log('✅ REAL Attendance data:', attResponse);
      console.log('✅ REAL Users data:', usersResponse);
      
      setAttendance(attResponse || []);
      setUsers(usersResponse || []);
      
    } catch (err) {
      console.error('❌ Error fetching REAL data:', err);
      setError('Backend connection failed. Using mock data for demonstration.');
      
      // Fallback to mock data only if APIs fail
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', department: 'IT', role: 'USER' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'HR', role: 'USER' },
        { id: 3, name: 'Admin User', email: 'admin@example.com', department: 'Admin', role: 'ADMIN' }
      ];
      
      const mockAttendance = [];
      
      setUsers(mockUsers);
      setAttendance(mockAttendance);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (userId, status) => {
    try {
      setMarkingLoading(prev => ({ ...prev, [userId]: true }));
      
      console.log(`🎯 Marking REAL attendance: User ${userId} as ${status}`);
      
      // REAL API call
      const attendanceData = {
        userId: userId, 
        status: status,
        date: selectedDate
      };
      
      const response = await attendanceService.markAttendance(attendanceData);
      console.log('✅ REAL Attendance marked:', response);
      
      // Refresh data after marking
      await fetchData();
      
      alert(`✅ ${status} marked successfully! User will see this in their dashboard.`);
      
    } catch (err) {
      console.error('❌ Error marking REAL attendance:', err);
      alert('Failed to mark attendance. Please try again.');
    } finally {
      setMarkingLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PRESENT: 'success',
      ABSENT: 'danger',
      HALF_DAY: 'warning',
      LATE: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getAttendanceRecord = (userId) => {
    return attendance.find(a => a.user?.id === userId);
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h2>Attendance Management</h2>
            <p className="text-muted">Mark and manage attendance for all users</p>
            {error && (
              <Alert variant="warning" className="mt-2">
                <strong>Note:</strong> {error}
              </Alert>
            )}
          </Col>
        </Row>

        {/* Date Selection */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Form.Group>
                  <Form.Label><strong>Select Date</strong></Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="bg-light">
              <Card.Body className="text-center">
                <h5>Summary for {selectedDate}</h5>
                <Row>
                  <Col>
                    <span className="text-success">
                      Present: {attendance.filter(a => a.status === 'PRESENT').length}
                    </span>
                  </Col>
                  <Col>
                    <span className="text-danger">
                      Absent: {attendance.filter(a => a.status === 'ABSENT').length}
                    </span>
                  </Col>
                  <Col>
                    <span className="text-warning">
                      Pending: {users.length - attendance.length}
                    </span>
                  </Col>
                </Row>
                {error && (
                  <Badge bg="warning" className="mt-2">Using Mock Data</Badge>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading attendance data from backend...</p>
          </div>
        ) : (
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Attendance for {new Date(selectedDate).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h5>
              <Button 
                size="sm" 
                variant="outline-primary" 
                onClick={fetchData}
                disabled={loading}
              >
                Refresh Data
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover striped>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const record = getAttendanceRecord(user.id);
                    const isMarking = markingLoading[user.id];
                    
                    return (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{user.name}</strong>
                          {user.role === 'ADMIN' && (
                            <Badge bg="primary" className="ms-2">ADMIN</Badge>
                          )}
                        </td>
                        <td>{user.email}</td>
                        <td>{user.department || '-'}</td>
                        <td>
                          {record ? (
                            getStatusBadge(record.status)
                          ) : (
                            <Badge bg="secondary">NOT MARKED</Badge>
                          )}
                        </td>
                        <td>
                          <div className="btn-group">
                            <Button 
                              size="sm" 
                              variant={record?.status === 'PRESENT' ? 'success' : 'outline-success'}
                              className="me-1"
                              onClick={() => markAttendance(user.id, 'PRESENT')}
                              disabled={isMarking}
                            >
                              {isMarking ? <Spinner size="sm" /> : 'Present'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant={record?.status === 'ABSENT' ? 'danger' : 'outline-danger'}
                              onClick={() => markAttendance(user.id, 'ABSENT')}
                              disabled={isMarking}
                            >
                              {isMarking ? <Spinner size="sm" /> : 'Absent'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default AdminAttendance;