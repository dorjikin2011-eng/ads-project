import React, { useState } from 'react';
import DashboardCard from '../../components/DashboardCard';
import CheckIcon from '../../components/icons/CheckIcon';
import XIcon from '../../components/icons/XIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import ShareIcon from '../../components/icons/ShareIcon';
import Modal from '../../components/Modal';
import DocumentIcon from '../../components/icons/DocumentIcon';
import PlusIcon from '../../components/icons/PlusIcon';

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
    status: 'Pending' | 'Exported' | 'Denied';
    accessLevel: 'Excel Export';
    sourceMode?: 'System' | 'Hard Copy' | 'Email';
}

interface OutboundForward {
    id: string;
    targetDept: string;
    title: string;
    dateSent: string;
    count: number;
    reason: string;
    status: 'Sent (Excel)' | 'Acknowledged';
}

const initialRequests: AccessRequest[] = [
    { id: 'REQ-24-101', department: 'DoI (Investigation)', requestorName: 'Sr. Investigator Tashi', targetOfficial: 'Dasho Pema', targetId: '99887766', caseReference: 'CASE-2024-88', reason: 'Investigation of active case.', requestDate: '2024-03-10', status: 'Pending', accessLevel: 'Excel Export', sourceMode: 'System' },
    { id: 'REQ-24-102', department: 'DoPS (Complaint Enrichment)', requestorName: 'Officer Karma', targetOfficial: 'H.E. Lyonpo Dorji', targetId: '11223344', caseReference: 'CE-2024-12', reason: 'Enrichment of complaint #123.', requestDate: '2024-03-09', status: 'Pending', accessLevel: 'Excel Export', sourceMode: 'Email' },
    { id: 'REQ-24-098', department: 'DARe (Intel Gathering)', requestorName: 'Analyst Ugyen', targetOfficial: 'Mr. Tashi Wangmo', targetId: '55667788', caseReference: 'INT-2023-55', reason: 'Intelligence gathering.', requestDate: '2024-03-01', status: 'Exported', accessLevel: 'Excel Export', sourceMode: 'Hard Copy' },
];

const initialOutbound: OutboundForward[] = [
    { id: 'FWD-24-005', targetDept: 'DoPS (IVS)', title: 'Pending Penalties List - Feb 2024', dateSent: '2024-03-01', count: 12, reason: 'For Integrity Vetting System record', status: 'Sent (Excel)' },
    { id: 'FWD-24-006', targetDept: 'RAA', title: 'Defaulters List', dateSent: '2024-03-05', count: 3, reason: 'For Audit observation/follow-up', status: 'Sent (Excel)' },
];

const InfoSharingPage = () => {
    const [activeTab, setActiveTab] = useState<'Incoming' | 'Outbound'>('Incoming');
    
    // Incoming State
    const [requests, setRequests] = useState<AccessRequest[]>(initialRequests);
    const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [actionComment, setActionComment] = useState('');
    
    // Manual Log Modal State
    const [isLogModalOpen, setLogModalOpen] = useState(false);
    const [newLog, setNewLog] = useState({
        sourceMode: 'Hard Copy',
        department: 'DoI (Investigation)',
        requestorName: '',
        targetOfficial: '',
        targetId: '',
        reason: ''
    });

    // Outbound State
    const [outboundLogs, setOutboundLogs] = useState<OutboundForward[]>(initialOutbound);
    const [isForwardModalOpen, setForwardModalOpen] = useState(false);
    const [forwardTarget, setForwardTarget] = useState('DoPS (IVS)');

    // --- STATS CALCULATION (FIXED: Added missing variables) ---
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const approvedCount = requests.filter(r => r.status === 'Exported').length;
    const outboundCount = outboundLogs.length;

    // Handlers
    const handleActionClick = (req: AccessRequest) => {
        setSelectedRequest(req);
        setActionComment('');
        setActionModalOpen(true);
    };

    const processRequest = (status: 'Exported' | 'Denied') => {
        if (!selectedRequest) return;
        
        const updatedRequests = requests.map(req => 
            req.id === selectedRequest.id 
                ? { ...req, status: status } 
                : req
        );
        setRequests(updatedRequests);
        setActionModalOpen(false);
        if (status === 'Exported') alert("Declaration data exported to Excel and marked as shared.");
    };

    const handleGenerateForward = () => {
        const newForward: OutboundForward = {
            id: `FWD-24-${Math.floor(Math.random() * 1000)}`,
            targetDept: forwardTarget,
            title: `Penalty List for ${forwardTarget}`,
            dateSent: new Date().toISOString().split('T')[0],
            count: 15, // Mock count
            reason: forwardTarget === 'DoPS (IVS)' ? 'For IVS Record' : 'For Audit Follow-up',
            status: 'Sent (Excel)'
        };
        setOutboundLogs([newForward, ...outboundLogs]);
        setForwardModalOpen(false);
        alert(`Excel list generated and logged as sent to ${forwardTarget}.`);
    };

    const handleLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReq: AccessRequest = {
            id: `MAN-REQ-${Math.floor(Math.random() * 1000)}`,
            department: newLog.department,
            requestorName: newLog.requestorName,
            targetOfficial: newLog.targetOfficial,
            targetId: newLog.targetId,
            caseReference: 'MANUAL-LOG',
            reason: newLog.reason,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            accessLevel: 'Excel Export',
            sourceMode: newLog.sourceMode as any
        };
        setRequests([newReq, ...requests]);
        setLogModalOpen(false);
        setNewLog({ sourceMode: 'Hard Copy', department: 'DoI (Investigation)', requestorName: '', targetOfficial: '', targetId: '', reason: '' });
    };

    return (
        <div>
            {/* Action Modal (Incoming) */}
            <Modal isOpen={isActionModalOpen} onClose={() => setActionModalOpen(false)} title="Process Data Request">
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                        <p><strong>Source:</strong> <span className="bg-blue-100 text-blue-800 px-2 rounded text-xs">{selectedRequest?.sourceMode}</span></p>
                        <p><strong>Dept:</strong> {selectedRequest?.department}</p>
                        <p><strong>Target:</strong> {selectedRequest?.targetOfficial} ({selectedRequest?.targetId})</p>
                        <p><strong>Reason:</strong> {selectedRequest?.reason}</p>
                    </div>
                    <p className="text-xs text-gray-500">Action: Generate Excel file of Asset Declaration.</p>
                    
                    <textarea className="w-full border rounded-md p-2 text-sm" rows={2} placeholder="Remarks..." value={actionComment} onChange={(e) => setActionComment(e.target.value)}></textarea>

                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => processRequest('Denied')} className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm">Deny</button>
                        <button onClick={() => processRequest('Exported')} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm flex items-center"><DocumentIcon className="w-4 h-4 mr-2" /> Export Excel & Close</button>
                    </div>
                </div>
            </Modal>

            {/* Manual Log Modal */}
            <Modal isOpen={isLogModalOpen} onClose={() => setLogModalOpen(false)} title="Log Manual Request">
                <form onSubmit={handleLogSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Source Mode</label>
                            <select className="w-full border rounded p-2 text-sm" value={newLog.sourceMode} onChange={(e) => setNewLog({...newLog, sourceMode: e.target.value})}>
                                <option>Hard Copy</option>
                                <option>Email</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                            <select className="w-full border rounded p-2 text-sm" value={newLog.department} onChange={(e) => setNewLog({...newLog, department: e.target.value})}>
                                <option>DoI (Investigation)</option>
                                <option>DoPS (Complaint Enrichment)</option>
                                <option>DARe (Intel Gathering)</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Requestor Name & Designation</label>
                        <input type="text" required className="w-full border rounded p-2 text-sm" value={newLog.requestorName} onChange={(e) => setNewLog({...newLog, requestorName: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Target Official Name</label>
                            <input type="text" required className="w-full border rounded p-2 text-sm" value={newLog.targetOfficial} onChange={(e) => setNewLog({...newLog, targetOfficial: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Target Official ID</label>
                            <input type="text" required className="w-full border rounded p-2 text-sm" value={newLog.targetId} onChange={(e) => setNewLog({...newLog, targetId: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Reason / Case Ref</label>
                        <textarea className="w-full border rounded p-2 text-sm" rows={3} required value={newLog.reason} onChange={(e) => setNewLog({...newLog, reason: e.target.value})}></textarea>
                    </div>
                    
                    <div className="border-t pt-4 mt-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2">Attach Scan/Screenshot (Optional)</label>
                        <input type="file" className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setLogModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-bold">Log Request</button>
                    </div>
                </form>
            </Modal>

            {/* Forward Modal (Outbound) */}
            <Modal isOpen={isForwardModalOpen} onClose={() => setForwardModalOpen(false)} title="Generate List for External Agency">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Select the agency to share the list of declarants with pending penalties.</p>
                    <select className="w-full border rounded p-2" value={forwardTarget} onChange={(e) => setForwardTarget(e.target.value)}>
                        <option>DoPS (IVS)</option>
                        <option>Royal Audit Authority (RAA)</option>
                    </select>
                    <div className="flex justify-end pt-4">
                         <button onClick={() => setForwardModalOpen(false)} className="mr-3 px-4 py-2 text-gray-600">Cancel</button>
                         <button onClick={handleGenerateForward} className="bg-primary text-white px-4 py-2 rounded font-bold text-sm flex items-center"><ShareIcon className="w-4 h-4 mr-2"/> Generate Excel</button>
                    </div>
                </div>
            </Modal>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Information Sharing Console</h1>
                    <p className="text-text-secondary mt-1">Manage data sharing with DoPS, DoI, DARe, and RAA.</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <button onClick={() => setActiveTab('Incoming')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Incoming' ? 'bg-primary text-white' : 'bg-white text-gray-600 border'}`}>Incoming Requests</button>
                    <button onClick={() => setActiveTab('Outbound')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Outbound' ? 'bg-primary text-white' : 'bg-white text-gray-600 border'}`}>Outbound Lists</button>
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
                    <div className="p-4">
                        <div className="flex justify-end mb-4">
                            <button 
                                onClick={() => setLogModalOpen(true)} 
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-bold shadow-sm"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" /> Log Manual Request
                            </button>
                        </div>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b"><tr><th className="p-4 text-sm">Requestor</th><th className="p-4 text-sm">Target</th><th className="p-4 text-sm">Purpose</th><th className="p-4 text-sm">Status</th><th className="p-4 text-sm text-right">Action</th></tr></thead>
                                <tbody className="divide-y">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="p-4 text-sm font-medium">
                                                {req.department}
                                                <br/><span className="text-xs text-gray-500">{req.requestorName}</span>
                                                {req.sourceMode && <span className="block mt-1 text-[10px] bg-gray-100 text-gray-600 px-1 rounded w-fit">{req.sourceMode}</span>}
                                            </td>
                                            <td className="p-4 text-sm">{req.targetOfficial}</td>
                                            <td className="p-4 text-sm">{req.reason}</td>
                                            <td className="p-4"><span className={`text-xs px-2 py-1 rounded ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{req.status}</span></td>
                                            <td className="p-4 text-right">
                                                {req.status === 'Pending' && <button onClick={() => handleActionClick(req)} className="text-blue-600 text-sm hover:underline">Process</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setForwardModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center"><DocumentIcon className="w-4 h-4 mr-2"/> Share New List</button>
                        </div>
                        <table className="w-full text-left border rounded">
                            <thead className="bg-gray-100 border-b"><tr><th className="p-4 text-sm">Target Agency</th><th className="p-4 text-sm">List Content</th><th className="p-4 text-sm">Date Sent</th><th className="p-4 text-sm">Status</th></tr></thead>
                            <tbody className="divide-y">
                                {outboundLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm font-bold">{log.targetDept}</td>
                                        <td className="p-4 text-sm">{log.title}<br/><span className="text-xs text-gray-500">{log.reason}</span></td>
                                        <td className="p-4 text-sm">{log.dateSent}</td>
                                        <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{log.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoSharingPage;