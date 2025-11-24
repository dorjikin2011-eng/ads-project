import React, { useState, useEffect } from 'react';
import CheckIcon from '../../components/icons/CheckIcon';
import XIcon from '../../components/icons/XIcon';
import Modal from '../../components/Modal';
import SearchIcon from '../../components/icons/SearchIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import DocumentIcon from '../../components/icons/DocumentIcon';
import ServerIcon from '../../components/icons/ServerIcon';
import { UserRole } from '../../types';

// --- Expanded Mock Data with System (API) Comparisons ---
const mockDeclarantsData: Record<string, any> = {
    '11223344': { 
        id: '11223344', 
        name: 'H.E. Lyonpo Dorji', 
        schedule: 'Schedule I', 
        designation: 'Minister, Cabinet', 
        type: 'Annual', 
        risk: 'Low', 
        status: 'Pending Review', 
        
        // Assets with API Comparison Data
        immovable: [
            { 
                type: 'Land', 
                thram: 'TH-123', 
                location: 'Thimphu', 
                declared: '20 Decimals', 
                system: '20 Decimals', 
                apiStatus: 'Match' 
            },
            { 
                type: 'Building', 
                thram: 'PU-998', 
                location: 'Punakha', 
                declared: '2 Storey', 
                system: '2 Storey', 
                apiStatus: 'Match' 
            }
        ],
        movable: [
            { 
                type: 'Vehicle', 
                reg: 'BP-1-A1234', 
                model: 'Toyota Prado', 
                declared: 'Prado', 
                system: 'Toyota Land Cruiser Prado (2022)', 
                apiStatus: 'Match' 
            },
            { 
                type: 'Vehicle', 
                reg: 'BP-2-B9999', 
                model: 'Maruti Alto', 
                declared: 'Not Declared', 
                system: 'Registered Owner (Active)', 
                apiStatus: 'Mismatch' // System found it, user didn't declare
            }
        ],
        income: [
            { source: 'Salary', declared: '1,500,000', system: '1,500,000', apiStatus: 'Match' },
            { source: 'Rental', declared: '200,000', system: '200,000', apiStatus: 'Match' }
        ],
        liabilities: [
            { type: 'Housing Loan', bank: 'BoB', declared: '3,000,000', system: '3,000,000', apiStatus: 'Match' }
        ],
        documents: [{name: 'Tax_Clearance.pdf', type: 'Tax'}, {name: 'Bank_Statement.pdf', type: 'Finance'}] 
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
        movable: [
            { type: 'Vehicle', reg: 'BP-2-B4444', model: 'Kia Seltos', declared: 'Kia Seltos', system: 'Kia Seltos (2021)', apiStatus: 'Match' }
        ],
        income: [
            { source: 'Salary', declared: '450,000', system: '450,000', apiStatus: 'Match' }
        ],
        liabilities: [],
        documents: [{name: 'No_Due_Certificate.pdf', type: 'Admin'}, {name: 'Clearance_Form.pdf', type: 'HR'}] 
    }
};

