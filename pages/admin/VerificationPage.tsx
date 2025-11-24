import React, { useState, useEffect } from 'react';
import CheckIcon from '../../components/icons/CheckIcon';
import XIcon from '../../components/icons/XIcon';
import Modal from '../../components/Modal';
import SearchIcon from '../../components/icons/SearchIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import DocumentIcon from '../../components/icons/DocumentIcon';
import { UserRole } from '../../types';

// --- Mock Data ---
const mockDeclarantsData: Record<string, any> = {
    '11223344': { 
        id: '11223344', 
        name: 'H.E. Lyonpo Dorji', 
        schedule: 'Schedule I', 
        designation: 'Minister, Cabinet', 
        type: 'Annual', 
        risk: 'Low', 
        status: 'Pending Review', 
        immovable: [{ type: 'Land', thram: 'TH-123', location: 'Thimphu', size: '20 Decimals', cost: '2,000,000' }],
        movable: [{ type: 'Vehicle', model: 'Toyota Prado', reg: 'BP-1-A1234', cost: '3,500,000' }],
        income: [{ source: 'Salary', amount: '1,500,000' }],
        liabilities: [],
        documents: [{name: 'Tax_Clearance.pdf', type: 'Tax'}] 
    },
    '55667788': { 
        id: '55667788', 
        name: 'Mr. Tashi Wangmo', 
        schedule: 'Schedule II', 
        designation: 'Procurement Officer', 
        type: 'Vacation of Office', 
        risk: 'Medium', 
        status: 'Pending Review', 
        immovable: [],
        movable: [{ type: 'Vehicle', model: 'Kia Seltos', reg: 'BP-2-B4444', cost: '1,200,000' }],
        income: [{ source: 'Salary', amount: '450,000' }],
        liabilities: [],
        documents: [{name: 'No_Due_Certificate.pdf', type: 'Admin'}] 
    },
    '99887766': { 
        id: '99887766', 
        name: 'Dasho Pema', 
        schedule: 'Schedule I', 
        designation: 'Secretary, MoF', 
        type: 'Annual', 
        risk: 'High', 
        status: 'Pending Review', 
        immovable: [],
        movable: [],
        income: [],
        liabilities: [],
        documents: []
    }
};

// --- Components ---
const VerificationCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 p-4 shadow-sm">
        <h3 className="font-bold text-gray-700 text-sm uppercase mb-3 border-b pb-2">{title}</h3>
        {children}
    </div>
);

interface AdminVerificationPageProps { userRole: UserRole; preSelectedId?: string | null; }

