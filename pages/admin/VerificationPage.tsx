import React, { useState, useEffect } from 'react';
import CheckIcon from '../../components/icons/CheckIcon';
import XIcon from '../../components/icons/XIcon';
import Modal from '../../components/Modal';
import SearchIcon from '../../components/icons/SearchIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import DocumentIcon from '../../components/icons/DocumentIcon';
import ServerIcon from '../../components/icons/ServerIcon';
import { UserRole } from '../../types';

// --- Expanded Mock Data ---
const mockDeclarantsData: Record<string, any> = {
    '11223344': { 
        id: '11223344', 
        name: 'H.E. Lyonpo Dorji', 
        schedule: 'Schedule I', 
        designation: 'Minister, Cabinet', 
        type: 'Annual', 
        risk: 'Low', 
        status: 'Pending Review', 
        immovable: [{ type: 'Land', thram: 'TH-123', location: 'Thimphu', declared: '20 Decimals', system: '20 Decimals', apiStatus: 'Match' }],
        movable: [{ type: 'Vehicle', reg: 'BP-1-A1234', model: 'Toyota Prado', declared: 'Prado', system: 'Toyota Land Cruiser Prado (2022)', apiStatus: 'Match' }],
        income: [{ source: 'Salary', declared: '1,500,000', system: '1,500,000', apiStatus: 'Match' }],
        liabilities: [{ type: 'Housing Loan', bank: 'BoB', declared: '3,000,000', system: '3,000,000', apiStatus: 'Match' }],
        documents: [{name: 'Tax_Clearance.pdf', type: 'Tax'}] 
    },
    '55667788': { 
        id: '55667788', 
        name: 'Mr. Tashi Wangmo', 
        schedule: 'Schedule II', 
        designation: 'Procurement Officer', 
        type: 'Vacation of Office', 
        risk: 'Medium', 
        status: 'Returned', 
        returnReason: 'Missing bank statement for Housing Loan.',
        returnDate: '2024-03-10', // Mock Return Date
        immovable: [],
        movable: [{ type: 'Vehicle', reg: 'BP-2-B4444', model: 'Kia Seltos', declared: 'Kia Seltos', system: 'Kia Seltos (2021)', apiStatus: 'Match' }],
        income: [{ source: 'Salary', declared: '450,000', system: '450,000', apiStatus: 'Match' }],
        liabilities: [],
        documents: [{name: 'No_Due_Certificate.pdf', type: 'Admin'}] 
    },
    'AMEND-001': {
        id: 'AMEND-001',
        name: 'Sonam Pelden',
        schedule: 'Schedule II',
        designation: 'Accountant',
        type: 'Annual',
        risk: 'Low',
        status: 'Amendment Requested',
        amendmentReason: 'Forgot to include fixed deposit of Nu. 50,000.',
        immovable: [], movable: [], income: [], liabilities: [], documents: []
    },
    'AMEND-002': {
        id: 'AMEND-002',
        name: 'Dasho Karma',
        schedule: 'Schedule I',
        designation: 'Director General',
        type: 'Annual',
        risk: 'Medium',
        status: 'Amendment Requested',
        amendmentReason: 'Correction in land acreage.',
        immovable: [], movable: [], income: [], liabilities: [], documents: []
    }
};

const VerificationCard = ({ title, children }: { title: string, children: React.ReactNode }) => ( <div className="bg-white border border-gray-200 rounded-lg mb-4 p-4 shadow-sm"> <h3 className="font-bold text-gray-700 text-sm uppercase mb-3 border-b pb-2">{title}</h3> {children} </div> );
const ApiMatchBadge = ({ status }: { status: 'Match' | 'Mismatch' | 'Not Found' }) => { const colors = { 'Match': 'bg-green-100 text-green-800 border-green-200', 'Mismatch': 'bg-red-100 text-red-800 border-red-200', 'Not Found': 'bg-gray-100 text-gray-600 border-gray-200' }; return ( <span className={`text-xs px-2 py-0.5 rounded font-bold border ${colors[status] || colors['Not Found']}`}> {status} </span> ); };

