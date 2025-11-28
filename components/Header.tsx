import React, { useState, useEffect, useRef } from 'react';
import BellIcon from './icons/BellIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import MegaphoneIcon from './icons/MegaphoneIcon';
import MailIcon from './icons/MailIcon';
import ProfileIcon from './icons/ProfileIcon';
import LogoutIcon from './icons/LogoutIcon';
import PngLogoIcon from './icons/PngLogoIcon';
import { UserRole } from '../types';

interface HeaderProps {
    activePage: string;
    setActivePage: (page: string) => void;
    onLogout: () => void;
    profilePicture: string;
    userRole?: UserRole;
    onSwitchView?: () => void;
}

const NavLink: React.FC<{ label: string; page: string; activePage: string; setActivePage: (page: string) => void }> = ({ label, page, activePage, setActivePage }) => (
    <li>
        <button 
            onClick={() => setActivePage(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === page ? 'text-primary bg-blue-100' : 'text-text-secondary hover:text-primary hover:bg-gray-100'
            }`}
        >
            {label}
        </button>
    </li>
);

const DropdownLink: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-gray-100 hover:text-primary rounded-md"
    >
      <div className="w-6 h-6 mr-3">{icon}</div>
      <span>{label}</span>
    </button>
);


const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onLogout, profilePicture, userRole, onSwitchView }) => {
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const resourcesRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
                setResourcesOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDropdownClick = (page: string) => {
        setActivePage(page);
        setResourcesOpen(false);
        setProfileOpen(false);
    };

    const isAdmin = userRole === 'admin' || userRole === 'agency_admin' || userRole === 'hoa';

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Left Section: Logo & Title */}
                    <div className="flex items-center">
                        <PngLogoIcon />
                        <span className="ml-3 font-bold text-text-main text-lg hidden md:block">Online Asset Declaration System</span>
                    </div>

                    {/* Center Section: Main Navigation */}
                    <nav className="hidden md:flex">
                        <ul className="flex items-center space-x-4">
                           <NavLink label="Dashboard" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink label="File New" page="filenew" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink label="History" page="history" activePage={activePage} setActivePage={setActivePage} />
                           <NavLink label="Make Payment" page="payment" activePage={activePage} setActivePage={setActivePage} />
                        </ul>
                    </nav>

                    {/* Right Section: Actions and User Menu */}
                    <div className="flex items-center space-x-5">
                        {/* SWITCH BACK BUTTON */}
                        {isAdmin && onSwitchView && (
                             <button 
                                onClick={onSwitchView}
                                className="text-xs font-bold text-white bg-gray-800 px-3 py-1.5 rounded hover:bg-gray-700 transition"
                            >
                                Switch to Admin Console
                            </button>
                        )}

                        {/* Resources Dropdown */}
                        <div className="relative" ref={resourcesRef}>
                            <button onClick={() => setResourcesOpen(!resourcesOpen)} className="flex items-center text-sm font-medium text-text-secondary hover:text-primary">
                                <span>Help & Support</span>
                                <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {resourcesOpen && (
                                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-2">
                                    <DropdownLink icon={<QuestionMarkCircleIcon />} label="FAQs" onClick={() => handleDropdownClick('faq')} />
                                    <DropdownLink icon={<BookOpenIcon />} label="Resources" onClick={() => handleDropdownClick('resources')} />
                                    <DropdownLink icon={<MegaphoneIcon />} label="Whistleblowing" onClick={() => handleDropdownClick('whistleblowing')} />
                                    <DropdownLink icon={<MailIcon />} label="Contact Us" onClick={() => handleDropdownClick('contact')} />
                                </div>
                            )}
                        </div>

                        {/* Notification Bell */}
                        <button className="relative text-text-secondary hover:text-primary">
                            <BellIcon />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        
                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setProfileOpen(!profileOpen)}>
                                <img 
                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 ring-transparent group-hover:ring-accent" 
                                    src={profilePicture} 
                                    alt="User avatar" 
                                />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-2">
                                    <div className="px-4 py-3 border-b">
                                        <p className="text-sm font-semibold text-text-main">Kinley Wangchuk</p>
                                        <p className="text-xs text-text-secondary">Official ID: 12345</p>
                                    </div>
                                    <div className="py-1">
                                      <DropdownLink icon={<ProfileIcon />} label="Your Profile" onClick={() => handleDropdownClick('profile')} />
                                      <DropdownLink icon={<LogoutIcon />} label="Logout" onClick={onLogout} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;