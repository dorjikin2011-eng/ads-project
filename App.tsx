import React, { useState, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HoADashboardPage from './pages/HoADashboardPage';
import { UserRole } from './types';
import { CommissionProvider } from './src/CommissionContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('official');
  const [viewMode, setViewMode] = useState<'admin' | 'declarant' | 'hoa'>('declarant');

  const handleLogin = useCallback((role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (role === 'admin' || role === 'agency_admin') setViewMode('admin');
    else if (role === 'hoa') setViewMode('hoa');
    else setViewMode('declarant');
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserRole('official');
    setViewMode('declarant');
  }, []);

  const switchView = (mode: 'admin' | 'declarant' | 'hoa') => setViewMode(mode);

  const renderDashboard = () => {
    if (viewMode === 'declarant') {
      const backTarget = userRole === 'hoa' ? 'hoa' : 'admin';
      return <DashboardPage onLogout={handleLogout} userRole={userRole} onSwitchView={() => switchView(backTarget)} />;
    }
    if (viewMode === 'hoa') return <HoADashboardPage onLogout={handleLogout} onSwitchView={() => switchView('declarant')} />;
    if (viewMode === 'admin') return <AdminDashboardPage userRole={userRole} onLogout={handleLogout} onSwitchView={() => switchView('declarant')} />;
    return <DashboardPage onLogout={handleLogout} />;
  };

  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        <CommissionProvider>
          {renderDashboard()}
        </CommissionProvider>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
