import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// User Components
import Dashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';
import MyAttendance from './components/user/MyAttendance';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import Users from './components/admin/Users';
import AdminAttendance from './components/admin/AdminAttendance';
import AddEditUser from './components/admin/AddEditUser';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/attendance" element={
              <ProtectedRoute>
                <MyAttendance />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="ADMIN">
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/attendance" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminAttendance />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/add-user" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AddEditUser />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/edit-user/:id" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AddEditUser />
              </ProtectedRoute>
            } />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;