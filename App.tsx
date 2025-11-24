import React, { useState, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HoADashboardPage from './pages/HoADashboardPage';
import { UserRole } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('official');

  const handleLogin = useCallback((role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserRole('official'); // Reset to default
  }, []);

  // Determine which dashboard to render based on role
  const renderDashboard = () => {
      switch(userRole) {
          case 'admin':
          case 'agency_admin':
              return <AdminDashboardPage userRole={userRole} onLogout={handleLogout} />;
          case 'hoa':
              return <HoADashboardPage onLogout={handleLogout} />;
          default:
              return <DashboardPage onLogout={handleLogout} />;
      }
  };

  return (
    <div className="min-h-screen">
      {isLoggedIn ? renderDashboard() : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;