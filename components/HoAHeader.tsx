import React, { useState, useRef, useEffect } from 'react';
import BellIcon from './icons/BellIcon';
import LogoutIcon from './icons/LogoutIcon';
import PngLogoIcon from './icons/PngLogoIcon';
import DashboardIcon from './icons/DashboardIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import UserAddIcon from './icons/UserAddIcon';

interface HoAHeaderProps {
    activePage: string;
    setActivePage: (page: string) => void;
    onLogout: () => void;
    onSwitchView?: () => void;
}

const NavLink: React.FC<{ label: string; page: string; activePage: string; icon: React.ReactNode; setActivePage: (page: string) => void }> = ({ label, page, activePage, icon, setActivePage }) => (
    <li>
        <button 
            onClick={() => setActivePage(page)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === page ? 'text-white bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            <span className="mr-2 w-5 h-5">{icon}</span>
            {label}
        </button>
    </li>
);

const HoAHeader: React.FC<HoAHeaderProps> = ({ activePage, setActivePage, onLogout, onSwitchView }) => {
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

    return (
        <header className="bg-white shadow-md sticky top-0 z-40 border-b-4 border-text-main">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Left Section: Logo & Title */}
                    <div className="flex items-center">
                        <PngLogoIcon />
                        <span className="ml-3 font-bold text-text-main text-lg hidden md:block">Online Asset Declaration System</span>
                    </div>

                    {/* Center Section: Main Navigation */}
                    <nav className="hidden md:flex">
                        <ul className="flex items-center space-x-2">
                           <NavLink icon={<DashboardIcon />} label="Overview" page="overview" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink icon={<DocumentReportIcon />} label="Report Approval" page="approval" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink icon={<UserGroupIcon />} label="Staff List" page="staff" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink icon={<UserAddIcon />} label="Admin Nominations" page="nominations" activePage={activePage} setActivePage={setActivePage} />
                        </ul>
                    </nav>

                    {/* Right Section: Actions and User Menu */}
                    <div className="flex items-center space-x-5">
                         {onSwitchView && (
                            <button 
                                onClick={onSwitchView}
                                className="text-xs font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-blue-50 transition"
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
                                <div className="w-10 h-10 rounded-full bg-text-main text-white flex items-center justify-center font-bold">
                                    HoA
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-text-main">Hon'ble Secretary</p>
                                    <p className="text-xs text-text-secondary">Ministry of Finance</p>
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

export default HoAHeader;