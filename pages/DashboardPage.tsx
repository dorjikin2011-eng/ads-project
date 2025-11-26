import React, { useState } from 'react';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import DeclarationRow from '../components/DeclarationRow';
import { Declaration, DeclarationStatus, UserRole } from '../types';
import FileNewPage from './FileNewPage';
import ProfilePage from './ProfilePage';
import HistoryPage from './HistoryPage';
import FaqPage from './FaqPage';
import ResourcesPage from './ResourcesPage';
import PaymentPage from './PaymentPage';
import WhistleblowingPage from './WhistleblowingPage';
import ContactPage from './ContactPage';
import DocumentIcon from '../components/icons/DocumentIcon';
import Modal from '../components/Modal';

interface DashboardPageProps {
  onLogout: () => void;
  userRole?: UserRole; // New Prop
  onSwitchView?: () => void; // New Prop
}

const mockDeclarations: Declaration[] = [
  { id: 'DEC-001', year: 2023, type: 'Vacation of Office', submissionDate: '2024-03-15', status: DeclarationStatus.APPROVED },
  { id: 'DEC-002', year: 2022, type: 'Annual', submissionDate: '2023-03-01', status: DeclarationStatus.APPROVED },
  { id: 'DEC-003', year: 2021, type: 'Annual', submissionDate: '2022-02-20', status: DeclarationStatus.APPROVED },
  { id: 'DEC-004', year: 2020, type: 'New Entrant', submissionDate: '2021-01-10', status: DeclarationStatus.APPROVED },
];

const DashboardContent = ({ setActivePage }: { setActivePage: (page: string) => void }) => {
    const isCleared = mockDeclarations[0].type === 'Vacation of Office' && mockDeclarations[0].status === DeclarationStatus.APPROVED;
    
    const [isAmendmentModalOpen, setAmendmentModalOpen] = useState(false);
    const [amendmentReason, setAmendmentReason] = useState('');
    const [targetDeclaration, setTargetDeclaration] = useState<Declaration | null>(null);

    const handleRequestAmendment = (decl: Declaration) => {
        setTargetDeclaration(decl);
        setAmendmentReason('');
        setAmendmentModalOpen(true);
    };

    const submitAmendmentRequest = () => {
        alert(`Amendment Requested for ${targetDeclaration?.year} Declaration.\nReason: ${amendmentReason}\n\nStatus updated to 'Pending Amendment Approval'.`);
        setAmendmentModalOpen(false);
    };

    return (
      <>
        {/* Amendment Modal */}
        <Modal
            isOpen={isAmendmentModalOpen}
            onClose={() => setAmendmentModalOpen(false)}
            title="Request Amendment"
        >
            <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
                    <strong>Note:</strong> Approved declarations are locked. Requesting an amendment requires administrative approval. 
                    Once approved, you will be able to edit your submission.
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Amendment</label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                        rows={4}
                        placeholder="e.g., Forgot to declare fixed deposit account..."
                        value={amendmentReason}
                        onChange={(e) => setAmendmentReason(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setAmendmentModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">Cancel</button>
                    <button 
                        onClick={submitAmendmentRequest} 
                        disabled={!amendmentReason}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark font-bold text-sm disabled:opacity-50"
                    >
                        Submit Request
                    </button>
                </div>
            </div>
        </Modal>

        <h1 className="text-3xl font-bold text-text-main mb-2">Welcome Back, Kinley!</h1>
        <p className="text-text-secondary mb-8">Here's a summary of your asset declaration status.</p>

        {/* Certificate Banner */}
        {isCleared && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <DocumentIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-green-900">Asset Declaration Clearance Certificate Available</h3>
                        <p className="text-green-700 text-sm">Your vacation of office declaration has been verified. You can now download your certificate.</p>
                    </div>
                </div>
                <button className="px-6 py-3 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 transition">
                    Download Certificate
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Next Declaration Due"
            value={isCleared ? "None" : "Feb 28, 2025"}
            subtitle={isCleared ? "Office Vacated" : "Annual Declaration for 2024"}
            variant="primary"
          />
          <DashboardCard
            title="Last Submission"
            value={mockDeclarations[0].submissionDate}
            subtitle={mockDeclarations[0].type}
            variant="success"
          />
          <DashboardCard
            title="Declarations Filed"
            value={mockDeclarations.length.toString()}
            subtitle="Since joining service"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-main mb-4">Compliance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Late Declarations" value="0" subtitle="0 submission past due" variant="success" />
            <DashboardCard title="Incomplete Declarations" value="0" subtitle="All submissions complete" variant="success" />
            <DashboardCard title="False Declarations" value="0" subtitle="No issues found" variant="success" />
            <DashboardCard title="Non-Declarations" value="0" subtitle="No action required" variant="success" />
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
                  <tr key={declaration.year} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4 text-text-main">{declaration.year}</td>
                      <td className="py-4 px-4 text-text-main">{declaration.type}</td>
                      <td className="py-4 px-4 text-text-secondary">{declaration.submissionDate}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${
                            declaration.status === DeclarationStatus.APPROVED ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>{declaration.status}</span>
                      </td>
                      <td className="py-4 px-4 flex space-x-3">
                        <button className="text-blue-600 hover:underline font-medium text-sm">View</button>
                        {declaration.status === DeclarationStatus.APPROVED && (
                            <button 
                                onClick={() => handleRequestAmendment(declaration)}
                                className="text-orange-600 hover:underline font-medium text-sm"
                            >
                                Request Amendment
                            </button>
                        )}
                      </td>
                  </tr>
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
};

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, userRole, onSwitchView }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [profilePicture, setProfilePicture] = useState('https://picsum.photos/100');

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': return <DashboardContent setActivePage={setActivePage} />;
      case 'filenew': return <FileNewPage />;
      case 'history': return <HistoryPage declarations={mockDeclarations} />;
      case 'profile': return <ProfilePage profilePicture={profilePicture} setProfilePicture={setProfilePicture} />;
      case 'faq': return <FaqPage />;
      case 'resources': return <ResourcesPage />;
      case 'payment': return <PaymentPage />;
      case 'whistleblowing': return <WhistleblowingPage />;
      case 'contact': return <ContactPage />;
      default: return <DashboardContent setActivePage={setActivePage} />;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-secondary">
      {/* Pass Switch Prop to Header */}
      <Header 
        onLogout={onLogout} 
        activePage={activePage} 
        setActivePage={setActivePage} 
        profilePicture={profilePicture}
        userRole={userRole}
        onSwitchView={onSwitchView}
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