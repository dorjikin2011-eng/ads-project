import React, { useState } from 'react';
import LogoIcon from '../components/icons/LogoIcon';
import PngLogoIcon from '../components/icons/PngLogoIcon';
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

  const handleNDILogin = () => {
    alert("Redirecting to Bhutan NDI Authentication...");
    setTimeout(() => onLogin(loginType), 1500);
  };

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'CADA (ACC)';
      case 'agency_admin': return 'ADA (Agency)';
      case 'hoa': return 'Head of Agency';
      default: return 'Declarant';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      
      {/* Logo Header */}
      <div className="mb-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:space-x-4 space-y-2 sm:space-y-0">
          <PngLogoIcon />
          <div className="text-center sm:text-left">
            <span className="block text-xl sm:text-2xl font-semibold text-text-main">Online Asset</span>
            <span className="block text-xl sm:text-2xl font-semibold text-text-main">Declaration System</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        
        {/* NDI Login Button */}
        <button 
          onClick={handleNDILogin}
          className="w-full bg-[#1a4d4d] hover:bg-[#133a3a] text-white font-bold py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center transition duration-200"
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          LOGIN WITH BHUTAN NDI
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-4 mt-2 mb-2">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-400 font-bold text-lg">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Standard Login Card */}
        <div className="bg-yellow-400 rounded-xl shadow-xl overflow-hidden border border-yellow-300">
          <div className="bg-yellow-500 p-6 text-center">
            <h2 className="text-2xl font-extrabold text-white tracking-wide">LOGIN</h2>
            <p className="text-yellow-100 text-sm mt-1 font-medium">{getRoleLabel(loginType)} Portal</p>
          </div>

          <div className="p-6">
            {/* Role Switcher Tabs */}
            <div className="flex flex-wrap gap-1 mb-4 justify-center">
              <button onClick={() => setLoginType('official')} className={`px-3 py-1 text-xs font-bold rounded-full border ${loginType === 'official' ? 'bg-yellow-600 text-white border-yellow-600' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}>Declarant</button>
              <button onClick={() => setLoginType('agency_admin')} className={`px-3 py-1 text-xs font-bold rounded-full border ${loginType === 'agency_admin' ? 'bg-yellow-600 text-white border-yellow-600' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}>ADA</button>
              <button onClick={() => setLoginType('hoa')} className={`px-3 py-1 text-xs font-bold rounded-full border ${loginType === 'hoa' ? 'bg-yellow-600 text-white border-yellow-600' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}>HoA</button>
              <button onClick={() => setLoginType('admin')} className={`px-3 py-1 text-xs font-bold rounded-full border ${loginType === 'admin' ? 'bg-yellow-600 text-white border-yellow-600' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}>CADA</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  id="cid"
                  placeholder="11103001152"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition text-gray-700 font-medium"
                  defaultValue={loginType === 'official' ? "11103001152" : "admin"}
                />
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition text-gray-700 font-medium"
                  defaultValue="password"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-1">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 mr-2" />
                  Remember me
                </label>
                <a href="#" className="hover:text-yellow-600 hover:underline">Show Password</a>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition transform active:scale-95 mt-3"
              >
                LOG IN
              </button>
              
              <div className="text-center mt-3">
                <a href="#" className="text-sm text-yellow-100 hover:text-yellow-300 transition">Forgot your password?</a>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center text-gray-400 text-xs mt-6">
          <p>&copy; {new Date().getFullYear()} Anti-Corruption Commission of Bhutan.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
