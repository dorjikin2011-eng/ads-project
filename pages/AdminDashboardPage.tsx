import React, { useState, useMemo } from 'react';
import AdminHeader from '../components/AdminHeader';
import DashboardCard from '../components/DashboardCard';
import AdminVerificationPage from './admin/VerificationPage';
import AdminAnalyticsPage from './admin/AnalyticsPage';
import AdminReportsPage from './admin/ReportsPage';
import DACasesPage from './admin/DACasesPage';
import UserManagementPage from './admin/UserManagementPage';
import PaymentConsolePage from './admin/PaymentConsolePage';
import InfoSharingPage from './admin/InfoSharingPage';
import ApiManagementPage from './admin/ApiManagementPage';
import AuditLogPage from './admin/AuditLogPage';
import FileNewPage from './FileNewPage';
import { Declaration, DeclarationStatus, UserRole } from '../types';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import SearchIcon from '../components/icons/SearchIcon';
import XIcon from '../components/icons/XIcon';

interface AdminDashboardPageProps {
  onLogout: () => void;
  userRole: UserRole;
  onSwitchView?: () => void; // New Prop
}

// ... (KEEP MOCK DATA & OVERVIEW CONTENT AS IS - OMITTING FOR BREVITY) ...
// If you need the full file again I can provide it, but assuming you just need the props update.

// I will provide the FULL file to avoid confusion, assuming the mock data logic from previous steps is still valid.
// Just pasting the full content for safety.

const allSubmissions: Declaration[] = [
  { id: 'DEC-2024-001', officialName: 'H.E. Lyonpo Dorji', officialId: '11223344', year: 2023, type: 'Annual', submissionDate: '2024-02-20', status: DeclarationStatus.PENDING, riskScore: 'Low', schedule: 'Schedule I', agency: 'Cabinet' },
  { id: 'DEC-2024-002', officialName: 'Dasho Pema', officialId: '99887766', year: 2023, type: 'Annual', submissionDate: '2024-02-19', status: DeclarationStatus.FLAGGED, riskScore: 'High', schedule: 'Schedule I', agency: 'Ministry of Finance' },
  { id: 'DEC-2024-005', officialName: 'Dasho Karma', officialId: '77665544', year: 2023, type: 'Annual', submissionDate: '2024-02-21', status: DeclarationStatus.APPROVED, riskScore: 'Low', schedule: 'Schedule I', agency: 'Ministry of Health' },
  { id: 'DEC-2024-006', officialName: 'Dasho Wangchuk', officialId: '33445566', year: 2023, type: 'Annual', submissionDate: '2024-02-22', status: DeclarationStatus.PENDING, riskScore: 'Medium', schedule: 'Schedule I', agency: 'Ministry of Education' },
  { id: 'DEC-2024-003', officialName: 'Mr. Tashi Wangmo', officialId: '55667788', year: 2023, type: 'Annual', submissionDate: '2024-02-18', status: DeclarationStatus.APPROVED, riskScore: 'Low', schedule: 'Schedule II', agency: 'Ministry of Finance' },
  { id: 'DEC-2024-004', officialName: 'Mrs. Ugyen Tenzin', officialId: '44332211', year: 2023, type: 'Annual', submissionDate: '2024-02-15', status: DeclarationStatus.PENDING, riskScore: 'Medium', schedule: 'Schedule II', agency: 'Ministry of Finance' },
];

