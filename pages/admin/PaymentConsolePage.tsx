import React, { useState } from 'react';
import BanknotesIcon from '../../components/icons/BanknotesIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import ShareIcon from '../../components/icons/ShareIcon';
import Modal from '../../components/Modal';
import DashboardCard from '../../components/DashboardCard';

// --- Mock Data & Interfaces ---

interface PenaltyCase {
    id: string;
    officialName: string;
    officialId: string;
    agency: string;
    type: 'Late Filing' | 'Non-Filing' | 'False Declaration';
    daysOverdue?: number;
    fineAmount: number;
    status: 'Pending' | 'Paid' | 'Waived';
    generatedDate: string;
}

const initialCases: PenaltyCase[] = [
    { id: 'PEN-24-001', officialName: 'Tshering Dorji', officialId: '10203040', agency: 'Ministry of Education', type: 'Late Filing', daysOverdue: 15, fineAmount: 1750, status: 'Pending', generatedDate: '2024-03-01' },
    { id: 'PEN-24-002', officialName: 'Karma Tenzin', officialId: '50403020', agency: 'Thimphu Thromde', type: 'Non-Filing', fineAmount: 15000, status: 'Pending', generatedDate: '2024-03-02' },
    { id: 'PEN-24-003', officialName: 'Sonam Wangmo', officialId: '99887766', agency: 'Ministry of Finance', type: 'Late Filing', daysOverdue: 5, fineAmount: 1250, status: 'Paid', generatedDate: '2024-02-28' },
    { id: 'PEN-24-004', officialName: 'Pema Lhamo', officialId: '11223344', agency: 'Ministry of Health', type: 'Late Filing', daysOverdue: 45, fineAmount: 3250, status: 'Pending', generatedDate: '2024-03-05' },
    { id: 'PEN-24-005', officialName: 'Ugyen Tshering', officialId: '77665544', agency: 'Druk Holding', type: 'False Declaration', fineAmount: 20000, status: 'Pending', generatedDate: '2024-03-10' },
];

