import React, { useState } from 'react';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import DeclarationRow from '../components/DeclarationRow';
import { Declaration, DeclarationStatus } from '../types';
import FileNewPage from './FileNewPage';
import ProfilePage from './ProfilePage';
import HistoryPage from './HistoryPage';
import FaqPage from './FaqPage';
import ResourcesPage from './ResourcesPage';
import PaymentPage from './PaymentPage';
import WhistleblowingPage from './WhistleblowingPage';
import ContactPage from './ContactPage';
interface DashboardPageProps {
onLogout: () => void;
}
const mockDeclarations: Declaration[] = [
{ year: 2023, type: 'Annual', submissionDate: '2024-02-15', status: DeclarationStatus.APPROVED },
{ year: 2022, type: 'Annual', submissionDate: '2023-03-01', status: DeclarationStatus.APPROVED },
{ year: 2021, type: 'Annual', submissionDate: '2022-02-20', status: DeclarationStatus.APPROVED },
{ year: 2020, type: 'New Entrant', submissionDate: '2021-01-10', status: DeclarationStatus.APPROVED },
];
const DashboardContent = ({ setActivePage }: { setActivePage: (page: string) => void }) => (
<>
<h1 className="text-3xl font-bold text-text-main mb-2">Welcome Back, Kinley!</h1>
<p className="text-text-secondary mb-8">Here's a summary of your asset declaration status.</p>
code
Code
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <DashboardCard
    title="Next Declaration Due"
    value="Feb 28, 2025"
    subtitle="Annual Declaration for 2024"
    variant="primary"
  />
  <DashboardCard
    title="Last Submission"
    value="Feb 15, 2024"
    subtitle="Status: Approved"
    variant="success"
  />
  <DashboardCard
    title="Declarations Filed"
    value="4"
    subtitle="Since joining service"
  />
</div>

<div className="mb-8">
  <h2 className="text-xl font-semibold text-text-main mb-4">Compliance Summary</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <DashboardCard
      title="Late Declarations"
      value="1"
      subtitle="1 submission past due"
      variant="warning"
    />
    <DashboardCard
      title="Incomplete Declarations"
      value="0"
      subtitle="All submissions complete"
      variant="success"
    />
    <DashboardCard
      title="False Declarations"
      value="0"
      subtitle="No issues found"
      variant="success"
    />
    <DashboardCard
      title="Non-Declarations"
      value="1"
      subtitle="Action required for 2019"
      variant="danger"
    />
  </div>
</div>

<div className="mb-8">
  <h2 className="text-xl font-semibold text-text-main mb-4">Penalty Summary</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <DashboardCard
      title="Penalties Paid"
      value="Nu. 500"
      subtitle="Paid on Jan 10, 2024"
      variant="success"
    />
    <DashboardCard
      title="Penalties Pending"
      value="Nu. 2,500"
      subtitle="Due in 15 days"
      variant="warning"
    />
  </div>
</div>

<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-semibold text-text-main mb-4">Recent Declarations History</h2>
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Year</th>
          <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Type</th>
          <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Submission Date</th>
          <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Status</th>
          <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Actions</th>
        </tr>
      </thead>
      <tbody>
        {mockDeclarations.slice(0, 3).map(declaration => (
          <DeclarationRow key={declaration.year} declaration={declaration} />
        ))}
      </tbody>
    </table>
    <div className="text-right mt-4">
      <button onClick={() => setActivePage('history')} className="text-sm font-medium text-accent hover:underline">
        View All History &rarr;
      </button>
    </div>
  </div>
</div>
</>
);
const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
const [activePage, setActivePage] = useState('dashboard');
const [profilePicture, setProfilePicture] = useState('https://picsum.photos/100');
const renderContent = () => {
switch(activePage) {
case 'dashboard':
return <DashboardContent setActivePage={setActivePage} />;
case 'filenew':
return <FileNewPage />;
case 'history':
return <HistoryPage declarations={mockDeclarations} />;
case 'profile':
return <ProfilePage profilePicture={profilePicture} setProfilePicture={setProfilePicture} />;
case 'faq':
return <FaqPage />;
case 'resources':
return <ResourcesPage />;
case 'payment':
return <PaymentPage />;
case 'whistleblowing':
return <WhistleblowingPage />;
case 'contact':
return <ContactPage />;
default:
return <DashboardContent setActivePage={setActivePage} />;
}
}
return (
<div className="flex flex-col h-screen bg-secondary">
<Header
onLogout={onLogout}
activePage={activePage}
setActivePage={setActivePage}
profilePicture={profilePicture}
/>
<main className="flex-1 overflow-y-auto p-8">
<div className="container mx-auto">
{renderContent()}
</div>
</main>
</div>
);
};
export default DashboardPage;