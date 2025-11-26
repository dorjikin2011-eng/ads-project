import React, { useState } from 'react';
import BanknotesIcon from '../../components/icons/BanknotesIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import Modal from '../../components/Modal';
import DashboardCard from '../../components/DashboardCard';
import { UserRole } from '../../types';

// --- Mock Data & Interfaces ---
interface PenaltyCase {
    id: string;
    officialName: string;
    officialId: string;
    agency: string;
    type: 'Late Filing' | 'Non-Filing' | 'False Declaration' | 'Incomplete Filing';
    daysOverdue?: number;
    fineAmount: number;
    status: 'Pending' | 'Paid' | 'Waived';
    generatedDate: string;
}

const initialCases: PenaltyCase[] = [
    { id: 'PEN-24-001', officialName: 'Tshering Dorji', officialId: '10203040', agency: 'Ministry of Education', type: 'Late Filing', daysOverdue: 15, fineAmount: 1875, status: 'Pending', generatedDate: '2024-05-15' }, // 15th May
    { id: 'PEN-24-002', officialName: 'Karma Tenzin', officialId: '50403020', agency: 'Thimphu Thromde', type: 'Non-Filing', fineAmount: 45625, status: 'Pending', generatedDate: '2024-06-01' }, // June 1st
    { id: 'PEN-24-003', officialName: 'Sonam Wangmo', officialId: '99887766', agency: 'Ministry of Finance', type: 'Late Filing', daysOverdue: 5, fineAmount: 625, status: 'Paid', generatedDate: '2024-05-05' }, // 5th May
    { id: 'PEN-24-004', officialName: 'Pema Lhamo', officialId: '11223344', agency: 'Ministry of Health', type: 'Incomplete Filing', daysOverdue: 0, fineAmount: 3750, status: 'Pending', generatedDate: '2024-03-05' },
];

// Wrapper Component
interface PaymentConsolePageProps { userRole?: UserRole }
const PaymentConsolePage: React.FC<PaymentConsolePageProps> = ({ userRole = 'admin' }) => {
    return <PaymentConsoleContent userRole={userRole} />;
};