const PaymentConsolePage = () => {
    const [cases, setCases] = useState<PenaltyCase[]>(initialCases);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Payment Modal State
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<PenaltyCase | null>(null);
    const [paymentReference, setPaymentReference] = useState('');

    // Forward Modal State
    const [isForwardModalOpen, setForwardModalOpen] = useState(false);
    const [forwardDept, setForwardDept] = useState('Legal Division');
    const [forwardNote, setForwardNote] = useState('');

    // Calculation Logic (Visual helper)
    const getCalculationDetails = (item: PenaltyCase) => {
        if (item.type === 'Late Filing') {
            return `Base (Nu. 1000) + (${item.daysOverdue} days × Nu. 50)`;
        }
        return 'Fixed Penalty';
    };

    const formatCurrency = (val: number) => "Nu. " + val.toLocaleString();

    // Filter Logic
    const filteredCases = cases.filter(c => {
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = c.officialName.toLowerCase().includes(searchLower) || c.officialId.includes(searchLower);
        return matchesStatus && matchesSearch;
    });

    // Stats
    const totalOutstanding = cases.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.fineAmount, 0);
    const totalCollected = cases.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.fineAmount, 0);
    const activeCasesCount = cases.filter(c => c.status === 'Pending').length;

    // Handlers
    const openPaymentModal = (item: PenaltyCase) => {
        setSelectedCase(item);
        setPaymentReference('');
        setPayModalOpen(true);
    };

    const confirmPayment = () => {
        if (selectedCase) {
            setCases(cases.map(c => c.id === selectedCase.id ? { ...c, status: 'Paid' } : c));
            setPayModalOpen(false);
            alert(`Payment Recorded Successfully!\nRef: ${paymentReference}\nAmount: ${formatCurrency(selectedCase.fineAmount)}`);
        }
    };

    const sendReminder = (name: string) => {
        alert(`Reminder Notification sent to ${name} via Email and SMS.`);
    };

    // Selection Handlers
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = filteredCases.map(c => c.id);
            setSelectedIds(new Set(allIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleForwardSubmit = () => {
        const count = selectedIds.size;
        alert(`Successfully forwarded ${count} cases to ${forwardDept} for follow-up action.\n\nNote: ${forwardNote}`);
        setForwardModalOpen(false);
        setSelectedIds(new Set());
        setForwardNote('');
    };

    return (
        <div>
            {/* Forward Modal */}
            <Modal
                isOpen={isForwardModalOpen}
                onClose={() => setForwardModalOpen(false)}
                title="Forward Defaulter List"
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded border border-blue-100 text-sm text-blue-800">
                        You are forwarding <strong>{selectedIds.size}</strong> selected declarant(s) who have outstanding penalties.
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Select Department</label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            value={forwardDept}
                            onChange={(e) => setForwardDept(e.target.value)}
                        >
                            <option>Legal Division</option>
                            <option>Human Resource Division (Agency)</option>
                            <option>Royal Civil Service Commission</option>
                            <option>Department of Revenue & Customs</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Action / Instructions</label>
                        <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            rows={4}
                            placeholder="e.g., Please initiate administrative action or salary deduction..."
                            value={forwardNote}
                            onChange={(e) => setForwardNote(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setForwardModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                        <button 
                            onClick={handleForwardSubmit}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
                        >
                            <ShareIcon className="w-4 h-4 mr-2" /> 
                            Forward List
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Payment Modal */}
            <Modal 
                isOpen={isPayModalOpen} 
                onClose={() => setPayModalOpen(false)} 
                title="Record Penalty Payment"
            >
                {selectedCase && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-text-secondary">Official:</span>
                                <span className="font-semibold text-text-main">{selectedCase.officialName}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-text-secondary">Violation:</span>
                                <span className="font-medium text-red-600">{selectedCase.type}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="text-text-secondary font-bold">Amount Due:</span>
                                <span className="font-bold text-xl text-primary">{formatCurrency(selectedCase.fineAmount)}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Payment Reference / Receipt No.</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                placeholder="e.g., BOB-TRX-123456"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button onClick={() => setPayModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                            <button 
                                onClick={confirmPayment} 
                                disabled={!paymentReference}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                <CheckIcon /> 
                                <span className="ml-2">Mark as Paid</span>
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center">
                        <BanknotesIcon className="text-green-600 w-8 h-8 mr-3" />
                        Compliance Payment Console
                    </h1>
                    <p className="text-text-secondary mt-1">Manage fines for non-compliance (Late Filing, Non-Filing).</p>
                </div>
                
                {selectedIds.size > 0 && (
                    <button 
                        onClick={() => setForwardModalOpen(true)}
                        className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark shadow-sm flex items-center animate-pulse"
                    >
                        <ShareIcon className="w-5 h-5 mr-2" />
                        Forward Selected ({selectedIds.size}) to Dept
                    </button>
                )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Outstanding Dues" value={formatCurrency(totalOutstanding)} subtitle="Pending Collection" variant="danger" />
                <DashboardCard title="Total Collected" value={formatCurrency(totalCollected)} subtitle="Recovered Fines" variant="success" />
                <DashboardCard title="Active Penalty Cases" value={activeCasesCount.toString()} subtitle="Officials Fined" variant="warning" />
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4 bg-gray-50">
                    <div className="relative max-w-xs w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Official..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <select 
                            className="border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-primary focus:border-primary"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Cases</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4 w-10 text-center">
                                    <input 
                                        type="checkbox" 
                                        onChange={handleSelectAll}
                                        checked={filteredCases.length > 0 && selectedIds.size === filteredCases.length}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                </th>
                                <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Official</th>
                                <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Violation Type</th>
                                <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Calculation Basis</th>
                                <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Fine Amount</th>
                                <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Status</th>
                                <th className="py-3 px-4 font-semibold text-sm text-text-secondary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCases.length > 0 ? (
                                filteredCases.map((item) => (
                                    <tr key={item.id} className={`hover:bg-gray-50 ${selectedIds.has(item.id) ? 'bg-blue-50' : ''}`}>
                                        <td className="py-3 px-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.has(item.id)}
                                                onChange={() => handleSelectOne(item.id)}
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-text-main">{item.officialName}</div>
                                            <div className="text-xs text-text-secondary">{item.agency}</div>
                                            <div className="text-xs text-gray-400">ID: {item.officialId}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                item.type === 'Non-Filing' ? 'bg-red-100 text-red-800' : 
                                                item.type === 'False Declaration' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-text-secondary">
                                            {getCalculationDetails(item)}
                                        </td>
                                        <td className="py-3 px-4 font-mono font-bold text-text-main">
                                            {formatCurrency(item.fineAmount)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            {item.status === 'Pending' ? (
                                                <>
                                                    <button 
                                                        onClick={() => sendReminder(item.officialName)}
                                                        className="text-xs text-blue-600 hover:underline font-medium"
                                                    >
                                                        Remind
                                                    </button>
                                                    <button 
                                                        onClick={() => openPaymentModal(item)}
                                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 shadow-sm"
                                                    >
                                                        Pay
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        No penalty cases found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentConsolePage;