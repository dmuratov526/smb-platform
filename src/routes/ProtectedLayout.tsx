import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import AppShell from '../layout/AppShell';

const ProtectedLayout: React.FC = () => {
  const currentUserId = useAppSelector((s) => s.session.currentUserId);

  if (!currentUserId) {
    return <Navigate to="/select-user" replace />;
  }

  return <AppShell />;
};

export default ProtectedLayout;