// Main Content Component
const PaymentConsoleContent = ({ userRole }: { userRole: UserRole }) => {
    const [cases, setCases] = useState<PenaltyCase[]>(initialCases);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Payment Modal State
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<PenaltyCase | null>(null);
    const [paymentReference, setPaymentReference] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash Deposit');
    const [paymentTab, setPaymentTab] = useState<'Manual' | 'BIRMS'>('Manual');
    const [birmsType, setBirmsType] = useState('Asset Declaration Fine');
    const [birmsSubtype, setBirmsSubtype] = useState('');
    const [birmsResult, setBirmsResult] = useState<any>(null);
    const [birmsLoading, setBirmsLoading] = useState(false);

    const formatCurrency = (val: number) => "Nu. " + val.toLocaleString();

    // Calculation Logic - Updated per User Request
    const getCalculationDetails = (item: PenaltyCase) => {
        const wage = 125;
        if (item.type === 'Late Filing') return `Late (May): ${item.daysOverdue} days × Nu. ${wage}`;
        if (item.type === 'Non-Filing') return `Non-Filing (June+): 365 × Nu. ${wage}`;
        if (item.type === 'Incomplete Filing') return `Incomplete: 30 × Nu. ${wage}`;
        return 'Fixed Penalty';
    };

    // Filter Logic
    const filteredCases = cases.filter(c => {
        if (userRole === 'agency_admin' && c.agency !== 'Ministry of Finance') return false;
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
        setPaymentMode('Cash Deposit');
        setPaymentTab('Manual');
        setBirmsResult(null);
        setBirmsSubtype('');
        setPayModalOpen(true);
    };

    const confirmPayment = (method: string, ref?: string) => {
        if (selectedCase) {
            setCases(cases.map(c => c.id === selectedCase.id ? { ...c, status: 'Paid' } : c));
            setPayModalOpen(false);
            alert(`Payment Recorded via ${method}!`);
        }
    };

    const handleBirmsSearch = () => {
        setBirmsLoading(true);
        setTimeout(() => {
            setBirmsLoading(false);
            setBirmsResult({ transactionId: 'BIRMS-' + Math.floor(Math.random() * 100000), amount: selectedCase?.fineAmount, status: 'Ready' });
        }, 1500);
    };

    const sendReminder = (name: string) => {
        alert(`Reminder Notification sent to ${name} via Email and SMS.`);
    };

    return (
        <div>
            {/* Payment Modal */}
            <Modal isOpen={isPayModalOpen} onClose={() => setPayModalOpen(false)} title="Record Penalty Payment"> 
                {selectedCase && ( 
                    <div className="space-y-4"> 
                        <div className="flex border-b"><button onClick={() => setPaymentTab('Manual')} className={`flex-1 pb-2 ${paymentTab === 'Manual' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Manual</button><button onClick={() => setPaymentTab('BIRMS')} className={`flex-1 pb-2 ${paymentTab === 'BIRMS' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>BIRMS Online</button></div> 
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4"> <div className="flex justify-between text-sm"> <span className="text-gray-600">Fine Amount:</span> <span className="font-bold text-gray-900">{formatCurrency(selectedCase.fineAmount)}</span> </div> <div className="text-xs text-gray-500 mt-1 italic">{getCalculationDetails(selectedCase)}</div> </div>
                        {paymentTab === 'Manual' ? ( 
                            <> 
                                <div> <label className="block text-sm font-medium text-text-secondary mb-1">Payment Mode</label> <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}> <option>Cash Deposit (at Office)</option> <option>Cheque</option> <option>Direct Bank Transfer (Manual Verify)</option> <option>Salary Deduction</option> </select> </div>
                                <div> <label className="block text-sm font-medium text-text-secondary mb-1">Receipt No. / Reference</label> <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., RCPT-123456" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} /> </div>
                                <div className="flex justify-end space-x-3 pt-4"> <button onClick={() => setPayModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button> <button onClick={() => confirmPayment('Manual Cash/Cheque', paymentReference)} disabled={!paymentReference} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"> <CheckIcon /> <span className="ml-2">Confirm Payment</span> </button> </div>
                            </> 
                        ) : ( 
                            <div className="space-y-4"> 
                                <div className="flex items-center justify-center mb-4"> <img src="https://www.acc.org.bt/wp-content/uploads/2021/08/ACC-Location.png" alt="BIRMS Logo" className="h-12 w-12 object-contain rounded-full border p-1" /> <div className="ml-3 text-center"> <h3 className="text-lg font-bold text-blue-900">BIRMS</h3> <p className="text-xs text-gray-500 uppercase tracking-wide">Online Payment Gateway</p> </div> </div>
                                <div> <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Payment Type</label> <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" value={birmsType} onChange={(e) => setBirmsType(e.target.value)}> <option>Asset Declaration Fine</option> <option>Administrative Penalty</option> </select> </div>
                                <div> <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Select Type First</label> <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter Official ID or Ref No" value={birmsSubtype} onChange={(e) => setBirmsSubtype(e.target.value)} /> </div>
                                {!birmsResult && ( <button onClick={handleBirmsSearch} disabled={!birmsSubtype || birmsLoading} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"> {birmsLoading ? ( <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span> ) : null} {birmsLoading ? 'Searching...' : 'Search'} </button> )}
                                {birmsResult && ( <div className="bg-green-50 border border-green-200 rounded p-3 mt-2 animate-fade-in"> <p className="text-xs text-green-800 font-bold uppercase">Record Found</p> <div className="flex justify-between text-sm mt-1"> <span>Transaction ID:</span> <span className="font-mono">{birmsResult.transactionId}</span> </div> <div className="flex justify-between text-sm font-bold mt-2 border-t border-green-200 pt-2"> <span>Total Payable:</span> <span>{formatCurrency(birmsResult.amount)}</span> </div> <button onClick={() => confirmPayment('BIRMS Online', birmsResult.transactionId)} className="w-full mt-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold shadow-sm"> Pay Now (Nu. {birmsResult.amount}) </button> </div> )} 
                            </div> 
                        )} 
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> <DashboardCard title="Outstanding Dues" value={formatCurrency(totalOutstanding)} subtitle="Pending Collection" variant="danger" /> <DashboardCard title="Total Collected" value={formatCurrency(totalCollected)} subtitle="Recovered Fines" variant="success" /> <DashboardCard title="Active Cases" value={activeCasesCount.toString()} subtitle="Officials Fined" variant="warning" /> </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between"><input type="text" placeholder="Search..." className="border rounded p-2 w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Official</th><th className="py-3 px-4 font-semibold text-sm text-text-secondary">Violation Type</th><th className="py-3 px-4 font-semibold text-sm text-text-secondary">Calculation</th><th className="py-3 px-4 font-semibold text-sm text-text-secondary">Fine Amount</th><th className="py-3 px-4 font-semibold text-sm text-text-secondary">Status</th><th className="py-3 px-4 font-semibold text-sm text-text-secondary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCases.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4"><div className="font-medium">{item.officialName}</div><div className="text-xs text-gray-500">{item.agency}</div></td>
                                    <td className="py-3 px-4"><span className="px-2 py-1 rounded text-xs font-bold bg-red-50 text-red-600">{item.type}</span></td>
                                    <td className="py-3 px-4 text-xs text-gray-600">{getCalculationDetails(item)}</td>
                                    <td className="py-3 px-4 font-bold">{formatCurrency(item.fineAmount)}</td>
                                    <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-xs ${item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span></td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        {item.status === 'Pending' && (
                                            <>
                                                <button onClick={() => sendReminder(item.officialName)} className="text-xs text-blue-600 hover:underline font-medium mr-3">Remind</button>
                                                <button onClick={() => openPaymentModal(item)} className="px-3 py-1 bg-green-600 text-white text-xs rounded font-bold">Pay on Behalf</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentConsolePage;