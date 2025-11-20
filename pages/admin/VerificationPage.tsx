import React, { useState, useEffect } from 'react';
import CheckIcon from '../../components/icons/CheckIcon';
import Modal from '../../components/Modal';
import SearchIcon from '../../components/icons/SearchIcon';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import { UserRole } from '../../types';
// --- Mock Data ---
// 1. Mock Declarants Database
const mockDeclarantsData: Record<string, any> = {
'11223344': {
id: '11223344',
name: 'H.E. Lyonpo Dorji',
schedule: 'Schedule I',
designation: 'Minister, Cabinet',
risk: 'Low',
land: [
{ plot: 'TH-1-1234', location: 'Thimphu', owner: 'Self', status: 'Match' },
{ plot: 'PU-2-9988', location: 'Punakha', owner: 'Spouse', status: 'Match' }
],
vehicles: [
{ reg: 'BP-1-A1234', make: 'Toyota Hilux', owner: 'Self', status: 'Match' },
{ reg: 'BP-2-B5678', make: 'Maruti Alto', owner: 'Self', status: 'Discrepancy' }
],
income: { salary: '1,500,000', declaredSavings: '500,000', actualSavings: '1,200,000' }
},
'99887766': {
id: '99887766',
name: 'Dasho Pema',
schedule: 'Schedule I',
designation: 'Secretary, MoF',
risk: 'High',
land: [
{ plot: 'PA-3-5544', location: 'Paro', owner: 'Self', status: 'Match' }
],
vehicles: [
{ reg: 'BP-1-C9999', make: 'Prado', owner: 'Self', status: 'Match' }
],
income: { salary: '900,000', declaredSavings: '200,000', actualSavings: '200,000' }
},
'55667788': {
id: '55667788',
name: 'Mr. Tashi Wangmo',
schedule: 'Schedule II',
designation: 'Procurement Officer, MoF',
risk: 'Medium',
land: [],
vehicles: [{ reg: 'BP-4-D4444', make: 'Kia Seltos', owner: 'Self', status: 'Match' }],
income: { salary: '450,000', declaredSavings: '100,000', actualSavings: '100,000' }
},
'77665544': {
id: '77665544',
name: 'Dasho Karma',
schedule: 'Schedule I',
designation: 'Director, MoH',
risk: 'Low',
land: [],
vehicles: [],
income: { salary: '800,000', declaredSavings: '150,000', actualSavings: '150,000' }
}
};
// 2. Mock Department Requests (For ACC)
const mockRequests = [
{ id: 'REQ-001', dept: 'Investigation Division', caseId: 'CASE-2024-88', reason: 'Verification for ongoing investigation #88', targetId: '99887766', date: '2024-02-25' },
{ id: 'REQ-002', dept: 'Intelligence Unit', caseId: 'INT-2024-12', reason: 'Asset profiling request', targetId: '11223344', date: '2024-02-24' },
];
// --- Components ---
interface VerificationCardProps {
title: string;
children?: React.ReactNode;
status?: 'match' | 'mismatch' | 'neutral';
}
const VerificationCard = ({ title, children, status = 'neutral' }: VerificationCardProps) => (
<div className={bg-white rounded-lg border-l-4 p-4 shadow-sm mb-4 ${status === 'match' ? 'border-green-500' : status === 'mismatch' ? 'border-red-500' : 'border-gray-300'}}>
<h3 className="font-semibold text-gray-700 mb-2 flex justify-between">
{title}
{status === 'match' && <span className="text-green-600 text-xs flex items-center"><CheckIcon /> Verified</span>}
{status === 'mismatch' && <span className="text-red-600 text-xs flex items-center font-bold">⚠ Issue Detected</span>}
</h3>
<div className="text-sm text-gray-600">
{children}
</div>
</div>
);
interface AdminVerificationPageProps {
userRole: UserRole;
preSelectedId?: string | null;
}
const AdminVerificationPage: React.FC<AdminVerificationPageProps> = ({ userRole, preSelectedId }) => {
// State
const [searchQuery, setSearchQuery] = useState('');
const [selectedDeclarantId, setSelectedDeclarantId] = useState<string | null>(preSelectedId || null);
const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
code
Code
// Update selection if prop changes
useEffect(() => {
    if (preSelectedId) {
        setSelectedDeclarantId(preSelectedId);
    }
}, [preSelectedId]);

// Sharing Modal State
const [isShareModalOpen, setShareModalOpen] = useState(false);
const [shareConfig, setShareConfig] = useState({ dept: '', reason: '' });

// Penalty Modal State
const [isPenaltyModalOpen, setPenaltyModalOpen] = useState(false);
const [penaltyConfig, setPenaltyConfig] = useState({ type: 'Late Filing', amount: '', remarks: '' });

// Computed Data
const selectedDeclarant = selectedDeclarantId ? mockDeclarantsData[selectedDeclarantId] : null;
const activeRequest = mockRequests.find(r => r.id === activeRequestId);

const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock search logic
    const foundId = Object.keys(mockDeclarantsData).find(id => 
        mockDeclarantsData[id].name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        id.includes(searchQuery)
    );
    if (foundId) {
        setSelectedDeclarantId(foundId);
        setActiveRequestId(null); // Clear request context if searching manually
    } else {
        alert("No official found with that Name or ID in the mock database.");
    }
};

