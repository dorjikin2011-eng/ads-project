import React, { useState } from 'react';
import LogoIcon from '../components/icons/LogoIcon';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginType, setLoginType] = useState<UserRole>('official');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginType);
  };

  const getRoleLabel = (role: UserRole) => {
      switch(role) {
          case 'admin': return 'Central Asset Declaration Administrator (CADA)';
          case 'agency_admin': return 'Asset Declaration Administrator (ADA)';
          case 'hoa': return 'Head of Agency (Executive)';
          default: return 'Public Official Declaration';
      }
  }

  const getRoleDescription = (role: UserRole) => {
      switch(role) {
          case 'admin': return 'For CADA staff at Anti-Corruption Commission monitoring Schedule I declarations and Agency reports.';
          case 'agency_admin': return 'For Agency ADAs managing Schedule II declarations and internal verification.';
          case 'hoa': return 'For Head of Agency to review compliance reports and approve submission to CADA.';
          default: return 'For all Public Officials to file annual asset declarations.';
      }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-primary">
          <div className="flex flex-col items-center mb-6">
            <div className={`rounded-full p-3 mb-4 ${loginType !== 'official' ? 'bg-text-main' : 'bg-primary'}`}>
              <LogoIcon />
            </div>
            <h1 className="text-2xl font-bold text-text-main text-center">Online Asset Declaration System</h1>
            <p className="text-text-secondary mt-2 font-medium text-sm uppercase tracking-wide text-center">
                {getRoleLabel(loginType)} Portal
            </p>
          </div>
          
          {/* Role Switcher */}
          <div className="flex flex-wrap rounded-md shadow-sm mb-6" role="group">
            <button
                type="button"
                onClick={() => setLoginType('official')}
                className={`flex-1 px-2 py-2 text-xs font-medium border border-gray-200 rounded-tl-lg hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-primary ${loginType === 'official' ? 'bg-gray-100 text-primary border-b-2 border-b-primary' : 'bg-white text-gray-700'}`}
            >
                Declarant
            </button>
            <button
                type="button"
                onClick={() => setLoginType('agency_admin')}
                className={`flex-1 px-2 py-2 text-xs font-medium border-t border-b border-r border-gray-200 hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-primary ${loginType === 'agency_admin' ? 'bg-gray-100 text-primary border-b-2 border-b-primary' : 'bg-white text-gray-700'}`}
            >
                ADA (Agency)
            </button>
            <button
                type="button"
                onClick={() => setLoginType('hoa')}
                className={`flex-1 px-2 py-2 text-xs font-medium border-t border-b border-r border-gray-200 hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-primary ${loginType === 'hoa' ? 'bg-gray-100 text-primary border-b-2 border-b-primary' : 'bg-white text-gray-700'}`}
            >
                Head of Agency
            </button>
            <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 px-2 py-2 text-xs font-medium border-t border-b border-r border-gray-200 rounded-tr-lg hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-primary ${loginType === 'admin' ? 'bg-gray-100 text-primary border-b-2 border-b-primary' : 'bg-white text-gray-700'}`}
            >
                CADA (ACC)
            </button>
          </div>

          <div className="mb-6 bg-blue-50 p-3 rounded-md text-xs text-blue-800 border border-blue-100">
              {getRoleDescription(loginType)}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cid" className="block text-sm font-medium text-text-secondary mb-1">
                {loginType === 'official' ? 'Citizen ID / E-ID' : 'Administrator ID'}
              </label>
              <input
                type="text"
                id="cid"
                placeholder={loginType === 'official' ? "Enter your ID" : "admin.user"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                defaultValue={loginType === 'official' ? "11223344" : "admin"}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                defaultValue="password"
              />
            </div>
            <button
              type="submit"
              className={`w-full text-white font-bold py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ${loginType !== 'official' ? 'bg-text-main' : 'bg-primary'}`}
            >
              Access Portal
            </button>
            
            <div className="text-center mt-4">
              <a href="#" className="text-sm text-accent hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
        <div className="text-center mt-6 text-text-secondary text-sm">
          <p>&copy; {new Date().getFullYear()} Anti-Corruption Commission of Bhutan. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;