// --- Components ---
const VerificationCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 p-4 shadow-sm">
        <h3 className="font-bold text-gray-700 text-sm uppercase mb-3 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const ApiMatchBadge = ({ status }: { status: 'Match' | 'Mismatch' | 'Not Found' }) => {
    const colors = {
        'Match': 'bg-green-100 text-green-800 border-green-200',
        'Mismatch': 'bg-red-100 text-red-800 border-red-200',
        'Not Found': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return (
        <span className={`text-xs px-2 py-0.5 rounded font-bold border ${colors[status] || colors['Not Found']}`}>
            {status}
        </span>
    );
};

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
            return d.schedule === 'Schedule II';
        }
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

    // --- Renderers with API Cross-Check ---
    const renderAssets = () => (
        <div className="space-y-6">
            {/* Immovable Assets */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Immovable Properties</h3>
                    {userRole === 'admin' && (
                        <span className="text-xs text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100">
                            <ServerIcon className="w-3 h-3 mr-1"/> Verified via National Land Commission API
                        </span>
                    )}
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="p-3">Type</th>
                            <th className="p-3">Thram / Loc</th>
                            <th className="p-3">Declared Value</th>
                            {userRole === 'admin' && <th className="p-3 bg-blue-50 text-blue-800 border-l">System Record (API)</th>}
                            {userRole === 'admin' && <th className="p-3 text-right">Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {selected?.immovable.map((item: any, i: number) => (
                            <tr key={i} className="border-b last:border-0">
                                <td className="p-3 font-medium">{item.type}</td>
                                <td className="p-3 text-gray-500">{item.thram}, {item.location}</td>
                                <td className="p-3">{item.declared}</td>
                                {userRole === 'admin' && (
                                    <td className="p-3 bg-blue-50/30 border-l font-mono text-xs text-gray-600">
                                        {item.system}
                                    </td>
                                )}
                                {userRole === 'admin' && (
                                    <td className="p-3 text-right"><ApiMatchBadge status={item.apiStatus} /></td>
                                )}
                            </tr>
                        ))}
                        {selected?.immovable.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No immovable assets found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Movable Assets */}
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Movable Assets</h3>
                    {userRole === 'admin' && (
                        <span className="text-xs text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100">
                            <ServerIcon className="w-3 h-3 mr-1"/> Verified via RSTA API
                        </span>
                    )}
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="p-3">Type</th>
                            <th className="p-3">Registration</th>
                            <th className="p-3">Declared Model</th>
                            {userRole === 'admin' && <th className="p-3 bg-blue-50 text-blue-800 border-l">System Record (API)</th>}
                            {userRole === 'admin' && <th className="p-3 text-right">Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {selected?.movable.map((item: any, i: number) => (
                            <tr key={i} className={`border-b last:border-0 ${item.apiStatus === 'Mismatch' ? 'bg-red-50' : ''}`}>
                                <td className="p-3 font-medium">{item.type}</td>
                                <td className="p-3 text-gray-500">{item.reg}</td>
                                <td className="p-3">{item.declared}</td>
                                {userRole === 'admin' && (
                                    <td className="p-3 bg-blue-50/30 border-l font-mono text-xs text-gray-600">
                                        {item.system}
                                    </td>
                                )}
                                {userRole === 'admin' && (
                                    <td className="p-3 text-right"><ApiMatchBadge status={item.apiStatus} /></td>
                                )}
                            </tr>
                        ))}
                         {selected?.movable.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No movable assets found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFinancials = () => (
        <div className="space-y-6">
             <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Income & Financials</h3>
                    {userRole === 'admin' && (
                        <span className="text-xs text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100">
                            <ServerIcon className="w-3 h-3 mr-1"/> Verified via FIU / RMA API
                        </span>
                    )}
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="p-3">Source</th>
                            <th className="p-3">Declared Amount</th>
                            {userRole === 'admin' && <th className="p-3 bg-blue-50 text-blue-800 border-l">System Record (API)</th>}
                            {userRole === 'admin' && <th className="p-3 text-right">Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {selected?.income.map((item: any, i: number) => (
                            <tr key={i} className="border-b last:border-0">
                                <td className="p-3 font-medium">{item.source}</td>
                                <td className="p-3 font-mono text-green-700">Nu. {item.declared}</td>
                                {userRole === 'admin' && (
                                    <td className="p-3 bg-blue-50/30 border-l font-mono text-xs text-gray-600">
                                        Nu. {item.system}
                                    </td>
                                )}
                                {userRole === 'admin' && (
                                    <td className="p-3 text-right"><ApiMatchBadge status={item.apiStatus} /></td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Liabilities</h3>
                    {userRole === 'admin' && (
                        <span className="text-xs text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded border border-blue-100">
                            <ServerIcon className="w-3 h-3 mr-1"/> Verified via CIB API
                        </span>
                    )}
                </div>
                {selected?.liabilities.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="p-3">Type</th>
                                <th className="p-3">Lender</th>
                                <th className="p-3">Declared Outstanding</th>
                                {userRole === 'admin' && <th className="p-3 bg-blue-50 text-blue-800 border-l">System Record (API)</th>}
                                {userRole === 'admin' && <th className="p-3 text-right">Status</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {selected.liabilities.map((item: any, i: number) => (
                                <tr key={i} className="border-b last:border-0">
                                    <td className="p-3 font-medium">{item.type}</td>
                                    <td className="p-3">{item.bank}</td>
                                    <td className="p-3 font-mono text-red-700">Nu. {item.declared}</td>
                                    {userRole === 'admin' && (
                                        <td className="p-3 bg-blue-50/30 border-l font-mono text-xs text-gray-600">
                                            Nu. {item.system}
                                        </td>
                                    )}
                                    {userRole === 'admin' && (
                                        <td className="p-3 text-right"><ApiMatchBadge status={item.apiStatus} /></td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p className="p-4 text-sm text-gray-500 italic">No liabilities declared.</p>}
            </div>
        </div>
    );

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
                                        {sch === 'Schedule I' ? 'Sch I' : sch === 'Schedule II' ? 'Sch II' : 'All'}
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
                                        <VerificationCard title="Guidance"> <p className="text-sm text-gray-600">Please review the <strong>Assets</strong>, <strong>Financials</strong>, and <strong>Documents</strong> tabs. Use the cross-check data provided from external APIs (NLCS/RSTA) to verify accuracy.</p> </VerificationCard>
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