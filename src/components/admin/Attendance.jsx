import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { attendanceService } from '../../services/attendanceService';
import { userService } from '../../services/userService';
import AppNavbar from '../common/Navbar';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const att = await attendanceService.getAttendanceByDate(today);
      const allUsers = await userService.getAllUsers();
      setAttendance(att);
      setUsers(allUsers);
    } catch (err) {
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (userId, status) => {
    try {
      await attendanceService.markAttendance({ userId, status });
      fetchData();
    } catch (err) {
      alert('Failed to mark attendance');
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <h3>Mark Today's Attendance</h3>
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const record = attendance.find(a => a.user?.id === user.id);
                return (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${record?.status === 'PRESENT' ? 'bg-success' : record?.status === 'ABSENT' ? 'bg-danger' : 'bg-secondary'}`}>
                        {record?.status || 'Not Marked'}
                      </span>
                    </td>
                    <td>
                      {!record && (
                        <>
                          <Button size="sm" variant="success" className="me-2" onClick={() => markAttendance(user.id, 'PRESENT')}>Present</Button>
                          <Button size="sm" variant="danger" onClick={() => markAttendance(user.id, 'ABSENT')}>Absent</Button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default AdminAttendance;
