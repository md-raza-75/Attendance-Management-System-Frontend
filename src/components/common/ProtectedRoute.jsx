import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();
  
  console.log('🔒 ProtectedRoute Check:');
  console.log(' - currentUser:', currentUser);
  console.log(' - requiredRole:', requiredRole);
  console.log(' - loading:', loading);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    console.log('❌ Role mismatch, redirecting to dashboard');
    return <Navigate to="/dashboard" />;
  }

  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;