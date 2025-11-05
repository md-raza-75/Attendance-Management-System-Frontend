import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { userService } from '../../services/userService';
import { useNavigate, useParams } from 'react-router-dom';
import AppNavbar from '../common/Navbar';

const AddEditUser = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const user = await userService.getUserById(id);
      setFormData({ ...user, password: '' });
    } catch (err) {
      setError('Failed to fetch user');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await userService.updateUser(id, formData);
      } else {
        await userService.createUser(formData);
      }
      navigate('/admin/users');
    } catch (err) {
      setError('Operation failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <Card className="shadow-sm">
          <Card.Body>
            <h4>{id ? 'Edit User' : 'Add User'}</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password {id ? '(leave blank to keep current)' : ''}</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required={!id} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="secondary" className="ms-2" onClick={() => navigate('/admin/users')}>Cancel</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AddEditUser;