const handleRequestClick = (req: typeof mockRequests[0]) => {
    setSelectedDeclarantId(req.targetId);
    setActiveRequestId(req.id);
    setShareConfig({ dept: req.dept, reason: `Response to request ${req.id}` });
};

const handleManualShare = () => {
    setShareConfig({ dept: 'Investigation Division', reason: '' });
    setActiveRequestId(null); // Manual share, not tied to a request
    setShareModalOpen(true);
};

const processRequest = (action: 'grant' | 'deny') => {
    if (action === 'grant') {
        alert(`Access granted to ${activeRequest?.dept} for official ${selectedDeclarant?.name}. Logged in audit trail.`);
    } else {
        alert(`Request ${activeRequest?.id} denied.`);
    }
    setActiveRequestId(null);
};

const handlePenaltySubmit = () => {
    alert(`Penalty Imposed:\nType: ${penaltyConfig.type}\nAmount: Nu. ${penaltyConfig.amount}\nStatus: Notice Sent to Official`);
    setPenaltyModalOpen(false);
};

return (
    <div className="flex flex-col h-full">
        {/* Modals */}
        <Modal 
            isOpen={isShareModalOpen} 
            onClose={() => setShareModalOpen(false)} 
            title="Share Declaration Information"
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Securely share this asset declaration with other ACC departments.
                </p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Department</label>
                    <select 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={shareConfig.dept}
                        onChange={(e) => setShareConfig({...shareConfig, dept: e.target.value})}
                    >
                        <option>Investigation Division</option>
                        <option>Intelligence Unit</option>
                        <option>Legal Division</option>
                        <option>Asset Recovery Division</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-md px-3 py-2" 
                        rows={3}
                        value={shareConfig.reason}
                        onChange={(e) => setShareConfig({...shareConfig, reason: e.target.value})}
                    ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={() => setShareModalOpen(false)} className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
                    <button onClick={() => { alert('Shared!'); setShareModalOpen(false); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">Share</button>
                </div>
            </div>
        </Modal>

        <Modal
            isOpen={isPenaltyModalOpen}
            onClose={() => setPenaltyModalOpen(false)}
            title="Impose Penalty for Non-Compliance"
        >
            <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-800">
                    You are about to sanction <strong>{selectedDeclarant?.name}</strong>. This action will generate a demand notice and record a compliance breach.
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Non-Compliance Type</label>
                    <select 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={penaltyConfig.type}
                        onChange={(e) => setPenaltyConfig({...penaltyConfig, type: e.target.value})}
                    >
                        <option>Late Filing</option>
                        <option>Non-Filing</option>
                        <option>False Declaration</option>
                        <option>Incomplete Information</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount (Nu.)</label>
                    <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g., 5000"
                        value={penaltyConfig.amount}
                        onChange={(e) => setPenaltyConfig({...penaltyConfig, amount: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Justification / Remarks</label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-md px-3 py-2" 
                        rows={3}
                        value={penaltyConfig.remarks}
                        onChange={(e) => setPenaltyConfig({...penaltyConfig, remarks: e.target.value})}
                    ></textarea>
                </div>
                 <div className="flex justify-end pt-2">
                    <button onClick={() => setPenaltyModalOpen(false)} className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
                    <button onClick={handlePenaltySubmit} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium">Confirm Penalty</button>
                </div>
            </div>
        </Modal>

        {/* Header / Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Official by Name or CID to verify..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button type="submit" className="px-6 py-2 bg-text-main text-white rounded-md hover:bg-gray-800 font-medium transition">
                    Search
                </button>
            </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            
            {/* Left Sidebar: Requests & List */}
            <div className="lg:col-span-4 space-y-6">
                {userRole === 'admin' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-purple-50 p-4 border-b border-purple-100 flex justify-between items-center">
                            <h2 className="font-semibold text-purple-900">Pending Access Requests</h2>
                            <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">{mockRequests.length}</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {mockRequests.map(req => (
                                <button 
                                    key={req.id}
                                    onClick={() => handleRequestClick(req)}
                                    className={`w-full text-left p-4 hover:bg-purple-50 transition border-l-4 ${activeRequestId === req.id ? 'bg-purple-50 border-purple-500' : 'border-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-sm text-gray-800">{req.dept}</span>
                                        <span className="text-xs text-gray-500">{req.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{req.reason}</p>
                                    <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 rounded px-2 py-1 w-fit">
                                        Target: {mockDeclarantsData[req.targetId]?.name || req.targetId}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="font-semibold text-gray-700 mb-4">Recently Viewed</h2>
                    <div className="space-y-2">
                        <button onClick={() => {setSelectedDeclarantId('11223344'); setActiveRequestId(null);}} className="block w-full text-left text-sm p-2 hover:bg-gray-50 rounded text-gray-600">H.E. Lyonpo Dorji</button>
                        <button onClick={() => {setSelectedDeclarantId('99887766'); setActiveRequestId(null);}} className="block w-full text-left text-sm p-2 hover:bg-gray-50 rounded text-gray-600">Dasho Pema</button>
                    </div>
                </div>
            </div>

            {/* Main Content: Verification View */}
            <div className="lg:col-span-8">
                {selectedDeclarant ? (
                    <div className="space-y-6">
                        {/* Context Banner */}
                        {activeRequest ? (
                            <div className="bg-purple-100 border border-purple-200 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-purple-900">Request Context: {activeRequest.caseId}</h3>
                                    <p className="text-sm text-purple-800">{activeRequest.dept} requested access for: <span className="italic">{activeRequest.reason}</span></p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => processRequest('deny')} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">Deny</button>
                                    <button onClick={() => processRequest('grant')} className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 shadow-sm">Grant Access</button>
                                </div>
                            </div>
                        ) : (
                            // Only show "Share Info" button if NOT in a request context (Manual sharing)
                            userRole === 'admin' && (
                                <div className="flex justify-end">
                                    <button 
                                        onClick={handleManualShare}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium flex items-center shadow-sm"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                        Share Info Manually
                                    </button>
                                </div>
                            )
                        )}

                        {/* Header Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-text-main flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-text-main">{selectedDeclarant.name}</h1>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-text-secondary">
                                    <span>ID: <span className="font-mono text-black">{selectedDeclarant.id}</span></span>
                                    <span>•</span>
                                    <span>{selectedDeclarant.designation}</span>
                                    <span>•</span>
                                    <span>{selectedDeclarant.schedule}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${selectedDeclarant.risk === 'Low' ? 'bg-green-100 text-green-800' : selectedDeclarant.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {selectedDeclarant.risk} Risk
                                </span>
                            </div>
                        </div>

                        {/* Two Column Verification Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Declared Data */}
                            <div>
                                <div className="bg-blue-50 p-3 rounded-t-lg border-b border-blue-100">
                                    <h2 className="font-bold text-blue-800 text-sm uppercase tracking-wide">Declared Assets</h2>
                                </div>
                                <div className="bg-white p-4 rounded-b-lg shadow-sm h-full">
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Land & Property</h3>
                                        {selectedDeclarant.land.length > 0 ? (
                                            selectedDeclarant.land.map((l: any, i: number) => (
                                                <p key={i} className="text-sm text-gray-700 mb-1">{l.location} ({l.plot}) - {l.owner}</p>
                                            ))
                                        ) : <p className="text-sm text-gray-400 italic">None declared</p>}
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Vehicles</h3>
                                        {selectedDeclarant.vehicles.length > 0 ? (
                                            selectedDeclarant.vehicles.map((v: any, i: number) => (
                                                <p key={i} className="text-sm text-gray-700 mb-1">{v.make} ({v.reg})</p>
                                            ))
                                        ) : <p className="text-sm text-gray-400 italic">None declared</p>}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Financials</h3>
                                        <p className="text-sm text-gray-700">Annual Income: Nu. {selectedDeclarant.income.salary}</p>
                                        <p className="text-sm text-gray-700">Declared Savings: Nu. {selectedDeclarant.income.declaredSavings}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification / Cross Check */}
                            <div>
                                <div className={`p-3 rounded-t-lg border-b flex justify-between items-center ${userRole === 'admin' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-teal-700 border-teal-800 text-white'}`}>
                                    <h2 className="font-bold text-sm uppercase tracking-wide">
                                        {userRole === 'admin' ? 'System Cross-Check' : 'Compliance Verification'}
                                    </h2>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-b-lg shadow-sm h-full space-y-3">
                                    {userRole === 'admin' ? (
                                        <>
                                            <VerificationCard title="Land Commission (NLCS)" status="match">
                                                {selectedDeclarant.land.map((l: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-xs">
                                                        <span>{l.plot}</span>
                                                        <span className="text-green-600">Matched</span>
                                                    </div>
                                                ))}
                                            </VerificationCard>
                                            <VerificationCard title="Road Safety (RSTA)" status={selectedDeclarant.vehicles.some((v:any) => v.status === 'Discrepancy') ? 'mismatch' : 'match'}>
                                                {selectedDeclarant.vehicles.map((v: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-xs mb-1">
                                                        <span>{v.reg}</span>
                                                        <span className={v.status === 'Discrepancy' ? 'text-red-600 font-bold' : 'text-green-600'}>{v.status}</span>
                                                    </div>
                                                ))}
                                            </VerificationCard>
                                            <VerificationCard title="Financial Intelligence" status={selectedDeclarant.income.actualSavings !== selectedDeclarant.income.declaredSavings ? 'mismatch' : 'match'}>
                                                <div className="flex justify-between text-xs">
                                                    <span>Actual Savings</span>
                                                    <span className="font-mono">Nu. {selectedDeclarant.income.actualSavings}</span>
                                                </div>
                                                {selectedDeclarant.income.actualSavings !== selectedDeclarant.income.declaredSavings && (
                                                    <p className="text-xs text-red-600 mt-1">Discrepancy detected in reported savings.</p>
                                                )}
                                            </VerificationCard>
                                        </>
                                    ) : (
                                        <>
                                            <VerificationCard title="Submission Check" status="match">
                                                <p>Submitted on time.</p>
                                            </VerificationCard>
                                            <VerificationCard title="Documents" status="match">
                                                <p>All attachments present.</p>
                                            </VerificationCard>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Actions Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button onClick={() => setPenaltyModalOpen(true)} className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 font-medium flex items-center">
                                <CreditCardIcon /> 
                                <span className="ml-2">Impose Penalty</span>
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">Flag Issue</button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium">Verify & Close</button>
                        </div>

                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-12">
                        <SearchIcon className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">Select a declarant to view details</p>
                        <p className="text-sm">Search by name/ID or select a pending request from the sidebar.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);
};
export default AdminVerificationPage;