import React, { useState } from 'react';
import HoAHeader from '../components/HoAHeader';
import DashboardCard from '../components/DashboardCard';
import CheckIcon from '../components/icons/CheckIcon';
import XIcon from '../components/icons/XIcon';
import DocumentReportIcon from '../components/icons/DocumentReportIcon';
import Modal from '../components/Modal';

// Mock Data
const agencyStats = {
    totalStaff: 450,
    filed: 438,
    pending: 2,
    penalized: 10,
    penaltyAmount: 12500
};

const staffList = [
    { id: '101', name: 'Tashi Dorji', designation: 'Chief Officer', status: 'Filed', date: '2024-02-15' },
    { id: '102', name: 'Karma Wangmo', designation: 'Asst. Officer', status: 'Filed', date: '2024-02-20' },
    { id: '103', name: 'Pema Tenzin', designation: 'Engineer', status: 'Pending', date: '-' },
    { id: '104', name: 'Sonam Lhamo', designation: 'Accountant', status: 'Late (Penalty Paid)', date: '2024-03-05' },
];

// Two separate reports now
const complianceReport = {
    type: 'Compliance Report',
    title: 'Annual Compliance Report 2023',
    preparedBy: 'Agency Admin',
    datePrepared: '2024-03-15',
    status: 'Pending HoA Approval',
    summary: 'Compliance rate is 98%. Two staff members are currently on long-term leave and have not filed.',
    fileSize: '2.4 MB'
};

const atrReport = {
    type: 'ATR',
    title: 'Action Taken Report (ATR) 2023',
    preparedBy: 'Agency Admin',
    datePrepared: '2024-03-15',
    status: 'Draft', // Simulating that ATR is not yet submitted to HoA
    summary: 'Total fines collected: Nu. 12,500. Administrative actions taken against 10 late filers.',
    fileSize: '1.1 MB'
};

interface HoADashboardPageProps {
    onLogout: () => void;
}

const HoADashboardPage: React.FC<HoADashboardPageProps> = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('overview');
    
    // State for both reports
    const [compStatus, setCompStatus] = useState(complianceReport.status);
    const [atrStatus, setAtrStatus] = useState(atrReport.status);
    
    // Modal State
    const [isApproveModalOpen, setApproveModalOpen] = useState(false);
    const [activeReportType, setActiveReportType] = useState<'Compliance' | 'ATR' | null>(null);
    const [hoARemarks, setHoARemarks] = useState('');

    const openApproveModal = (type: 'Compliance' | 'ATR') => {
        setActiveReportType(type);
        setHoARemarks('');
        setApproveModalOpen(true);
    };

    const handleApprove = () => {
        if (activeReportType === 'Compliance') {
            setCompStatus('Approved & Submitted to ACC');
        } else if (activeReportType === 'ATR') {
            setAtrStatus('Approved & Submitted to ACC');
        }
        setApproveModalOpen(false);
        alert(`${activeReportType} Report successfully verified and approved.`);
    };

    const handleReject = (type: 'Compliance' | 'ATR') => {
        if (type === 'Compliance') setCompStatus('Returned for Correction');
        else setAtrStatus('Returned for Correction');
        alert(`${type} Report returned to Agency Admin for corrections.`);
    };

    const renderReportCard = (report: any, currentStatus: string, type: 'Compliance' | 'ATR') => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center">
                        <h3 className="text-lg font-bold text-gray-800 mr-3">{report.title}</h3>
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{report.type}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Prepared by: {report.preparedBy} | Date: {report.datePrepared}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    currentStatus.includes('Approved') ? 'bg-green-100 text-green-800 border-green-200' :
                    currentStatus.includes('Pending') ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                    {currentStatus}
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Executive Summary</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                        {report.summary}
                    </p>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer w-fit">
                    <DocumentReportIcon className="w-5 h-5 text-gray-500 mr-3" />
                    <div className="mr-8">
                        <p className="text-sm font-medium text-gray-900">Report_Document.pdf</p>
                        <p className="text-xs text-gray-500">{report.fileSize}</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-xs font-bold uppercase">Preview</button>
                </div>

                {currentStatus === 'Pending HoA Approval' ? (
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                        <button 
                            onClick={() => handleReject(type)}
                            className="px-4 py-2 bg-white border border-red-300 text-red-600 font-medium rounded hover:bg-red-50 flex items-center justify-center text-sm"
                        >
                            <XIcon className="w-4 h-4 mr-2" />
                            Return for Correction
                        </button>
                        <button 
                            onClick={() => openApproveModal(type)}
                            className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 flex items-center justify-center text-sm shadow-sm"
                        >
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Approve & Sign
                        </button>
                    </div>
                ) : (
                    <div className="pt-4 border-t border-gray-100 mt-4">
                        <p className="text-sm text-gray-500 italic">
                            {currentStatus === 'Draft' ? 'Waiting for Agency Admin to submit.' : 'Processing complete.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activePage) {
            case 'overview':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-main mb-6">Executive Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <DashboardCard title="Total Staff" value={agencyStats.totalStaff.toString()} subtitle="Schedule II Declarants" variant="primary" />
                            <DashboardCard title="Declarations Filed" value={agencyStats.filed.toString()} subtitle="97.3% Compliance" variant="success" />
                            <DashboardCard title="Pending / Non-Filed" value={agencyStats.pending.toString()} subtitle="Action Required" variant="danger" />
                            <DashboardCard title="Penalties Levied" value={`Nu. ${agencyStats.penaltyAmount.toLocaleString()}`} subtitle="For Late/Non-Filing" variant="warning" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                                <h3 className="text-lg font-bold text-text-main mb-2">Compliance Report</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Status: <span className="font-semibold text-gray-800">{compStatus}</span></p>
                                    {compStatus === 'Pending HoA Approval' && (
                                        <button onClick={() => setActivePage('approval')} className="text-blue-600 hover:underline text-sm font-medium">Review Now &rarr;</button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                                <h3 className="text-lg font-bold text-text-main mb-2">Action Taken Report (ATR)</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Status: <span className="font-semibold text-gray-800">{atrStatus}</span></p>
                                    {atrStatus === 'Pending HoA Approval' && (
                                        <button onClick={() => setActivePage('approval')} className="text-purple-600 hover:underline text-sm font-medium">Review Now &rarr;</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                );
            
            case 'approval':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-main mb-6">Report Verification & Approval</h2>
                        {renderReportCard(complianceReport, compStatus, 'Compliance')}
                        {renderReportCard(atrReport, atrStatus, 'ATR')}

                        {/* Approval Modal */}
                        <Modal
                            isOpen={isApproveModalOpen}
                            onClose={() => setApproveModalOpen(false)}
                            title={`Approve ${activeReportType}`}
                        >
                            <div className="space-y-4">
                                <p className="text-gray-600 text-sm">
                                    I, as the Head of Agency, hereby verify that the <strong>{activeReportType}</strong> has been reviewed and is accurate to the best of my knowledge. This action will officially submit the report to the Anti-Corruption Commission.
                                </p>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Remarks for ACC (Optional)</label>
                                    <textarea 
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                        rows={3}
                                        value={hoARemarks}
                                        onChange={(e) => setHoARemarks(e.target.value)}
                                        placeholder="Add any specific notes regarding this submission..."
                                    ></textarea>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={() => setApproveModalOpen(false)} className="mr-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">Cancel</button>
                                    <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold text-sm shadow-sm">Confirm & Submit</button>
                                </div>
                            </div>
                        </Modal>
                    </>
                );

            case 'staff':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-main mb-6">Staff Declaration List</h2>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Official Name</th>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Designation</th>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Status</th>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Submission Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {staffList.map((staff) => (
                                            <tr key={staff.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-6 font-medium text-text-main">{staff.name}</td>
                                                <td className="py-4 px-6 text-sm text-text-secondary">{staff.designation}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        staff.status === 'Filed' ? 'bg-green-100 text-green-800' : 
                                                        staff.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {staff.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-text-secondary">{staff.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <HoAHeader activePage={activePage} setActivePage={(page) => setActivePage(page)} onLogout={onLogout} />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="container mx-auto max-w-7xl">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default HoADashboardPage;