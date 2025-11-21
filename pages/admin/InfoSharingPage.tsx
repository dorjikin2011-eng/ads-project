import React, { useState } from 'react';
import DashboardCard from '../../components/DashboardCard';
import CheckIcon from '../../components/icons/CheckIcon';
import XIcon from '../../components/icons/XIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import ShareIcon from '../../components/icons/ShareIcon';
import Modal from '../../components/Modal';

// --- Types & Mock Data ---

interface AccessRequest {
    id: string;
    department: string;
    requestorName: string;
    targetOfficial: string;
    targetId: string;
    caseReference: string;
    reason: string;
    requestDate: string;
    status: 'Pending' | 'Approved' | 'Denied' | 'Expired';
    accessLevel: 'Read-Only' | 'Full Export';
}

interface OutboundForward {
    id: string;
    targetDept: string;
    title: string;
    dateSent: string;
    count: number;
    reason: string;
    status: 'Sent' | 'Acknowledged' | 'Actioned';
}

const initialRequests: AccessRequest[] = [
    { id: 'REQ-24-101', department: 'Investigation Division', requestorName: 'Sr. Investigator Tashi', targetOfficial: 'Dasho Pema', targetId: '99887766', caseReference: 'CASE-2024-88', reason: 'Verification of assets against bank statements for active investigation.', requestDate: '2024-03-10', status: 'Pending', accessLevel: 'Full Export' },
    { id: 'REQ-24-102', department: 'Intelligence Unit', requestorName: 'Analyst Karma', targetOfficial: 'H.E. Lyonpo Dorji', targetId: '11223344', caseReference: 'INT-2024-12', reason: 'Routine asset profiling and background check.', requestDate: '2024-03-09', status: 'Pending', accessLevel: 'Read-Only' },
    { id: 'REQ-24-098', department: 'Asset Recovery', requestorName: 'Officer Ugyen', targetOfficial: 'Mr. Tashi Wangmo', targetId: '55667788', caseReference: 'AR-2023-55', reason: 'Identifying seizing properties.', requestDate: '2024-03-01', status: 'Approved', accessLevel: 'Full Export' },
    { id: 'REQ-24-095', department: 'Legal Division', requestorName: 'Counsel Sonam', targetOfficial: 'Mrs. Ugyen Tenzin', targetId: '44332211', caseReference: 'LEG-2024-01', reason: 'Court submission preparation.', requestDate: '2024-02-28', status: 'Denied', accessLevel: 'Read-Only' },
];

const initialOutbound: OutboundForward[] = [
    { id: 'FWD-24-005', targetDept: 'Legal Division', title: 'Defaulters List - Feb 2024', dateSent: '2024-03-01', count: 12, reason: 'Action for Non-Filing Penalty Recovery', status: 'Actioned' },
    { id: 'FWD-24-006', targetDept: 'RCSC', title: 'Late Filing Officials', dateSent: '2024-03-05', count: 3, reason: 'For administrative record and action', status: 'Sent' },
];

