import React, { useState } from 'react';
import ScaleIcon from '../../components/icons/ScaleIcon';
import ExclamationCircleIcon from '../../components/icons/ExclamationCircleIcon';
import DocumentReportIcon from '../../components/icons/DocumentReportIcon';
import Modal from '../../components/Modal';
// Mock Data for DA Cases
const daCases = [
{
id: 'DA-2024-001',
officialId: '99887766',
name: 'Dasho Pema',
agency: 'Ministry of Finance',
year: 2023,
income: 1200000, // Salary + Allowances
assetsStart: 5000000,
assetsEnd: 8500000, // Increase of 3.5M
expenditure: 800000,
// Formula: (AssetsEnd - AssetsStart) + Expenditure - Income = Disproportion
// (8.5M - 5M) + 0.8M - 1.2M = 3.5M + 0.8M - 1.2M = 3.1M
disproportion: 3100000,
status: 'Under Investigation'
},
{
id: 'DA-2024-003',
officialId: '11223344',
name: 'Mr. Karma Wangdi',
agency: 'Thimphu Thromde',
year: 2023,
income: 900000,
assetsStart: 2000000,
assetsEnd: 2800000,
expenditure: 600000,
// (2.8 - 2.0) + 0.6 - 0.9 = 0.8 + 0.6 - 0.9 = 0.5
disproportion: 500000,
status: 'Flagged'
}
];
const DACasesPage = () => {
const [selectedCase, setSelectedCase] = useState<typeof daCases[0] | null>(null);
const [isReportModalOpen, setReportModalOpen] = useState(false);
code
Code
const handleGenerateReport = () => {
    setReportModalOpen(true);
};

const formatCurrency = (amount: number) => {
    return "Nu. " + amount.toLocaleString();
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
                <p className="text-text-secondary mt-1">Monitor and analyze cases where asset growth exceeds known income sources.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Case List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Flagged Cases Queue</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {daCases.map((daCase) => (
                        <div 
                            key={daCase.id} 
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition ${selectedCase?.id === daCase.id ? 'bg-blue-50 border-l-4 border-primary' : ''}`}
                            onClick={() => setSelectedCase(daCase)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{daCase.name}</h3>
                                    <p className="text-sm text-gray-600">{daCase.agency} • ID: {daCase.officialId}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${daCase.status === 'Under Investigation' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {daCase.status}
                                </span>
                            </div>
                            <div className="mt-3 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Unexplained Difference</p>
                                    <p className="text-lg font-bold text-red-600">{formatCurrency(daCase.disproportion)}</p>
                                </div>
                                <button className="text-sm text-primary hover:underline font-medium">Analyze &raquo;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Analysis Panel */}
            <div className="bg-white rounded-lg shadow-md h-fit sticky top-24">
                {selectedCase ? (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Case Analysis</h2>
                            <span className="text-xs font-mono text-gray-500">{selectedCase.id}</span>
                        </div>

                        {/* DA Formula Visualization */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">1. Net Asset Growth</h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">End Assets:</span>
                                    <span className="font-medium">{formatCurrency(selectedCase.assetsEnd)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Start Assets:</span>
                                    <span className="font-medium">- {formatCurrency(selectedCase.assetsStart)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                                </div>
                                <p className="text-right text-sm font-bold text-blue-600 mt-1">
                                    Growth: {formatCurrency(selectedCase.assetsEnd - selectedCase.assetsStart)}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">2. Total Outflow (Growth + Expense)</h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Asset Growth:</span>
                                    <span className="font-medium">{formatCurrency(selectedCase.assetsEnd - selectedCase.assetsStart)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Expenditure:</span>
                                    <span className="font-medium">+ {formatCurrency(selectedCase.expenditure)}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-300 my-2"></div>
                                <div className="flex justify-between font-bold">
                                    <span>Total Application:</span>
                                    <span>{formatCurrency((selectedCase.assetsEnd - selectedCase.assetsStart) + selectedCase.expenditure)}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">3. Known Sources (Inflow)</h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Salary & Allowances:</span>
                                    <span className="font-medium">{formatCurrency(selectedCase.income)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${(selectedCase.income / ((selectedCase.assetsEnd - selectedCase.assetsStart) + selectedCase.expenditure)) * 100}%`}}></div>
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h3 className="text-sm font-bold text-red-800 flex items-center mb-2">
                                    <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                                    Disproportionate Amount
                                </h3>
                                <p className="text-3xl font-bold text-red-600 text-center my-2">
                                    {formatCurrency(selectedCase.disproportion)}
                                </p>
                                <p className="text-xs text-red-700 text-center">
                                    (Total Application - Known Sources)
                                </p>
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
                ) : (
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