const AdminVerificationPage: React.FC<AdminVerificationPageProps> = ({ userRole, preSelectedId }) => {
    const [selectedId, setSelectedId] = useState<string | null>(preSelectedId || null);
    const [activeTab, setActiveTab] = useState<'Checklist' | 'Assets' | 'Financials' | 'Documents'>('Checklist');
    const [checks, setChecks] = useState({ timely: false, complete: false, accurate: false });
    
    // Filter state for ACC Admin
    const [scheduleFilter, setScheduleFilter] = useState<'All' | 'Schedule I' | 'Schedule II'>('All');

    const [isCertModalOpen, setCertModalOpen] = useState(false);
    const [isPenaltyModalOpen, setPenaltyModalOpen] = useState(false);
    const [penaltyAmount, setPenaltyAmount] = useState('');
    const [penaltyReason, setPenaltyReason] = useState('Late Filing');

    useEffect(() => { if (preSelectedId) setSelectedId(preSelectedId); }, [preSelectedId]);
    const selected = selectedId ? mockDeclarantsData[selectedId] : null;

    // Logic to filter the list based on role AND schedule toggle
    const filteredDeclarants = Object.values(mockDeclarantsData).filter((d: any) => {
        if (userRole === 'agency_admin') {
            // Agency Admin only sees Schedule II (and usually filtered by their agency, simplifying here)
            return d.schedule === 'Schedule II';
        }
        // ACC Admin sees all, subject to filter
        if (scheduleFilter === 'All') return true;
        return d.schedule === scheduleFilter;
    });

    const handleVerify = () => {
        if (selected?.type === 'Vacation of Office') {
            setCertModalOpen(true);
        } else {
            alert("Declaration Verified. Compliance Status Updated.");
        }
    };

    const issueCertificate = () => {
        alert("Clearance Certificate Issued! Notification sent to ACC and Declarant.");
        setCertModalOpen(false);
    };

    const handlePenaltySubmit = () => {
        alert(`Penalty of Nu. ${penaltyAmount} imposed on ${selected?.name} for ${penaltyReason}. Added to Action Taken Report.`);
        setPenaltyModalOpen(false);
    };

    // ... (Render functions renderAssets/renderFinancials same as previous) ...
    const renderAssets = () => ( <div className="space-y-4"> <h3 className="font-bold text-gray-700 border-b pb-2">Immovable Properties</h3> {selected?.immovable.length > 0 ? ( <table className="w-full text-sm text-left"> <thead className="bg-gray-50"><tr><th className="p-2">Type</th><th className="p-2">Details</th><th className="p-2">Location</th><th className="p-2">Cost</th></tr></thead> <tbody> {selected.immovable.map((item: any, i: number) => ( <tr key={i} className="border-b"> <td className="p-2">{item.type}</td> <td className="p-2">{item.thram} / {item.size}</td> <td className="p-2">{item.location}</td> <td className="p-2 font-mono">Nu. {item.cost}</td> </tr> ))} </tbody> </table> ) : <p className="text-sm text-gray-500 italic">No immovable assets declared.</p>} <h3 className="font-bold text-gray-700 border-b pb-2 mt-6">Movable Assets</h3> {selected?.movable.length > 0 ? ( <table className="w-full text-sm text-left"> <thead className="bg-gray-50"><tr><th className="p-2">Type</th><th className="p-2">Model</th><th className="p-2">Registration</th><th className="p-2">Cost</th></tr></thead> <tbody> {selected.movable.map((item: any, i: number) => ( <tr key={i} className="border-b"> <td className="p-2">{item.type}</td> <td className="p-2">{item.model}</td> <td className="p-2">{item.reg}</td> <td className="p-2 font-mono">Nu. {item.cost}</td> </tr> ))} </tbody> </table> ) : <p className="text-sm text-gray-500 italic">No movable assets declared.</p>} </div> );
    const renderFinancials = () => ( <div className="space-y-4"> <h3 className="font-bold text-gray-700 border-b pb-2">Income Sources</h3> <table className="w-full text-sm text-left"> <thead className="bg-gray-50"><tr><th className="p-2">Source</th><th className="p-2">Amount (Annual Gross)</th></tr></thead> <tbody> {selected?.income.map((item: any, i: number) => ( <tr key={i} className="border-b"> <td className="p-2">{item.source}</td> <td className="p-2 font-mono text-green-700">Nu. {item.amount}</td> </tr> ))} </tbody> </table> <h3 className="font-bold text-gray-700 border-b pb-2 mt-6">Liabilities</h3> {selected?.liabilities.length > 0 ? ( <table className="w-full text-sm text-left"> <thead className="bg-gray-50"><tr><th className="p-2">Type</th><th className="p-2">Lender</th><th className="p-2">Sanctioned</th><th className="p-2">Outstanding</th></tr></thead> <tbody> {selected.liabilities.map((item: any, i: number) => ( <tr key={i} className="border-b"> <td className="p-2">{item.type}</td> <td className="p-2">{item.bank}</td> <td className="p-2 font-mono">Nu. {item.amount}</td> <td className="p-2 font-mono text-red-700">Nu. {item.balance}</td> </tr> ))} </tbody> </table> ) : <p className="text-sm text-gray-500 italic">No liabilities declared.</p>} </div> );

    return (
        <div className="flex flex-col h-full">
            {/* Certificate Modal */}
            <Modal isOpen={isCertModalOpen} onClose={() => setCertModalOpen(false)} title="Issue Clearance Certificate"> <div className="space-y-4 text-center"> <div className="bg-green-50 p-4 rounded text-green-800 text-sm border border-green-200"> You are confirming that <strong>{selected?.name}</strong> has satisfactorily declared their assets upon Vacation of Office. </div> <p className="text-gray-600 text-sm">This action will generate a digital Clearance Certificate available for the declarant to download.</p> <button onClick={issueCertificate} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">Verify & Notify ACC</button> </div> </Modal>

            {/* Penalty Modal */}
            <Modal isOpen={isPenaltyModalOpen} onClose={() => setPenaltyModalOpen(false)} title="Impose Penalty"> <div className="space-y-4"> <p className="text-sm text-gray-600">Impose a fine for non-compliance. This will be recorded in the Action Taken Report.</p> <div> <label className="block text-xs font-bold text-gray-700 mb-1">Reason</label> <select className="w-full border rounded p-2 text-sm" value={penaltyReason} onChange={(e) => setPenaltyReason(e.target.value)}> <option>Late Filing</option> <option>Non-Filing</option> <option>Incomplete Information</option> </select> </div> <div> <label className="block text-xs font-bold text-gray-700 mb-1">Amount (Nu.)</label> <input type="number" className="w-full border rounded p-2 text-sm" value={penaltyAmount} onChange={(e) => setPenaltyAmount(e.target.value)} placeholder="e.g. 1000" /> </div> <div className="flex justify-end gap-2 pt-2"> <button onClick={() => setPenaltyModalOpen(false)} className="px-3 py-1 bg-gray-100 rounded text-sm">Cancel</button> <button onClick={handlePenaltySubmit} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Confirm Penalty</button> </div> </div> </Modal>

            {/* Sidebar List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                <div className="lg:col-span-4 bg-white rounded-lg shadow p-4 h-fit">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="font-bold text-gray-700">Queue</h2>
                        {userRole === 'admin' && (
                            <div className="bg-gray-100 rounded p-1 flex">
                                {['All', 'I', 'II'].map(sch => (
                                    <button 
                                        key={sch} 
                                        onClick={() => setScheduleFilter(sch === 'I' ? 'Schedule I' : sch === 'II' ? 'Schedule II' : 'All')}
                                        className={`text-xs px-2 py-0.5 rounded ${
                                            (sch === 'All' && scheduleFilter === 'All') || (sch === 'I' && scheduleFilter === 'Schedule I') || (sch === 'II' && scheduleFilter === 'Schedule II')
                                            ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'
                                        }`}
                                    >
                                        {sch}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {filteredDeclarants.length > 0 ? (
                        filteredDeclarants.map((d:any) => (
                        <button key={d.id} onClick={() => setSelectedId(d.id)} className={`w-full text-left p-3 rounded mb-2 ${selectedId === d.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}>
                            <div className="font-bold text-gray-800">{d.name}</div>
                            <div className="text-xs text-gray-500">{d.type} | {d.designation}</div>
                            <div className={`text-xs mt-1 inline-block px-1.5 rounded ${d.schedule === 'Schedule I' ? 'bg-purple-100 text-purple-800' : 'bg-gray-200'}`}>{d.schedule}</div>
                        </button>
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 italic p-2">No items in this queue.</p>
                    )}
                </div>

                {/* Main Panel */}
                <div className="lg:col-span-8">
                    {selected ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="p-6 border-b">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold">{selected.name}</h1>
                                        <p className="text-gray-500 text-sm">{selected.type} • {selected.schedule}</p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-bold">Pending Verification</span>
                                </div>
                                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                                    {['Checklist', 'Assets', 'Financials', 'Documents'].map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}> {tab} </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 flex-1">
                                {activeTab === 'Checklist' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <VerificationCard title="Verification Actions">
                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer border hover:border-primary"> <input type="checkbox" checked={checks.timely} onChange={(e) => setChecks({...checks, timely: e.target.checked})} className="h-5 w-5 text-green-600 rounded" /> <span className="text-sm text-gray-700">1. Timeliness Check</span> </label>
                                                <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer border hover:border-primary"> <input type="checkbox" checked={checks.complete} onChange={(e) => setChecks({...checks, complete: e.target.checked})} className="h-5 w-5 text-green-600 rounded" /> <span className="text-sm text-gray-700">2. Completeness Check</span> </label>
                                                <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer border hover:border-primary"> <input type="checkbox" checked={checks.accurate} onChange={(e) => setChecks({...checks, accurate: e.target.checked})} className="h-5 w-5 text-green-600 rounded" /> <span className="text-sm text-gray-700">3. Accuracy Check (vs Evidence)</span> </label>
                                            </div>
                                        </VerificationCard>
                                        <VerificationCard title="Guidance"> <p className="text-sm text-gray-600">Please review the <strong>Assets</strong>, <strong>Financials</strong>, and <strong>Documents</strong> tabs before marking checks as complete.</p> </VerificationCard>
                                    </div>
                                )}
                                {activeTab === 'Assets' && renderAssets()}
                                {activeTab === 'Financials' && renderFinancials()}
                                {activeTab === 'Documents' && ( <VerificationCard title="Uploaded Evidence"> {selected.documents.map((doc:any, i:number) => ( <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded text-sm border-b border-dashed border-gray-200"> <span className="flex items-center text-gray-600 font-medium"><DocumentIcon className="w-5 h-5 mr-2 text-blue-500"/> {doc.name}</span> <div className="space-x-2"> <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{doc.type}</span> <button className="text-blue-600 font-bold text-xs hover:underline">Download</button> </div> </div> ))} </VerificationCard> )}
                            </div>

                            <div className="p-6 border-t flex justify-between items-center bg-gray-50 rounded-b-lg">
                                <button onClick={() => setPenaltyModalOpen(true)} className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 font-medium flex items-center"> <CreditCardIcon className="w-4 h-4 mr-2" /> Impose Penalty </button>
                                <div className="flex space-x-3">
                                    <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100 font-medium">Return for Correction</button>
                                    <button onClick={handleVerify} disabled={!checks.timely || !checks.complete || !checks.accurate} className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"> <CheckIcon className="w-5 h-5 mr-2" /> {selected.type === 'Vacation of Office' ? 'Verify & Issue Certificate' : 'Verify Compliance'} </button>
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