const InfoSharingPage = () => {
    const [activeTab, setActiveTab] = useState<'Incoming' | 'Outbound'>('Incoming');
    
    // Incoming State
    const [requests, setRequests] = useState<AccessRequest[]>(initialRequests);
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Processed'>('All');
    const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [actionComment, setActionComment] = useState('');

    // Outbound State
    const [outboundLogs, setOutboundLogs] = useState<OutboundForward[]>(initialOutbound);

    // Stats
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const approvedCount = requests.filter(r => r.status === 'Approved').length;
    const outboundCount = outboundLogs.length;

    // Filter Logic
    const filteredRequests = requests.filter(req => {
        if (filter === 'Pending') return req.status === 'Pending';
        if (filter === 'Processed') return req.status !== 'Pending';
        return true;
    });

    // Handlers
    const handleActionClick = (req: AccessRequest) => {
        setSelectedRequest(req);
        setActionComment('');
        setActionModalOpen(true);
    };

    const processRequest = (status: 'Approved' | 'Denied') => {
        if (!selectedRequest) return;
        
        const updatedRequests = requests.map(req => 
            req.id === selectedRequest.id 
                ? { ...req, status: status } 
                : req
        );
        setRequests(updatedRequests);
        setActionModalOpen(false);
    };

    return (
        <div>
            {/* Action Modal */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={() => setActionModalOpen(false)}
                title={`Process Request: ${selectedRequest?.id}`}
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                        <p><strong>Requestor:</strong> {selectedRequest?.department} ({selectedRequest?.requestorName})</p>
                        <p><strong>Target:</strong> {selectedRequest?.targetOfficial} (ID: {selectedRequest?.targetId})</p>
                        <p><strong>Reason:</strong> {selectedRequest?.reason}</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Remarks (Optional)</label>
                        <textarea 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                            rows={3}
                            placeholder="Enter justification for approval or denial..."
                            value={actionComment}
                            onChange={(e) => setActionComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            onClick={() => processRequest('Denied')}
                            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-medium flex items-center"
                        >
                            <XIcon className="w-4 h-4 mr-2" /> Deny Access
                        </button>
                        <button 
                            onClick={() => processRequest('Approved')}
                            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md font-medium flex items-center"
                        >
                            <CheckIcon className="w-4 h-4 mr-2" /> Grant Access
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Information Sharing Console</h1>
                    <p className="text-text-secondary mt-1">Manage inter-departmental data access requests and permissions.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-1 flex mt-4 md:mt-0">
                    <button 
                        onClick={() => setActiveTab('Incoming')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Incoming' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Incoming Requests
                    </button>
                    <button 
                        onClick={() => setActiveTab('Outbound')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Outbound' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Outbound Forwards
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Pending Inbound" value={pendingCount.toString()} subtitle="Access Requests" variant="warning" />
                <DashboardCard title="Active Shares" value={approvedCount.toString()} subtitle="Authorized Access" variant="success" />
                <DashboardCard title="Lists Forwarded" value={outboundCount.toString()} subtitle="Sent to Agencies" variant="primary" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                
                {activeTab === 'Incoming' ? (
                    <>
                        {/* Toolbar Incoming */}
                        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setFilter('All')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'All' ? 'bg-white shadow-sm text-primary border border-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    All Logs
                                </button>
                                <button 
                                    onClick={() => setFilter('Pending')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'Pending' ? 'bg-white shadow-sm text-primary border border-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    Pending Only
                                </button>
                                <button 
                                    onClick={() => setFilter('Processed')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'Processed' ? 'bg-white shadow-sm text-primary border border-gray-200' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    History
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="text-gray-400 w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Requests..."
                                    className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Table Incoming */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Request Details</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Target Official</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Reason</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Date</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Status</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-text-main">{req.department}</div>
                                                <div className="text-xs text-text-secondary">{req.requestorName}</div>
                                                <div className="text-xs text-gray-400 font-mono">{req.id}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-text-main font-medium">{req.targetOfficial}</div>
                                                <div className="text-xs text-text-secondary">ID: {req.targetId}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-text-secondary max-w-xs truncate" title={req.reason}>
                                                {req.reason}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-text-secondary whitespace-nowrap">
                                                {req.requestDate}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'Denied' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {req.status === 'Pending' ? (
                                                    <button 
                                                        onClick={() => handleActionClick(req)}
                                                        className="text-primary hover:text-primary-dark font-medium text-sm border border-primary px-3 py-1 rounded hover:bg-blue-50"
                                                    >
                                                        Review
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Closed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredRequests.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-500">
                                                No requests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Table Outbound */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-sm font-semibold text-gray-700">History of Information Forwarded to Departments</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Reference ID</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Target Department</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">List Title/Subject</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Sent Date</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">No. of Officials</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Status</th>
                                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {outboundLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6 text-sm font-mono text-text-secondary">{log.id}</td>
                                            <td className="py-4 px-6 font-medium text-text-main">{log.targetDept}</td>
                                            <td className="py-4 px-6 text-sm text-text-secondary">
                                                <p>{log.title}</p>
                                                <p className="text-xs text-gray-400">{log.reason}</p>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-text-secondary">{log.dateSent}</td>
                                            <td className="py-4 px-6 text-sm text-text-secondary font-semibold">{log.count}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    log.status === 'Actioned' ? 'bg-green-100 text-green-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    <ShareIcon className="w-3 h-3 mr-1" /> {log.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="text-gray-500 hover:text-primary text-sm font-medium">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {outboundLogs.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                                No forwarded lists found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InfoSharingPage;