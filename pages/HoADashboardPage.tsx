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

const annualReport = {
    title: 'Annual Asset Declaration Report 2023',
    preparedBy: 'Agency Admin (HR Officer)',
    datePrepared: '2024-03-15',
    status: 'Pending HoA Approval',
    summary: 'Compliance rate is 98%. Total fines collected: Nu. 12,500. Two staff members are currently on long-term leave and have not filed.',
    fileSize: '2.4 MB'
};

interface HoADashboardPageProps {
    onLogout: () => void;
}

const HoADashboardPage: React.FC<HoADashboardPageProps> = ({ onLogout }) => {
    const [activePage, setActivePage] = useState('overview');
    const [reportStatus, setReportStatus] = useState(annualReport.status);
    const [isApproveModalOpen, setApproveModalOpen] = useState(false);
    const [hoARemarks, setHoARemarks] = useState('');

    const handleApprove = () => {
        setReportStatus('Approved & Submitted to ACC');
        setApproveModalOpen(false);
        alert("Report successfully verified and submitted to the Anti-Corruption Commission.");
    };

    const handleReject = () => {
        setReportStatus('Returned for Correction');
        setApproveModalOpen(false);
        alert("Report returned to Agency Admin for corrections.");
    };

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
                        
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h3 className="text-lg font-bold text-text-main mb-2">Annual Report Status</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-text-secondary text-sm">Current Status</p>
                                    <p className={`text-xl font-semibold ${reportStatus.includes('Approved') ? 'text-green-600' : 'text-orange-600'}`}>
                                        {reportStatus}
                                    </p>
                                </div>
                                {reportStatus === 'Pending HoA Approval' && (
                                    <button 
                                        onClick={() => setActivePage('approval')}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                    >
                                        Review & Approve
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                );
            
            case 'approval':
                return (
                    <>
                        <h2 className="text-2xl font-bold text-text-main mb-6">Report Verification & Approval</h2>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{annualReport.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Prepared by: {annualReport.preparedBy} | Date: {annualReport.datePrepared}</p>
                                </div>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {reportStatus}
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Executive Summary</h4>
                                    <p className="text-gray-600 bg-gray-50 p-4 rounded border border-gray-200">
                                        {annualReport.summary}
                                    </p>
                                </div>
                                <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <DocumentReportIcon />
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-900">Full_Compliance_Report_2023.pdf</p>
                                        <p className="text-sm text-gray-500">{annualReport.fileSize}</p>
                                    </div>
                                    <button className="ml-auto text-blue-600 hover:underline text-sm font-medium">Preview Document</button>
                                </div>

                                {reportStatus === 'Pending HoA Approval' ? (
                                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200">
                                        <button 
                                            onClick={() => {setHoARemarks(''); setApproveModalOpen(true);}}
                                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 flex items-center justify-center"
                                        >
                                            <CheckIcon className="w-5 h-5 mr-2" />
                                            Verify & Submit to ACC
                                        </button>
                                        <button 
                                            onClick={handleReject}
                                            className="px-6 py-2 bg-white border border-red-300 text-red-600 font-bold rounded-md hover:bg-red-50 flex items-center justify-center"
                                        >
                                            <XIcon className="w-5 h-5 mr-2" />
                                            Return for Correction
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 text-center font-medium">
                                        This report has been processed. No further action required.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Approval Modal */}
                        <Modal
                            isOpen={isApproveModalOpen}
                            onClose={() => setApproveModalOpen(false)}
                            title="Confirm Submission"
                        >
                            <div className="space-y-4">
                                <p className="text-gray-600">
                                    I, as the Head of Agency, hereby verify that the Asset Declaration Report for the year 2023 has been reviewed and is accurate to the best of my knowledge.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks for ACC (Optional)</label>
                                    <textarea 
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                                        rows={3}
                                        value={hoARemarks}
                                        onChange={(e) => setHoARemarks(e.target.value)}
                                        placeholder="Any specific notes regarding this submission..."
                                    ></textarea>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={() => setApproveModalOpen(false)} className="mr-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                    <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold">Confirm & Submit</button>
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
            {/* Fix: Wrap setActivePage to ensure type compatibility */}
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