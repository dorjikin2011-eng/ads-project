import React, { useState, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
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
return (
<div className="min-h-screen">
{isLoggedIn ? (
(userRole === 'admin' || userRole === 'agency_admin') ? (
<AdminDashboardPage userRole={userRole} onLogout={handleLogout} />
) : (
<DashboardPage onLogout={handleLogout} />
)
) : (
<LoginPage onLogin={handleLogin} />
)}
</div>
);
}
export default App;