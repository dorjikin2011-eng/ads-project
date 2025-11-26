import React, { useState, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HoADashboardPage from './pages/HoADashboardPage';
import { UserRole } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('official');
  const [viewMode, setViewMode] = useState<'admin' | 'declarant' | 'hoa'>('declarant');

  const handleLogin = useCallback((role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    // Set initial view mode based on role
    if (role === 'admin' || role === 'agency_admin') setViewMode('admin');
    else if (role === 'hoa') setViewMode('hoa');
    else setViewMode('declarant');
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserRole('official');
    setViewMode('declarant');
  }, []);

  const switchView = (mode: 'admin' | 'declarant' | 'hoa') => {
      setViewMode(mode);
  };

  // Determine which dashboard to render
  const renderDashboard = () => {
      // If any special role wants to file their own declaration
      if (viewMode === 'declarant') {
          // Pass the callback to switch back to their respective dashboard
          const backTarget = userRole === 'hoa' ? 'hoa' : 'admin';
          return <DashboardPage onLogout={handleLogout} userRole={userRole} onSwitchView={() => switchView(backTarget)} />;
      }

      // Role-specific dashboards
      if (viewMode === 'hoa') {
          return <HoADashboardPage onLogout={handleLogout} onSwitchView={() => switchView('declarant')} />;
      }
      
      // Admin Console
      if (viewMode === 'admin') {
          return <AdminDashboardPage userRole={userRole} onLogout={handleLogout} onSwitchView={() => switchView('declarant')} />;
      }
      
      return <DashboardPage onLogout={handleLogout} />;
  };

  return (
    <div className="min-h-screen">
      {isLoggedIn ? renderDashboard() : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;