const RiskBadge = ({ level }: { level: string }) => {
    const colors = { Low: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', High: 'bg-red-100 text-red-800' };
    return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[level as keyof typeof colors]}`}>{level} Risk</span>;
};

const OverviewContent = ({ onViewDetails, userRole }: { onViewDetails: (id: string) => void, userRole: UserRole }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAgency, setSelectedAgency] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [scheduleFilter, setScheduleFilter] = useState<'All' | 'Schedule I' | 'Schedule II'>('All');

    const filteredSubmissions = useMemo(() => {
        return allSubmissions.filter(item => {
            let isRoleAllowed = false;
            if (userRole === 'admin') {
                if (scheduleFilter === 'All') isRoleAllowed = true; else isRoleAllowed = item.schedule === scheduleFilter;
            } else if (userRole === 'agency_admin') {
                isRoleAllowed = item.schedule === 'Schedule II' && item.agency === 'Ministry of Finance';
            }
            if (!isRoleAllowed) return false;
            const searchLower = searchQuery.toLowerCase().trim();
            const nameMatch = (item.officialName || '').toLowerCase().includes(searchLower);
            const idMatch = (item.officialId || '').toLowerCase().includes(searchLower);
            const matchesSearch = !searchLower || nameMatch || idMatch;
            const matchesAgency = userRole === 'agency_admin' || selectedAgency === 'All' || item.agency === selectedAgency;
            const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
            return matchesSearch && matchesAgency && matchesStatus;
        });
    }, [userRole, searchQuery, selectedAgency, selectedStatus, scheduleFilter]);

    const availableAgencies = useMemo(() => { const agencies = new Set(allSubmissions.filter(s => userRole === 'admin' || s.schedule === 'Schedule II').map(s => s.agency)); return ['All', ...Array.from(agencies)]; }, [userRole]);
    const availableStatuses = ['All', ...Object.values(DeclarationStatus)];
    const roleTitle = userRole === 'admin' ? 'CADA Oversight Dashboard' : 'ADA Dashboard';

    return (
    <>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-text-main">{roleTitle}</h1>
            {userRole === 'admin' && ( <div className="bg-white border border-gray-300 rounded-md p-1 flex shadow-sm"> {['All', 'Schedule I', 'Schedule II'].map((sch) => ( <button key={sch} onClick={() => setScheduleFilter(sch as any)} className={`px-4 py-1.5 text-sm font-medium rounded ${scheduleFilter === sch ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>{sch}</button> ))} </div> )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> <DashboardCard title="Pending Verifications" value={filteredSubmissions.filter(i => i.status === DeclarationStatus.PENDING).length.toString()} subtitle="In current view" variant="warning" /> <DashboardCard title="Flagged for Review" value={filteredSubmissions.filter(i => i.status === DeclarationStatus.FLAGGED).length.toString()} subtitle="Requires attention" variant="danger" /> <DashboardCard title="Reports Submitted" value={userRole === 'admin' ? "8/10" : "0"} subtitle={userRole === 'admin' ? "Agencies Filed" : "Annual Report Status"} variant="success" /> <DashboardCard title="Total Declarations" value={filteredSubmissions.length.toString()} subtitle="In current view" variant="primary" /> </div>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"> <div className="relative flex-1 max-w-lg"> <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="text-gray-400" /></div> <input type="text" placeholder="Search by Official Name or ID..." className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> {searchQuery && ( <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"> <XIcon className="w-4 h-4" /> </button> )} </div> <div className="flex flex-col sm:flex-row gap-4"> <div className="flex items-center space-x-2"> <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label> <div className="relative"> <select id="status-filter" className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}> {availableStatuses.map(status => <option key={status} value={status}>{status}</option>)} </select> <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDownIcon className="w-4 h-4 text-gray-500" /></div> </div> </div> {userRole === 'admin' && ( <div className="flex items-center space-x-2"> <label htmlFor="agency-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Agency:</label> <div className="relative"> <select id="agency-filter" className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white" value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)}> {availableAgencies.map(agency => <option key={agency} value={agency}>{agency}</option>)} </select> <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDownIcon className="w-4 h-4 text-gray-500" /></div> </div> </div> )} </div> </div>
        <div className="bg-white rounded-lg shadow-md p-6"> <div className="flex justify-between items-center mb-6"> <h2 className="text-xl font-semibold text-text-main"> {userRole === 'admin' ? 'Schedule I Declarations' : 'Schedule II Declarations'} <span className="text-sm font-normal text-text-secondary ml-2"> ({filteredSubmissions.length} records found) </span> </h2> </div> <div className="overflow-x-auto"> <table className="w-full text-left"> <thead> <tr className="bg-gray-50 border-b border-gray-200"> <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Official Name</th> <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Category</th> <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Submitted</th> <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Risk Score</th> <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Status</th> <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Action</th> </tr> </thead> <tbody> {filteredSubmissions.length > 0 ? ( filteredSubmissions.map((item) => ( <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50"> <td className="py-3 px-4"> <div className="font-medium text-text-main">{item.officialName}</div> <div className="text-xs text-text-secondary">ID: {item.officialId}</div> </td> <td className="py-3 px-4 text-sm text-text-secondary">{item.schedule} ({item.agency})</td> <td className="py-3 px-4 text-sm text-text-secondary">{item.submissionDate}</td> <td className="py-3 px-4"><RiskBadge level={item.riskScore || 'Low'} /></td> <td className="py-3 px-4"> <span className={`inline-block w-2 h-2 rounded-full mr-2 ${item.status === DeclarationStatus.APPROVED ? 'bg-green-500' : item.status === DeclarationStatus.FLAGGED ? 'bg-red-500' : 'bg-yellow-500'}`}></span> <span className="text-sm text-text-secondary">{item.status}</span> </td> <td className="py-3 px-4"> <button onClick={() => onViewDetails(item.officialId || '')} className="text-accent hover:underline font-medium text-sm"> View Details </button> </td> </tr> )) ) : ( <tr> <td colSpan={6} className="py-8 text-center text-gray-500 bg-gray-50"> <p className="font-medium">No declarations found.</p> <p className="text-sm mt-1">Try adjusting your search or filters.</p> </td> </tr> )} </tbody> </table> </div> </div>
    </>
    );
};

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, userRole, onSwitchView }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [filingTarget, setFilingTarget] = useState<{name: string, id: string} | null>(null);

  const handleViewDetails = (id: string) => { setSelectedSubmissionId(id); setActivePage('verification'); };
  const handleFileOnBehalf = (name: string, id: string) => { setFilingTarget({ name, id }); setActivePage('file-on-behalf'); };

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': return <OverviewContent onViewDetails={handleViewDetails} userRole={userRole} />;
      case 'users': return <UserManagementPage userRole={userRole} onFileOnBehalf={handleFileOnBehalf} />;
      case 'verification': return <AdminVerificationPage userRole={userRole} preSelectedId={selectedSubmissionId} />;
      case 'da-cases': return <DACasesPage />;
      case 'payments': return <PaymentConsolePage userRole={userRole} />;
      case 'info-sharing': return <InfoSharingPage />;
      case 'api-mgmt': return <ApiManagementPage />;
      case 'analytics': return <AdminAnalyticsPage />;
      case 'reports': return <AdminReportsPage userRole={userRole} />;
      case 'audit': return <AuditLogPage userRole={userRole} />;
      case 'file-on-behalf': return <FileNewPage isProcessingForAdmin={true} targetOfficialName={filingTarget?.name} targetOfficialId={filingTarget?.id} />;
      default: return <OverviewContent onViewDetails={handleViewDetails} userRole={userRole} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Pass Switch Prop to Header */}
      <AdminHeader activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} userRole={userRole} onSwitchView={onSwitchView} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="container mx-auto max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;