import React, { useState } from 'react';
// --- Mock Data for Trends ---
const historicalData = {
'5years': [
{ year: 2019, avgAssets: 2.1, avgLiabilities: 0.8, avgIncome: 0.9, compliance: 92, landCount: 1500, vehicleCount: 800 },
{ year: 2020, avgAssets: 2.3, avgLiabilities: 0.9, avgIncome: 0.95, compliance: 94, landCount: 1550, vehicleCount: 820 },
{ year: 2021, avgAssets: 2.8, avgLiabilities: 1.4, avgIncome: 1.0, compliance: 88, landCount: 1600, vehicleCount: 1100 }, // Spike year
{ year: 2022, avgAssets: 3.0, avgLiabilities: 1.3, avgIncome: 1.1, compliance: 95, landCount: 1650, vehicleCount: 1150 },
{ year: 2023, avgAssets: 3.4, avgLiabilities: 1.2, avgIncome: 1.2, compliance: 98, landCount: 1700, vehicleCount: 1200 },
],
'10years': [
// ... simplified for demo, logic would handle larger arrays
{ year: 2014, avgAssets: 1.2, avgLiabilities: 0.4, avgIncome: 0.6, compliance: 85, landCount: 1000, vehicleCount: 500 },
{ year: 2016, avgAssets: 1.5, avgLiabilities: 0.5, avgIncome: 0.7, compliance: 88, landCount: 1200, vehicleCount: 600 },
{ year: 2019, avgAssets: 2.1, avgLiabilities: 0.8, avgIncome: 0.9, compliance: 92, landCount: 1500, vehicleCount: 800 },
{ year: 2021, avgAssets: 2.8, avgLiabilities: 1.4, avgIncome: 1.0, compliance: 88, landCount: 1600, vehicleCount: 1100 },
{ year: 2023, avgAssets: 3.4, avgLiabilities: 1.2, avgIncome: 1.2, compliance: 98, landCount: 1700, vehicleCount: 1200 },
]
};
const insights = [
{ type: 'warning', text: 'Significant spike in Liability-to-Asset ratio observed in 2021 (COVID Relief Loans).' },
{ type: 'success', text: 'Compliance rates reached an all-time high of 98% in 2023.' },
{ type: 'info', text: 'Shift in asset composition: Liquid assets increased by 15% over the last 3 years.' }
];
// --- Components ---
const TrendChart = ({ data, metrics }: { data: any[], metrics: { key: string, color: string, label: string }[] }) => {
const maxVal = Math.max(...data.map(d => Math.max(...metrics.map(m => d[m.key])))) * 1.1;
return (
    <div className="h-80 flex items-end space-x-4 sm:space-x-8 border-b border-gray-200 pb-2 px-4 mt-8">
        {data.map((item) => (
            <div key={item.year} className="flex-1 flex flex-col items-center group relative">
                 {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                    Year: {item.year}
                    {metrics.map(m => (
                        <div key={m.key}>{m.label}: {item[m.key]}</div>
                    ))}
                </div>

                <div className="w-full flex items-end justify-center space-x-1 h-64">
                    {metrics.map((metric) => (
                        <div 
                            key={metric.key}
                            className={`w-3 sm:w-6 rounded-t transition-all duration-500 hover:opacity-80 ${metric.color}`}
                            style={{ height: `${(item[metric.key] / maxVal) * 100}%` }}
                        ></div>
                    ))}
                </div>
                <span className="text-xs font-medium text-gray-500 mt-3">{item.year}</span>
            </div>
        ))}
    </div>
);
};
const AdminAnalyticsPage = () => {
const [timeRange, setTimeRange] = useState<'5years' | '10years'>('5years');
const [activeParam, setActiveParam] = useState<'networth' | 'composition' | 'compliance'>('networth');

const currentData = historicalData[timeRange];

// Define chart configuration based on active parameter
const getChartConfig = () => {
    switch(activeParam) {
        case 'networth':
            return [
                { key: 'avgAssets', color: 'bg-blue-500', label: 'Avg Assets (M)' },
                { key: 'avgLiabilities', color: 'bg-red-400', label: 'Avg Liabilities (M)' },
                { key: 'avgIncome', color: 'bg-green-400', label: 'Avg Income (M)' }
            ];
        case 'composition':
             return [
                { key: 'landCount', color: 'bg-yellow-500', label: 'Land Holdings' },
                { key: 'vehicleCount', color: 'bg-purple-500', label: 'Vehicle Holdings' }
            ];
        case 'compliance':
            return [
                { key: 'compliance', color: 'bg-teal-500', label: 'Compliance Rate (%)' }
            ];
        default: return [];
    }
};

return (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Longitudinal Trends Analysis</h1>
                <p className="text-text-secondary">Analyze asset declaration patterns over time to identify systemic risks.</p>
            </div>
            
            <div className="mt-4 md:mt-0 bg-white p-1 rounded-lg border border-gray-300 flex">
                <button 
                    onClick={() => setTimeRange('5years')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${timeRange === '5years' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Last 5 Years
                </button>
                <button 
                    onClick={() => setTimeRange('10years')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${timeRange === '10years' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Last 10 Years
                </button>
            </div>
        </div>

        {/* Main Analysis Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Parameter Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                <button 
                    onClick={() => setActiveParam('networth')}
                    className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeParam === 'networth' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Financial Growth (Net Worth)
                </button>
                <button 
                     onClick={() => setActiveParam('composition')}
                    className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeParam === 'composition' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Asset Composition
                </button>
                <button 
                     onClick={() => setActiveParam('compliance')}
                    className={`pb-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeParam === 'compliance' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Compliance Rates
                </button>
            </div>

            <div className="mb-4 flex items-center space-x-6 text-sm text-gray-600">
                {getChartConfig().map(m => (
                    <div key={m.key} className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${m.color}`}></span>
                        {m.label}
                    </div>
                ))}
            </div>

            <TrendChart data={currentData} metrics={getChartConfig()} />
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Automated Pattern Recognition</h2>
                <div className="space-y-4">
                    {insights.map((insight, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border-l-4 flex items-start ${
                            insight.type === 'warning' ? 'bg-red-50 border-red-500' : 
                            insight.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
                        }`}>
                            <div className="ml-2">
                                <p className={`text-sm font-medium ${
                                    insight.type === 'warning' ? 'text-red-800' : 
                                    insight.type === 'success' ? 'text-green-800' : 'text-blue-800'
                                }`}>
                                    {insight.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Analysis</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Download the raw data sets for this period including detailed breakdowns by Ministry and Grade.
                </p>
                <div className="space-y-3">
                    <button className="w-full border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Download CSV
                    </button>
                    <button className="w-full border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Download Excel (XLSX)
                    </button>
                    <button className="w-full bg-gray-800 rounded-md py-2 text-sm font-medium text-white hover:bg-gray-900">
                        Generate Executive PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
);
};
export default AdminAnalyticsPage;