interface AdminVerificationPageProps { userRole: UserRole; preSelectedId?: string | null; }

const AdminVerificationPage: React.FC<AdminVerificationPageProps> = ({ userRole, preSelectedId }) => {
    const [selectedId, setSelectedId] = useState<string | null>(preSelectedId || null);
    const [activeTab, setActiveTab] = useState<'Checklist' | 'Assets' | 'Financials' | 'Documents'>('Checklist');
    const [checks, setChecks] = useState({ timely: false, complete: false, accurate: false });
    const [queueFilter, setQueueFilter] = useState<'Pending' | 'Returned' | 'Amendment'>('Pending');
    
    const [scheduleFilter, setScheduleFilter] = useState<'All' | 'Schedule I' | 'Schedule II'>('All');
    const [isCertModalOpen, setCertModalOpen] = useState(false);
    const [isPenaltyModalOpen, setPenaltyModalOpen] = useState(false);
    const [isReturnModalOpen, setReturnModalOpen] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [penaltyAmount, setPenaltyAmount] = useState('');
    const [penaltyReason, setPenaltyReason] = useState('Late Filing');

    useEffect(() => { if (preSelectedId) setSelectedId(preSelectedId); }, [preSelectedId]);
    const selected = selectedId ? mockDeclarantsData[selectedId] : null;

    // Filter Logic
    const filteredDeclarants = Object.values(mockDeclarantsData).filter((d: any) => {
        if (queueFilter === 'Pending' && d.status !== 'Pending Review') return false;
        if (queueFilter === 'Returned' && d.status !== 'Returned') return false;
        if (queueFilter === 'Amendment' && d.status !== 'Amendment Requested') return false;
        if (userRole === 'agency_admin') return d.schedule === 'Schedule II';
        if (userRole === 'admin') { if (scheduleFilter === 'All') return true; return d.schedule === scheduleFilter; }
        return false;
    });

    const handleVerify = () => {
        if (selected?.type === 'Vacation of Office') setCertModalOpen(true);
        else alert("Declaration Verified. Compliance Status Updated.");
    };
    const issueCertificate = () => { alert("Clearance Certificate Issued!"); setCertModalOpen(false); };
    const handlePenaltySubmit = () => { alert(`Penalty Imposed.`); setPenaltyModalOpen(false); };
    const handleReturnSubmit = () => { alert(`Returned to ${selected?.name}. Reason: ${returnReason}`); setReturnModalOpen(false); };
    const handleApproveAmendment = () => {
        if (selected?.schedule === 'Schedule II') {
            if (userRole === 'agency_admin' || userRole === 'admin') alert(`Amendment Request APPROVED.`); else alert("Error: Access Denied.");
        } else if (selected?.schedule === 'Schedule I') {
            if (userRole === 'admin') alert(`Amendment Request APPROVED by ACC Admin.`); else alert("Error: Agency Admin cannot approve Schedule I amendments.");
        }
    };

    // --- NEW: DEADLINE CALCULATION ---
    const getDeadlineStatus = (returnDateStr: string) => {
        if (!returnDateStr) return null;
        const returnDate = new Date(returnDateStr);
        const deadline = new Date(returnDate);
        deadline.setDate(returnDate.getDate() + 15); // 15 Days Rule
        
        const today = new Date(); // Mocking 'today' as roughly mid-March for demo
        // In real app: const today = new Date(); 
        // For demo, let's assume today is March 20, 2024 to show active countdown
        const mockToday = new Date('2024-03-20');
        
        const diffTime = deadline.getTime() - mockToday.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} days`, color: 'text-red-600', bg: 'bg-red-100' };
        return { text: `${diffDays} days remaining`, color: 'text-orange-700', bg: 'bg-orange-100' };
    };

    // ... (Renderers for Assets/Financials same as before - omitting for brevity but assuming they exist in full file) ...
    const renderAssets = () => ( <div className="space-y-6"> <div className="border rounded-lg overflow-hidden"> <div className="bg-gray-50 p-3 border-b flex justify-between items-center"> <h3 className="font-bold text-gray-700">Immovable Properties</h3> {userRole === 'admin' && <span className="text-xs text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100"><ServerIcon className="w-3 h-3 mr-1"/> Linked: NLCS</span>} </div> <table className="w-full text-sm text-left"> <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Type</th><th className="p-3">Details</th><th className="p-3">Declared</th>{userRole === 'admin' && <th className="p-3 bg-blue-50 text-blue-800 border-l">System (API)</th>}{userRole === 'admin' && <th className="p-3 text-right">Status</th>}</tr></thead> <tbody> {selected?.immovable.map((item: any, i: number) => ( <tr key={i} className="border-b last:border-0"> <td className="p-3 font-medium">{item.type}</td> <td className="p-3 text-gray-500">{item.location}</td> <td className="p-3">{item.declared}</td> {userRole === 'admin' && <td className="p-3 bg-blue-50/30 border-l font-mono text-xs text-gray-600">{item.system}</td>} {userRole === 'admin' && <td className="p-3 text-right"><ApiMatchBadge status={item.apiStatus} /></td>} </tr> ))} {selected?.immovable.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No immovable assets.</td></tr>} </tbody> </table> </div> <div className="border rounded-lg overflow-hidden"> <div className="bg-gray-50 p-3 border-b flex justify-between items-center"> <h3 className="font-bold text-gray-700">Movable Assets</h3> {userRole === 'admin' && <span className="text-xs text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100"><ServerIcon className="w-3 h-3 mr-1"/> Linked: RSTA</span>} </div> <table className="w-full text-sm text-left"> <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Type</th><th className="p-3">Reg.</th><th className="p-3">Declared</th>{userRole === 'admin' && <th className="p-3 bg-blue-50 text-blue-800 border-l">System (API)</th>}{userRole === 'admin' && <th className="p-3 text-right">Status</th>}</tr></thead> <tbody> {selected?.movable.map((item: any, i: number) => ( <tr key={i} className="border-b last:border-0"> <td className="p-3 font-medium">{item.type}</td> <td className="p-3 text-gray-500">{item.reg}</td> <td className="p-3">{item.declared}</td> {userRole === 'admin' && <td className="p-3 bg-blue-50/30 border-l font-mono text-xs text-gray-600">{item.system}</td>} {userRole === 'admin' && <td className="p-3 text-right"><ApiMatchBadge status={item.apiStatus} /></td>} </tr> ))} {selected?.movable.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No movable assets.</td></tr>} </tbody> </table> </div> </div> );
    const renderFinancials = () => ( <div className="space-y-6"> <div className="border rounded-lg overflow-hidden"> <div className="bg-gray-50 p-3 border-b flex justify-between items-center"><h3 className="font-bold text-gray-700">Income</h3>{userRole === 'admin' && <span className="text-xs text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100"><ServerIcon className="w-3 h-3 mr-1"/> Linked: FIU</span>}</div> <table className="w-full text-sm text-left"> <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Source</th><th className="p-3">Declared</th>{userRole === 'admin' && <th className="p-3 bg-blue-50 text-blue-800 border-l">System (API)</th>}{userRole === 'admin' && <th className="p-3 text-right">Status</th>}</tr></thead> <tbody> {selected?.income.map((item: any, i: number) => ( <tr key={i} className="border-b last:border-0"> <td className="p-3 font-medium">{item.source}</td> <td className="p-3 font-mono text-green-700">Nu. {item.declared}</td> {userRole === 'admin' && <td className="p-3 bg-blue-50/30 border-l font-mono text-xs text-gray-600">Nu. {item.system}</td>} {userRole === 'admin' && <td className="p-3 text-right"><ApiMatchBadge status={item.apiStatus} /></td>} </tr> ))} </tbody> </table> </div> </div> );

    return (
        <div className="flex flex-col h-full">
            {/* Modals (Same as before) */}
            <Modal isOpen={isCertModalOpen} onClose={() => setCertModalOpen(false)} title="Issue Clearance Certificate"> <div className="space-y-4 text-center"> <div className="bg-green-50 p-4 rounded text-green-800 text-sm border border-green-200"> Confirm clearance for <strong>{selected?.name}</strong>? </div> <button onClick={issueCertificate} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">Verify & Issue</button> </div> </Modal>
            <Modal isOpen={isPenaltyModalOpen} onClose={() => setPenaltyModalOpen(false)} title="Impose Penalty"> <div className="space-y-4"> <input type="number" className="w-full border rounded p-2" value={penaltyAmount} onChange={(e) => setPenaltyAmount(e.target.value)} placeholder="Amount (Nu.)" /> <button onClick={handlePenaltySubmit} className="px-3 py-1 bg-red-600 text-white rounded w-full">Confirm</button> </div> </Modal>
            <Modal isOpen={isReturnModalOpen} onClose={() => setReturnModalOpen(false)} title="Return for Correction"> <div className="space-y-4"> <textarea className="w-full border rounded p-2" rows={4} placeholder="Reason for return..." value={returnReason} onChange={(e) => setReturnReason(e.target.value)}></textarea> <button onClick={handleReturnSubmit} className="px-3 py-1 bg-orange-500 text-white rounded w-full">Send Return Notification</button> </div> </Modal>

            {/* Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                <div className="lg:col-span-4 bg-white rounded-lg shadow p-4 h-fit">
                    <div className="flex space-x-1 mb-4 border-b pb-2">
                        <button onClick={() => setQueueFilter('Pending')} className={`flex-1 text-[10px] py-1.5 font-bold rounded ${queueFilter === 'Pending' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Pending</button>
                        <button onClick={() => setQueueFilter('Returned')} className={`flex-1 text-[10px] py-1.5 font-bold rounded ${queueFilter === 'Returned' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-100'}`}>Returned</button>
                        <button onClick={() => setQueueFilter('Amendment')} className={`flex-1 text-[10px] py-1.5 font-bold rounded ${queueFilter === 'Amendment' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}>Amendments</button>
                    </div>
                    
                    {filteredDeclarants.length > 0 ? ( filteredDeclarants.map((d:any) => ( <button key={d.id} onClick={() => setSelectedId(d.id)} className={`w-full text-left p-3 rounded mb-2 border-l-4 ${selectedId === d.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50 border-transparent'} ${d.status === 'Returned' ? 'border-orange-400 bg-orange-50' : ''} ${d.status === 'Amendment Requested' ? 'border-purple-400 bg-purple-50' : ''}`}> <div className="font-bold text-gray-800">{d.name}</div> <div className="text-xs text-gray-500">{d.type}</div> {d.status === 'Amendment Requested' && <span className="text-xs text-purple-600 font-bold mt-1 block">Requesting Amendment</span>} </button> )) ) : ( <p className="text-xs text-gray-400 italic p-2 text-center">No items in {queueFilter} queue.</p> )}
                </div>

                {/* Main Panel */}
                <div className="lg:col-span-8">
                    {selected ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            {/* RETURNED BANNER WITH DEADLINE */}
                            {selected.status === 'Returned' && (
                                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-orange-800 text-sm">Returned for Correction</p>
                                            <p className="text-sm text-orange-700 mt-1">Reason: "{selected.returnReason}"</p>
                                        </div>
                                        {selected.returnDate && (() => {
                                            const status = getDeadlineStatus(selected.returnDate);
                                            return status ? (
                                                <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${status.bg} ${status.color}`}>
                                                    {status.text}
                                                </div>
                                            ) : null;
                                        })()}
                                    </div>
                                    <p className="text-xs text-orange-600 mt-2">Official has 15 days from return date ({selected.returnDate}) to resubmit without penalty.</p>
                                </div>
                            )}

                            {selected.status === 'Amendment Requested' && ( <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6 flex justify-between items-center"> <div> <p className="font-bold text-purple-800 text-sm">Amendment Request</p> <p className="text-sm text-purple-700 mt-1">Reason: "{selected.amendmentReason}"</p> </div> <button onClick={handleApproveAmendment} className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded hover:bg-purple-700"> Approve & Unlock </button> </div> )}

                            <div className="p-6 border-b">
                                <div className="flex justify-between items-start mb-4">
                                    <div><h1 className="text-2xl font-bold">{selected.name}</h1><p className="text-gray-500 text-sm">{selected.type} • {selected.schedule}</p></div>
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${selected.status === 'Returned' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>{selected.status}</span>
                                </div>
                                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit"> {['Checklist', 'Assets', 'Financials', 'Documents'].map(tab => ( <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}> {tab} </button> ))} </div>
                            </div>

                            <div className="p-6 flex-1">
                                {activeTab === 'Checklist' && ( <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <VerificationCard title="Verification Actions"> <div className="space-y-3"> <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer border hover:border-primary"> <input type="checkbox" checked={checks.timely} onChange={(e) => setChecks({...checks, timely: e.target.checked})} className="h-5 w-5 text-green-600 rounded" /> <span className="text-sm text-gray-700">1. Timeliness Check</span> </label> <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer border hover:border-primary"> <input type="checkbox" checked={checks.complete} onChange={(e) => setChecks({...checks, complete: e.target.checked})} className="h-5 w-5 text-green-600 rounded" /> <span className="text-sm text-gray-700">2. Completeness Check</span> </label> <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer border hover:border-primary"> <input type="checkbox" checked={checks.accurate} onChange={(e) => setChecks({...checks, accurate: e.target.checked})} className="h-5 w-5 text-green-600 rounded" /> <span className="text-sm text-gray-700">3. Accuracy Check</span> </label> </div> </VerificationCard> {userRole === 'admin' ? ( <VerificationCard title="Guidance (CADA)"> <p className="text-sm text-gray-600">Please review the <strong>Assets</strong>, <strong>Financials</strong>, and <strong>Documents</strong> tabs. Use the cross-check data provided from external APIs (NLCS/RSTA) to verify accuracy.</p> </VerificationCard> ) : ( <VerificationCard title="Guidance (ADA)"> <p className="text-sm text-gray-600">Please verify the declared information against uploaded evidence in the <strong>Documents</strong> tab.</p> </VerificationCard> )} </div> )}
                                {activeTab === 'Assets' && renderAssets()}
                                {activeTab === 'Financials' && renderFinancials()}
                                {activeTab === 'Documents' && <VerificationCard title="Evidence">{selected.documents.map((d:any, i:number)=><div key={i} className="p-2 border-b text-sm flex justify-between"><span>{d.name}</span><button className="text-blue-600 text-xs font-bold">View</button></div>)}</VerificationCard>}
                            </div>

                            <div className="p-6 border-t flex justify-between items-center bg-gray-50 rounded-b-lg">
                                <button onClick={() => setPenaltyModalOpen(true)} className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 font-medium flex items-center"> <CreditCardIcon className="w-4 h-4 mr-2" /> Impose Penalty </button>
                                <div className="flex space-x-3">
                                    <button onClick={() => setReturnModalOpen(true)} className="px-4 py-2 border border-gray-300 text-orange-600 rounded hover:bg-orange-50 font-medium">Return for Correction</button>
                                    <button onClick={handleVerify} disabled={!checks.timely || !checks.complete || !checks.accurate} className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"> <CheckIcon className="w-5 h-5 mr-2" /> {selected.type === 'Vacation of Office' ? 'Verify & Issue Cert' : 'Verify'} </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded shadow p-12">Select an official to verify</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminVerificationPage;