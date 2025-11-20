import React, { useState, useRef, useEffect } from 'react';
import BellIcon from './icons/BellIcon';
import LogoutIcon from './icons/LogoutIcon';
import PngLogoIcon from './icons/PngLogoIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import ClipboardCheckIcon from './icons/ClipboardCheckIcon';
import DashboardIcon from './icons/DashboardIcon';
import ScaleIcon from './icons/ScaleIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import { UserRole } from '../types';
interface AdminHeaderProps {
activePage: string;
setActivePage: (page: string) => void;
onLogout: () => void;
userRole: UserRole;
}
const NavLink: React.FC<{ label: string; page: string; activePage: string; icon: React.ReactNode; setActivePage: (page: string) => void }> = ({ label, page, activePage, icon, setActivePage }) => (
<li>
<button
onClick={() => setActivePage(page)}
className={flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${ activePage === page ? 'text-white bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' }}
>
<span className="mr-2 w-5 h-5">{icon}</span>
{label}
</button>
</li>
);
const AdminHeader: React.FC<AdminHeaderProps> = ({ activePage, setActivePage, onLogout, userRole }) => {
const [profileOpen, setProfileOpen] = useState(false);
const profileRef = useRef<HTMLDivElement>(null);
code
Code
useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
            setProfileOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const title = userRole === 'admin' ? 'ACC Admin' : 'Agency Admin';
const subtitle = userRole === 'admin' ? 'Central Verification Console' : 'Ministry of Finance';

return (
    <header className="bg-white shadow-md sticky top-0 z-40 border-b-4 border-text-main">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                
                {/* Left Section: Logo and Title */}
                <div className="flex items-center">
                    <PngLogoIcon />
                    <div className="ml-3 hidden md:block">
                        <h1 className="text-lg font-bold text-text-main leading-none">{title}</h1>
                        <span className="text-xs text-text-secondary">{subtitle}</span>
                    </div>
                </div>

                {/* Center Section: Main Navigation */}
                <nav className="hidden md:flex">
                    <ul className="flex items-center space-x-2">
                       <NavLink icon={<DashboardIcon />} label="Overview" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
                       <NavLink icon={<UserGroupIcon />} label="Declarants" page="users" activePage={activePage} setActivePage={setActivePage} />
                       <NavLink icon={<ClipboardCheckIcon />} label="Verification" page="verification" activePage={activePage} setActivePage={setActivePage} />
                       {userRole === 'admin' && (
                           <NavLink icon={<ScaleIcon />} label="DA Cases" page="da-cases" activePage={activePage} setActivePage={setActivePage} />
                       )}
                       <NavLink icon={<ChartBarIcon />} label="Analytics" page="analytics" activePage={activePage} setActivePage={setActivePage} />
                       <NavLink icon={<DocumentReportIcon />} label="Reports" page="reports" activePage={activePage} setActivePage={setActivePage} />
                    </ul>
                </nav>

                {/* Right Section: Actions and User Menu */}
                <div className="flex items-center space-x-5">
                    <button className="relative text-text-secondary hover:text-text-main">
                        <BellIcon />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                    
                    <div className="relative" ref={profileRef}>
                        <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-text-main text-white flex items-center justify-center font-bold">
                                {userRole === 'admin' ? 'AC' : 'AA'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-text-main">{userRole === 'admin' ? 'ACC Officer' : 'HR Officer'}</p>
                                <p className="text-xs text-text-secondary">{userRole === 'admin' ? 'Head Office' : 'Agency Admin'}</p>
                            </div>
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1">
                                <button 
                                    onClick={onLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    <div className="w-5 h-5 mr-2"><LogoutIcon /></div>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </header>
);
};
export default AdminHeader;