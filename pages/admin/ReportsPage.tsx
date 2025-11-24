import React, { useState } from 'react';
import DocumentIcon from '../../components/icons/DocumentIcon';
import ExclamationCircleIcon from '../../components/icons/ExclamationCircleIcon';
import ScaleIcon from '../../components/icons/ScaleIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import ClipboardCheckIcon from '../../components/icons/ClipboardCheckIcon';
import { UserRole } from '../../types';

// --- Mock Data ---

const agencyReports = [
    { title: 'MoF Annual Compliance Report 2023', type: 'PDF', size: '2.4 MB', date: '2024-03-01', status: 'Submitted' },
    { title: 'MoE Annual Compliance Report 2023', type: 'PDF', size: '3.1 MB', date: '2024-03-02', status: 'Submitted' },
    { title: 'MoH Annual Compliance Report 2023', type: 'PDF', size: '2.2 MB', date: '2024-03-02', status: 'Submitted' },
];

// Initial state for Agency Admin's reports
const initialReports = {
    compliance: {
        title: 'Annual Compliance Report 2023',
        status: 'Draft', // Draft, Pending HoA, Approved, Submitted to ACC
        hoaRemarks: ''
    },
    atr: {
        title: 'Action Taken Report (ATR) 2023',
        status: 'Draft',
        hoaRemarks: ''
    }
};

// Templates for ACC Admin to generate
const reportTemplates = [
    {
        id: 'non-compliance',
        title: 'Non-Compliance Analysis',
        description: 'Breakdown of Late Filing, Non-Filing, and False Declarations by Agency and Position.',
        icon: <ExclamationCircleIcon className="w-6 h-6 text-red-600" />,
        bg: 'bg-red-50'
    },
    {
        id: 'da-list',
        title: 'Disproportionate Assets (DA) List',
        description: 'Register of officials flagged for asset growth exceeding income sources (Schedule I & II).',
        icon: <ScaleIcon />,
        bg: 'bg-blue-50'
    },
    {
        id: 'penalty',
        title: 'Penalty Imposition Register',
        description: 'Log of all administrative penalties imposed, fines collected, and outstanding dues.',
        icon: <CreditCardIcon />,
        bg: 'bg-yellow-50'
    },
    {
        id: 'pending',
        title: 'Pending Verification Backlog',
        description: 'List of declarations pending review for more than 30 days, grouped by risk score.',
        icon: <ClipboardCheckIcon />,
        bg: 'bg-purple-50'
    }
];

interface AdminReportsPageProps {
    userRole: UserRole;
}

const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ userRole }) => {
    // Initialize activeTab based on role to avoid runtime errors
    const [activeTab, setActiveTab] = useState<'system' | 'compliance' | 'atr'>(
        userRole === 'agency_admin' ? 'compliance' : 'system'
    );

    const [generatedReports, setGeneratedReports] = useState([
        { id: 101, title: 'DA High Risk List - Q4 2023', type: 'PDF', date: '2024-02-15', size: '1.2 MB', author: 'System' },
        { id: 102, title: 'Penalty Collection Summary - Jan 2024', type: 'Excel', date: '2024-02-01', size: '0.5 MB', author: 'System' },
    ]);
    
    // Agency Admin State
    const [reports, setReports] = useState(initialReports);

    const handleGenerate = (templateTitle: string) => {
        const newReport = {
            id: Date.now(),
            title: `${templateTitle} - Generated ${new Date().toLocaleDateString()}`,
            type: 'PDF',
            date: new Date().toISOString().split('T')[0],
            size: 'Calculating...',
            author: 'You'
        };
        setGeneratedReports([newReport, ...generatedReports]);
    };

    // Generic handler for submitting reports
    const handleReportAction = (type: 'compliance' | 'atr', action: 'submit_hoa' | 'submit_acc') => {
        setReports(prev => {
            const currentStatus = prev[type].status;
            let newStatus = currentStatus;

            if (action === 'submit_hoa') newStatus = 'Pending HoA Approval';
            if (action === 'submit_acc') newStatus = 'Submitted to ACC';

            return {
                ...prev,
                [type]: { ...prev[type], status: newStatus }
            };
        });
        alert(`Report status updated successfully.`);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-text-main mb-4 md:mb-0">
                    {userRole === 'admin' ? 'Reports & Statistics' : 'Agency Reporting Console'}
                </h1>
                
                {/* Tabs Logic */}
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                    {userRole === 'admin' ? (
                        <>
                            <button onClick={() => setActiveTab('system')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'system' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}>System Reports</button>
                            <button onClick={() => setActiveTab('compliance')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'compliance' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}>Agency Submissions</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setActiveTab('compliance')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'compliance' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}>Compliance Report</button>
                            <button onClick={() => setActiveTab('atr')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'atr' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}>Action Taken Report</button>
                        </>
                    )}
                </div>
            </div>

            {/* SYSTEM REPORTS TAB (ACC Admin Only) */}
            {userRole === 'admin' && activeTab === 'system' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reportTemplates.map((template) => (
                            <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-lg ${template.bg}`}>{template.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 mb-4">{template.description}</p>
                                        <button onClick={() => handleGenerate(template.title)} className="text-sm font-medium text-primary border border-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition">Generate Report</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h2 className="font-semibold text-gray-800">Recently Generated Reports</h2></div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr><th className="py-3 px-6 text-sm text-text-secondary">Report Name</th><th className="py-3 px-6 text-sm text-text-secondary">Date</th><th className="py-3 px-6 text-sm text-text-secondary text-right">Action</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {generatedReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 font-medium">{report.title}</td>
                                        <td className="py-4 px-6 text-sm">{report.date}</td>
                                        <td className="py-4 px-6 text-right"><button className="text-primary hover:underline">Download</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* AGENCY REPORT TABS */}
            {(userRole === 'agency_admin' || (userRole === 'admin' && activeTab === 'compliance')) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {userRole === 'agency_admin' ? (activeTab === 'compliance' ? 'Annual Compliance Report' : 'Action Taken Report (ATR)') : 'Received Agency Reports'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {activeTab === 'compliance' 
                                    ? "Summary of filing status (Filed, Late, Non-Filed) for all covered persons." 
                                    : "Details of administrative actions, penalties imposed, and fines collected."}
                            </p>
                        </div>
                        {userRole === 'agency_admin' && (
                            <div className="text-right">
                                <span className="block text-xs text-gray-500 uppercase">Current Status</span>
                                <span className={`font-bold ${reports[activeTab as 'compliance' | 'atr'].status.includes('Approved') ? 'text-green-600' : 'text-orange-600'}`}>
                                    {reports[activeTab as 'compliance' | 'atr'].status}
                                </span>
                            </div>
                        )}
                    </div>

                    {userRole === 'agency_admin' ? (
                        <div className="border-t pt-6">
                            {/* Status & Action Bar */}
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-700">Report Actions</p>
                                    <p className="text-xs text-gray-500">Manage workflow submission</p>
                                </div>
                                <div className="space-x-3">
                                    <button className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Preview PDF</button>
                                    
                                    {(reports[activeTab as 'compliance' | 'atr'].status === 'Draft' || reports[activeTab as 'compliance' | 'atr'].status.includes('Correction')) && (
                                        <button 
                                            onClick={() => handleReportAction(activeTab as 'compliance' | 'atr', 'submit_hoa')}
                                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark font-medium shadow-sm"
                                        >
                                            Submit to HoA
                                        </button>
                                    )}

                                    {reports[activeTab as 'compliance' | 'atr'].status === 'Approved by HoA' && (
                                        <button 
                                            onClick={() => handleReportAction(activeTab as 'compliance' | 'atr', 'submit_acc')}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium shadow-sm"
                                        >
                                            Submit to ACC
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {reports[activeTab as 'compliance' | 'atr'].status === 'Returned for Correction' && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                    <strong>Correction Required:</strong> "{reports[activeTab as 'compliance' | 'atr'].hoaRemarks || 'Please verify penalty calculations.'}"
                                </div>
                            )}
                        </div>
                    ) : (
                        // Admin View of Agency Reports
                        <table className="w-full text-left mt-4">
                            <thead className="bg-gray-100"><tr><th className="p-3 text-sm">Agency</th><th className="p-3 text-sm">Report Type</th><th className="p-3 text-sm">Status</th><th className="p-3 text-sm text-right">Action</th></tr></thead>
                            <tbody>
                                {agencyReports.map((r, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="p-3">{r.title.split(' ')[0]}</td>
                                        <td className="p-3">{r.title}</td>
                                        <td className="p-3"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Submitted</span></td>
                                        <td className="p-3 text-right"><button className="text-blue-600 hover:underline text-sm">View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;