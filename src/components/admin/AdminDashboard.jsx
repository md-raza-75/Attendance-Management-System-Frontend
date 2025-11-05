import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Table, 
  Alert, Spinner, Badge 
} from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { attendanceService } from '../../services/attendanceService';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../common/Navbar';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchAdminData();
    }
  }, [currentUser]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [usersData, today] = await Promise.all([
        userService.getAllUsers(),
        attendanceService.getAttendanceByDate(new Date().toISOString().split('T')[0])
      ]);

      const totalUsers = usersData.length || 0;
      const adminCount = usersData.filter(u => u.role === 'ADMIN').length;
      const userCount = usersData.filter(u => u.role === 'USER').length;
      const presentToday = today.filter(a => a.status === 'PRESENT').length;
      const absentToday = today.filter(a => a.status === 'ABSENT').length;

      setStats({
        totalUsers,
        adminCount,
        userCount,
        presentToday,
        absentToday,
        pendingToday: totalUsers - (presentToday + absentToday)
      });

      setRecentUsers(usersData.slice(-5).reverse());
      setTodayAttendance(today);
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card className={`stat-card border-0 bg-${color} text-white h-100`}>
      <Card.Body className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h2 className="fw-bold mb-1">{value}</h2>
          <h6 className="mb-0 opacity-75">{title}</h6>
          {subtitle && <small className="opacity-75">{subtitle}</small>}
        </div>
        <div className="stat-icon">
          <i className={`fas fa-${icon} fa-2x opacity-50`}></i>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="mt-4">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading dashboard...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 fw-bold text-dark mb-1">Admin Dashboard</h1>
                <p className="text-muted mb-0">Welcome back, {currentUser?.name}!</p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/admin/attendance')}
                >
                  <i className="fas fa-calendar-check me-2"></i>
                  Mark Attendance
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/admin/users')}
                >
                  <i className="fas fa-users me-2"></i>
                  Manage Users
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Grid */}
        <Row className="g-3 mb-4">
          <Col md={2}>
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers || 0} 
              icon="users" 
              color="primary" 
            />
          </Col>
          <Col md={2}>
            <StatCard 
              title="Admins" 
              value={stats.adminCount || 0} 
              icon="user-shield" 
              color="info" 
            />
          </Col>
          <Col md={2}>
            <StatCard 
              title="Users" 
              value={stats.userCount || 0} 
              icon="user" 
              color="success" 
            />
          </Col>
          <Col md={2}>
            <StatCard 
              title="Present Today" 
              value={stats.presentToday || 0} 
              icon="check-circle" 
              color="success"
              subtitle="Attended"
            />
          </Col>
          <Col md={2}>
            <StatCard 
              title="Absent Today" 
              value={stats.absentToday || 0} 
              icon="times-circle" 
              color="danger"
              subtitle="Not attended"
            />
          </Col>
          <Col md={2}>
            <StatCard 
              title="Pending" 
              value={stats.pendingToday || 0} 
              icon="clock" 
              color="warning"
              subtitle="Not marked"
            />
          </Col>
        </Row>

        <Row className="g-4">
          {/* Recent Users */}
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Recent Users</h5>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-primary p-0"
                    onClick={() => navigate('/admin/users')}
                  >
                    View All
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {recentUsers.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="list-group-item border-0 py-3">
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{width: '40px', height: '40px'}}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">{user.name}</h6>
                            <small className="text-muted">{user.email}</small>
                          </div>
                          <Badge 
                            bg={user.role === 'ADMIN' ? 'primary' : 'success'} 
                            className="fs-3"
                          >
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-users fa-2x text-muted mb-3"></i>
                    <p className="text-muted mb-0">No users found</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Today's Attendance Summary */}
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Today's Attendance</h5>
                  <small className="text-muted">
                    {new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </small>
                </div>
              </Card.Header>
              <Card.Body>
                {todayAttendance.length > 0 ? (
                  <div className="attendance-summary">
                    {todayAttendance.slice(0, 6).map((record) => (
                      <div key={record.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div className="d-flex align-items-center">
                          <div 
                            className={`status-indicator me-3 ${
                              record.status === 'PRESENT' ? 'bg-success' : 'bg-danger'
                            }`}
                            style={{width: '8px', height: '8px', borderRadius: '50%'}}
                          ></div>
                          <div>
                            <h6 className="mb-0 fw-semibold small">{record.userName}</h6>
                            <small className="text-muted">{record.userEmail}</small>
                          </div>
                        </div>
                        <Badge 
                          bg={record.status === 'PRESENT' ? 'success' : 'danger'}
                          className="fs-3"
                        >
                          {record.status}
                        </Badge>
                      </div>
                    ))}
                    {todayAttendance.length > 6 && (
                      <div className="text-center pt-2">
                        <small className="text-muted">
                          +{todayAttendance.length - 6} more records
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-calendar-day fa-2x text-muted mb-3"></i>
                    <p className="text-muted mb-3">No attendance marked today</p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate('/admin/attendance')}
                    >
                      Mark Attendance
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={3}>
                    <Button 
                      variant="outline-primary" 
                      className="w-100 h-100 py-3 action-btn"
                      onClick={() => navigate('/admin/attendance')}
                    >
                      <i className="fas fa-calendar-check fa-2x mb-2"></i>
                      <h6>Mark Attendance</h6>
                      <small className="text-muted">Mark today's attendance</small>
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-success" 
                      className="w-100 h-100 py-3 action-btn"
                      onClick={() => navigate('/admin/users')}
                    >
                      <i className="fas fa-users fa-2x mb-2"></i>
                      <h6>Manage Users</h6>
                      <small className="text-muted">Add/edit users</small>
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-info" 
                      className="w-100 h-100 py-3 action-btn"
                      onClick={() => navigate('/admin/reports')}
                    >
                      <i className="fas fa-chart-bar fa-2x mb-2"></i>
                      <h6>View Reports</h6>
                      <small className="text-muted">Attendance reports</small>
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button 
                      variant="outline-warning" 
                      className="w-100 h-100 py-3 action-btn"
                      onClick={fetchAdminData}
                    >
                      <i className="fas fa-sync-alt fa-2x mb-2"></i>
                      <h6>Refresh Data</h6>
                      <small className="text-muted">Update dashboard</small>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .stat-card {
          transition: transform 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        .stat-icon {
          opacity: 0.8;
        }
        .action-btn {
          border: 2px dashed #dee2e6;
          background: white;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          border-color: #0d6efd;
          background: #f8f9fa;
          transform: translateY(-2px);
        }
        .avatar {
          font-weight: 600;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;