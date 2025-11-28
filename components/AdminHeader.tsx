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
import BanknotesIcon from './icons/BanknotesIcon';
import ShareIcon from './icons/ShareIcon';
import ServerIcon from './icons/ServerIcon';
import HistoryIcon from './icons/HistoryIcon';
import { UserRole } from '../types';

interface AdminHeaderProps {
    activePage: string;
    setActivePage: (page: string) => void;
    onLogout: () => void;
    userRole: UserRole;
    onSwitchView?: () => void;
}

const NavLink: React.FC<{ label: string; page: string; activePage: string; icon: React.ReactNode; setActivePage: (page: string) => void }> = ({ label, page, activePage, icon, setActivePage }) => (
    <li className="shrink-0">
        <button 
            onClick={() => setActivePage(page)}
            className={`flex items-center px-2 py-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                activePage === page ? 'text-white bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            <span className="mr-1.5 w-4 h-4">{icon}</span>
            {label}
        </button>
    </li>
);

const AdminHeader: React.FC<AdminHeaderProps> = ({ activePage, setActivePage, onLogout, userRole, onSwitchView }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const adminName = userRole === 'admin' ? 'Tashi Dorji' : 'Karma Wangdi';
    const adminRoleLabel = userRole === 'admin' ? 'CADA' : 'ADA - Ministry of Finance';

    return (
        <header className="bg-white shadow-md sticky top-0 z-40 border-b-4 border-text-main">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Left Section: Logo & Title */}
                    <div className="flex items-center shrink-0 mr-4">
                        <PngLogoIcon />
                        <span className="ml-3 font-bold text-text-main text-sm hidden lg:block">Online Asset Declaration System</span>
                    </div>

                    {/* Center Section: Main Navigation */}
                    <nav className="flex-1 overflow-x-auto no-scrollbar">
                        <ul className="flex items-center space-x-1 h-full">
                           <NavLink icon={<DashboardIcon />} label="Home" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink icon={<UserGroupIcon />} label="Users" page="users" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink icon={<ClipboardCheckIcon />} label="Verify" page="verification" activePage={activePage} setActivePage={setActivePage} />
                           
                           {(userRole === 'admin' || userRole === 'agency_admin') && (
                               <NavLink icon={<BanknotesIcon />} label="Payments" page="payments" activePage={activePage} setActivePage={setActivePage} />
                           )}

                           {userRole === 'admin' && (
                               <>
                                   <NavLink icon={<ScaleIcon />} label="DA" page="da-cases" activePage={activePage} setActivePage={setActivePage} />
                                   <NavLink icon={<ShareIcon />} label="Sharing" page="info-sharing" activePage={activePage} setActivePage={setActivePage} />
                                   <NavLink icon={<ServerIcon />} label="APIs" page="api-mgmt" activePage={activePage} setActivePage={setActivePage} />
                               </>
                           )}
                           
                           <NavLink icon={<ChartBarIcon />} label="Stats" page="analytics" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink icon={<DocumentReportIcon />} label="Reports" page="reports" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink icon={<HistoryIcon />} label="Logs" page="audit" activePage={activePage} setActivePage={setActivePage} />
                        </ul>
                    </nav>

                    {/* Right Section: Actions and User Menu */}
                    <div className="flex items-center space-x-3 ml-4 shrink-0">
                        {onSwitchView && (
                            <button 
                                onClick={onSwitchView}
                                className="hidden lg:block text-[10px] font-bold text-primary border border-primary px-2 py-1 rounded hover:bg-blue-50 transition whitespace-nowrap"
                            >
                                File My Declaration
                            </button>
                        )}

                        <button className="relative text-text-secondary hover:text-text-main">
                            <BellIcon />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-text-main text-white flex items-center justify-center font-bold text-xs">
                                    {userRole === 'admin' ? 'CA' : 'AD'}
                                </div>
                                <div className="hidden xl:block text-left">
                                    <p className="text-xs font-semibold text-text-main">{adminName}</p>
                                    <p className="text-[10px] text-text-secondary">{adminRoleLabel}</p>
                                </div>
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-1 z-50">
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