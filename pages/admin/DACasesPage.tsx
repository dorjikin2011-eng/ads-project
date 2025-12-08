import React, { useState } from 'react';
import ScaleIcon from '../../components/icons/ScaleIcon';
import ExclamationCircleIcon from '../../components/icons/ExclamationCircleIcon';
import DocumentReportIcon from '../../components/icons/DocumentReportIcon';
import Modal from '../../components/Modal';

// Mock Data for DA Cases with SOP-compliant structure
const daCases = [
    {
        id: 'DA-2024-001',
        officialId: '99887766',
        name: 'Dasho Pema',
        agency: 'Ministry of Finance',
        schedule: 'Schedule I',
        year: 2023,
        
        // SOP Formula: DA = (TA - TL) - (TI - TE) = NA - EW
        
        // Assets (TA)
        totalAssets: 8500000, // TA: Total Assets
        totalLiabilities: 1500000, // TL: Total Liabilities (loans, borrowings)
        
        // Income (TI)
        totalIncome: 1200000, // TI: Salary + Rental + Dividends + Other income
        
        // Expenditure (TE)
        totalExpenditure: 800000, // TE: Education, rent, insurance, loan repayments, etc.
        
        // Calculated values
        netAssets: 7000000, // NA = TA - TL = 8.5M - 1.5M = 7M
        explainedWealth: 400000, // EW = TI - TE = 1.2M - 0.8M = 0.4M
        disproportion: 6600000, // DA = NA - EW = 7M - 0.4M = 6.6M
        
        // Percentage
        daPercentage: 94.3, // DA as percentage of EW
        
        status: 'Under Investigation'
    },
    {
        id: 'DA-2024-002',
        officialId: '11223344',
        name: 'Mr. Karma Wangdi',
        agency: 'Thimphu Thromde',
        schedule: 'Schedule II',
        year: 2023,
        
        totalAssets: 2800000,
        totalLiabilities: 500000,
        totalIncome: 900000,
        totalExpenditure: 600000,
        
        netAssets: 2300000, // 2.8M - 0.5M = 2.3M
        explainedWealth: 300000, // 0.9M - 0.6M = 0.3M
        disproportion: 2000000, // 2.3M - 0.3M = 2M
        
        daPercentage: 86.7, // DA as percentage of EW
        
        status: 'Flagged'
    },
    {
        id: 'DA-2024-003',
        officialId: '55667788',
        name: 'Mrs. Deki Yangzom',
        agency: 'Ministry of Education',
        schedule: 'Schedule I',
        year: 2023,
        
        totalAssets: 4500000,
        totalLiabilities: 2000000,
        totalIncome: 1500000,
        totalExpenditure: 1200000,
        
        netAssets: 2500000, // 4.5M - 2M = 2.5M
        explainedWealth: 300000, // 1.5M - 1.2M = 0.3M
        disproportion: 2200000, // 2.5M - 0.3M = 2.2M
        
        daPercentage: 88.0,
        
        status: 'Under Investigation'
    }
];

const DACasesPage = () => {
    const [selectedCase, setSelectedCase] = useState(daCases[0]);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [scheduleFilter, setScheduleFilter] = useState<'All' | 'Schedule I' | 'Schedule II'>('All');

    const handleGenerateReport = () => {
        setReportModalOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return "Nu. " + amount.toLocaleString();
    };

    // Filter Logic
    const filteredCases = daCases.filter(daCase => {
        if (scheduleFilter === 'All') return true;
        return daCase.schedule === scheduleFilter;
    });

    // Calculate DA formula dynamically
    const calculateDA = (caseData: typeof daCases[0]) => {
        const netAssets = caseData.totalAssets - caseData.totalLiabilities;
        const explainedWealth = caseData.totalIncome - caseData.totalExpenditure;
        const da = netAssets - explainedWealth;
        const daPercentage = explainedWealth > 0 ? (da / explainedWealth) * 100 : 100;
        
        return { netAssets, explainedWealth, da, daPercentage };
    };

    // Get threshold status based on SOP guidelines
    const getThresholdStatus = (da: number, explainedWealth: number) => {
        const percentage = (da / explainedWealth) * 100;
        
        if (da <= 0) {
            return { level: 'safe', text: 'No unexplained wealth', color: 'green' };
        } else if (percentage > 20) {
            return { level: 'critical', text: 'Requires formal investigation', color: 'red' };
        } else if (da > 0) {
            return { level: 'warning', text: 'Needs deeper verification', color: 'yellow' };
        }
        return { level: 'safe', text: 'Within acceptable limits', color: 'green' };
    };

    // Helper function for status badge colors
    const getStatusBadgeClass = (status: string) => {
        return status === 'Under Investigation' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-yellow-100 text-yellow-800';
    };

    // Helper function for threshold badge colors
    const getThresholdBadgeClass = (color: string) => {
        switch(color) {
            case 'red': return 'bg-red-100 text-red-800';
            case 'yellow': return 'bg-yellow-100 text-yellow-800';
            case 'green': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper function for threshold background colors
    const getThresholdBgClass = (color: string) => {
        switch(color) {
            case 'red': return 'bg-red-50';
            case 'yellow': return 'bg-yellow-50';
            case 'green': return 'bg-green-50';
            default: return 'bg-gray-50';
        }
    };

    // Helper function for threshold border colors
    const getThresholdBorderClass = (color: string) => {
        switch(color) {
            case 'red': return 'border-red-200';
            case 'yellow': return 'border-yellow-200';
            case 'green': return 'border-green-200';
            default: return 'border-gray-200';
        }
    };

    // Helper function for threshold text colors
    const getThresholdTextClass = (color: string) => {
        switch(color) {
            case 'red': return 'text-red-600';
            case 'yellow': return 'text-yellow-600';
            case 'green': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div>
            <Modal
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
                title="DA Finding Report Generated"
            >
                <div className="p-4 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <DocumentReportIcon />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Report Ready</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">
                            The Disproportionate Asset Report for <strong>{selectedCase?.name}</strong> has been compiled successfully.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Case Reference: {selectedCase?.id}
                        </p>
                        {selectedCase && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md text-left">
                                <p className="text-sm font-medium text-gray-700">DA Calculation:</p>
                                <p className="text-xs text-gray-600 mt-1">
                                    DA = (TA - TL) - (TI - TE) = ({selectedCase.totalAssets.toLocaleString()} - {selectedCase.totalLiabilities.toLocaleString()}) - ({selectedCase.totalIncome.toLocaleString()} - {selectedCase.totalExpenditure.toLocaleString()})
                                </p>
                                <p className="text-xs text-gray-600">
                                    DA = {selectedCase.netAssets.toLocaleString()} - {selectedCase.explainedWealth.toLocaleString()} = <span className="font-bold">{formatCurrency(selectedCase.disproportion)}</span>
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="mt-5">
                         <button
                            onClick={() => setReportModalOpen(false)}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                        >
                            Download PDF
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center">
                        <ScaleIcon />
                        <span className="ml-3">Disproportionate Assets (DA) Cases</span>
                    </h1>
                    <p className="text-text-secondary mt-1">Monitor and analyze cases using SOP formula: DA = (TA - TL) - (TI - TE)</p>
                </div>
                <div className="bg-white border border-gray-300 rounded-md p-1 flex shadow-sm">
                    {['All', 'Schedule I', 'Schedule II'].map((sch) => (
                        <button
                            key={sch}
                            onClick={() => setScheduleFilter(sch as any)}
                            className={`px-4 py-1.5 text-sm font-medium rounded ${
                                scheduleFilter === sch 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {sch}
                        </button>
                    ))}
                </div>
            </div>

            {/* Formula Display Card */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                    <div className="mr-4 bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-gray-800">DA = (TA - TL) - (TI - TE)</div>
                    </div>
                    <div className="text-sm text-gray-700">
                        <p className="font-medium">SOP Formula Applied:</p>
                        <p><strong>DA</strong> = Disproportionate Assets</p>
                        <p><strong>TA</strong> = Total Assets | <strong>TL</strong> = Total Liabilities</p>
                        <p><strong>TI</strong> = Total Income | <strong>TE</strong> = Total Expenditure</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Case List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800">Flagged Cases Queue</h2>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">{filteredCases.length} cases</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {filteredCases.map((daCase) => {
                            const threshold = getThresholdStatus(daCase.disproportion, daCase.explainedWealth);
                            return (
                                <div 
                                    key={daCase.id} 
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition ${selectedCase?.id === daCase.id ? 'bg-blue-50 border-l-4 border-primary' : ''}`}
                                    onClick={() => setSelectedCase(daCase)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{daCase.name}</h3>
                                            <div className="flex items-center text-sm text-gray-600 gap-2">
                                                <span>{daCase.agency}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${daCase.schedule === 'Schedule I' ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-700'}`}>
                                                    {daCase.schedule}
                                                </span>
                                                <span>•</span>
                                                <span className="text-xs text-gray-500">DA: {daCase.daPercentage.toFixed(1)}% of EW</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(daCase.status)}`}>
                                                {daCase.status}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getThresholdBadgeClass(threshold.color)}`}>
                                                {threshold.level.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Disproportionate Assets (DA)</p>
                                            <p className="text-lg font-bold text-red-600">{formatCurrency(daCase.disproportion)}</p>
                                            <p className="text-xs text-gray-500 mt-1">{threshold.text}</p>
                                        </div>
                                        <button className="text-sm text-primary hover:underline font-medium">Analyze &raquo;</button>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredCases.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No cases found for {scheduleFilter}.
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Analysis Panel */}
                <div className="bg-white rounded-lg shadow-md h-fit sticky top-24">
                    {selectedCase ? (() => {
                        const { netAssets, explainedWealth, da, daPercentage } = calculateDA(selectedCase);
                        const threshold = getThresholdStatus(da, explainedWealth);
                        const thresholdBgClass = getThresholdBgClass(threshold.color);
                        const thresholdBorderClass = getThresholdBorderClass(threshold.color);
                        const thresholdTextClass = getThresholdTextClass(threshold.color);
                        
                        return (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Case Analysis</h2>
                                    <span className="text-xs font-mono text-gray-500">{selectedCase.id}</span>
                                </div>

                                {/* SOP DA Formula Visualization */}
                                <div className="space-y-6">
                                    {/* Step 1: Net Assets (TA - TL) */}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-2">1. Net Assets (NA = TA - TL)</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total Assets (TA):</span>
                                                <span className="font-medium">{formatCurrency(selectedCase.totalAssets)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total Liabilities (TL):</span>
                                                <span className="font-medium">- {formatCurrency(selectedCase.totalLiabilities)}</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 mt-2">
                                                <div className="flex justify-between font-bold text-blue-600">
                                                    <span>Net Assets (NA):</span>
                                                    <span>{formatCurrency(netAssets)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2: Explained Wealth (TI - TE) */}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-2">2. Explained Wealth (EW = TI - TE)</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total Income (TI):</span>
                                                <span className="font-medium">{formatCurrency(selectedCase.totalIncome)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total Expenditure (TE):</span>
                                                <span className="font-medium">- {formatCurrency(selectedCase.totalExpenditure)}</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 mt-2">
                                                <div className="flex justify-between font-bold text-green-600">
                                                    <span>Explained Wealth (EW):</span>
                                                    <span>{formatCurrency(explainedWealth)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3: DA Calculation */}
                                    <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                                        <h3 className="text-sm font-bold text-red-800 flex items-center mb-3">
                                            <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                                            3. Disproportionate Assets (DA = NA - EW)
                                        </h3>
                                        
                                        <div className="text-center mb-4">
                                            <div className="text-3xl font-bold text-red-600 my-2">
                                                {formatCurrency(da)}
                                            </div>
                                            <div className="text-sm text-red-700 font-medium">
                                                {daPercentage.toFixed(1)}% of Explained Wealth
                                            </div>
                                        </div>
                                        
                                        <div className="text-center text-xs text-gray-600 bg-white p-2 rounded border">
                                            <p className="font-mono">
                                                DA = ({selectedCase.totalAssets.toLocaleString()} - {selectedCase.totalLiabilities.toLocaleString()}) - 
                                                ({selectedCase.totalIncome.toLocaleString()} - {selectedCase.totalExpenditure.toLocaleString()})
                                            </p>
                                        </div>
                                    </div>

                                    {/* Threshold Status */}
                                    <div className={`p-3 ${thresholdBgClass} rounded-lg border ${thresholdBorderClass}`}>
                                        <h3 className="text-sm font-semibold text-gray-600 mb-2">ACC Threshold Assessment</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">DA Status:</span>
                                                <span className={`font-bold ${thresholdTextClass}`}>{threshold.text}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">DA vs EW Ratio:</span>
                                                <span className={`font-bold ${daPercentage > 20 ? 'text-red-600' : 'text-yellow-600'}`}>
                                                    {daPercentage.toFixed(1)}% {daPercentage > 20 ? '(> 20% threshold)' : ''}
                                                </span>
                                            </div>
                                            <div className="mt-2">
                                                <div className="text-xs text-gray-500 mb-1">ACC Guidelines:</div>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    <li>• DA = 0: No unexplained wealth</li>
                                                    <li>• DA &gt; 0: Deeper verification needed</li>
                                                    <li>• DA &gt; 20% of EW: Formal investigation required</li>
                                                    <li>• DA ≥ Nu. X: Prosecution consideration</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <button 
                                        onClick={handleGenerateReport}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
                                    >
                                        <DocumentReportIcon />
                                        <span className="ml-2">Generate DA Report</span>
                                    </button>
                                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        Forward to Investigation
                                    </button>
                                </div>
                            </div>
                        );
                    })() : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12">
                            <ScaleIcon />
                            <p className="mt-4 text-center">Select a case from the list to analyze the financial discrepancy.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DACasesPage;