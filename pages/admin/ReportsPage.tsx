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

// Initial state for Agency Admin's report
const initialMyReport = { 
    title: 'Ministry of Finance Annual Report 2023', 
    type: 'Draft', 
    size: '1.2 MB', 
    date: '2024-03-10', 
    status: 'Draft', // Statuses: Draft, Pending HoA Approval, Returned for Correction, Approved by HoA, Submitted to ACC
    hoaRemarks: ''
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
    const [activeTab, setActiveTab] = useState<'system' | 'agency'>('system');
    const [generatedReports, setGeneratedReports] = useState([
        { id: 101, title: 'DA High Risk List - Q4 2023', type: 'PDF', date: '2024-02-15', size: '1.2 MB', author: 'System' },
        { id: 102, title: 'Penalty Collection Summary - Jan 2024', type: 'Excel', date: '2024-02-01', size: '0.5 MB', author: 'System' },
    ]);
    
    // Agency Admin State
    const [myReport, setMyReport] = useState(initialMyReport);

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

    // Agency Admin Actions
    const submitToHoA = () => {
        setMyReport({ ...myReport, status: 'Pending HoA Approval' });
        alert("Report submitted to Head of Agency for review.");
    };

    const submitToACC = () => {
        setMyReport({ ...myReport, status: 'Submitted to ACC' });
        alert("Final Report submitted to the Anti-Corruption Commission.");
    };

    const editReport = () => {
        // Simulate editing
        alert("Opening report editor... (Corrections made)");
        setMyReport({ ...myReport, status: 'Draft', hoaRemarks: '' }); // Reset to draft after editing
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-text-main mb-4 md:mb-0">
                    {userRole === 'admin' ? 'Reports & Statistics' : 'Agency Report Submission'}
                </h1>
                
                {/* Tabs for ACC Admin */}
                {userRole === 'admin' && (
                    <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('system')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'system' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            System Reports
                        </button>
                        <button 
                            onClick={() => setActiveTab('agency')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'agency' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Agency Submissions
                        </button>
                    </div>
                )}

                {/* Actions for Agency Admin - Dynamic based on Status */}
                {userRole === 'agency_admin' && (
                    <div className="flex space-x-2">
                        {(myReport.status === 'Draft' || myReport.status === 'Returned for Correction') && (
                             <button 
                                onClick={submitToHoA}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark font-medium shadow-sm"
                             >
                                Submit to HoA for Review
                            </button>
                        )}
                        
                        {myReport.status === 'Approved by HoA' && (
                            <button 
                                onClick={submitToACC}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium shadow-sm"
                            >
                                Final Submit to ACC
                            </button>
                        )}

                        {myReport.status === 'Pending HoA Approval' && (
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded border border-yellow-200 font-medium text-sm">
                                Awaiting HoA Approval...
                            </span>
                        )}
                         {myReport.status === 'Submitted to ACC' && (
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded border border-green-200 font-medium text-sm">
                                Submission Complete
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* SYSTEM REPORTS TAB (ACC Admin Only) */}
            {userRole === 'admin' && activeTab === 'system' && (
                <div className="space-y-8">
                    {/* Generator Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reportTemplates.map((template) => (
                            <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-lg ${template.bg}`}>
                                        {template.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 mb-4">{template.description}</p>
                                        <button 
                                            onClick={() => handleGenerate(template.title)}
                                            className="text-sm font-medium text-primary border border-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition"
                                        >
                                            Generate Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recently Generated List */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-800">Recently Generated Reports</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Report Name</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Type</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Date Created</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Size</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {generatedReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 flex items-center">
                                            <div className="bg-gray-100 p-2 rounded mr-3 text-gray-600">
                                                <DocumentIcon className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-text-main">{report.title}</span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-text-secondary">{report.type}</td>
                                        <td className="py-4 px-6 text-sm text-text-secondary">{report.date}</td>
                                        <td className="py-4 px-6 text-sm text-text-secondary">{report.size}</td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-primary hover:text-primary-dark text-sm font-medium hover:underline">
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* AGENCY SUBMISSIONS TAB (Or Agency Admin View) */}
            {(userRole === 'agency_admin' || (userRole === 'admin' && activeTab === 'agency')) && (
                <>
                     {userRole === 'agency_admin' && (
                        <div className={`border-l-4 p-4 mb-6 ${
                            myReport.status === 'Returned for Correction' ? 'bg-red-50 border-red-500' :
                            myReport.status === 'Approved by HoA' ? 'bg-green-50 border-green-500' :
                            'bg-blue-50 border-blue-400'
                        }`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationCircleIcon className={`h-5 w-5 ${
                                        myReport.status === 'Returned for Correction' ? 'text-red-500' : 'text-blue-400'
                                    }`} />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">
                                        Current Status: <span className="font-bold">{myReport.status}</span>
                                    </p>
                                    {myReport.status === 'Returned for Correction' && (
                                        <div className="mt-2 text-sm text-red-700">
                                            <strong>HoA Remarks:</strong> "{myReport.hoaRemarks || 'Please review the pending list again.'}"
                                            <div className="mt-2">
                                                <button 
                                                    onClick={editReport}
                                                    className="text-red-800 font-bold hover:underline"
                                                >
                                                    Edit & Fix Report
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {myReport.status === 'Approved by HoA' && (
                                        <p className="text-sm text-green-700 mt-1">
                                            The report has been verified. You may now submit it to the ACC.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-800">
                                {userRole === 'admin' ? 'Received Agency Compliance Reports' : 'My Agency Reports'}
                            </h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Report Name</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Status</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Date</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Size</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(userRole === 'admin' ? agencyReports : [myReport]).map((report, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 flex items-center">
                                            <div className="bg-blue-100 p-2 rounded mr-3 text-primary">
                                                <DocumentIcon className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-text-main">{report.title}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 text-xs font-bold rounded border ${
                                                report.status.includes('Approved') || report.status === 'Submitted' ? 'bg-green-100 text-green-800 border-green-200' : 
                                                report.status.includes('Correction') ? 'bg-red-100 text-red-800 border-red-200' :
                                                'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-text-secondary">{report.date}</td>
                                        <td className="py-4 px-6 text-sm text-text-secondary">{report.size}</td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="text-primary hover:text-primary-dark text-sm font-medium hover:underline">
                                                {userRole === 'admin' ? 'Download' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReportsPage;