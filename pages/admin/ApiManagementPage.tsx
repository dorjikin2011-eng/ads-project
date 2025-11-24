import React, { useState } from 'react';
import ServerIcon from '../../components/icons/ServerIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import XIcon from '../../components/icons/XIcon';
import DashboardCard from '../../components/DashboardCard';

interface ApiConnection {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    status: 'Online' | 'Offline' | 'Maintenance';
    lastSync: string;
    uptime: string;
    requests24h: number;
}

const initialConnections: ApiConnection[] = [
    { id: 'API-01', name: 'National Land Commission (NLCS)', description: 'Verifies land holdings and property ownership.', endpoint: 'https://api.nlcs.gov.bt/v2/verify', status: 'Online', lastSync: '2 mins ago', uptime: '99.9%', requests24h: 1250 },
    { id: 'API-02', name: 'Road Safety & Transport (RSTA)', description: 'Verifies vehicle registration and ownership history.', endpoint: 'https://api.rsta.gov.bt/assets', status: 'Online', lastSync: '5 mins ago', uptime: '99.5%', requests24h: 890 },
    { id: 'API-03', name: 'Financial Intelligence Unit (FIU)', description: 'Cross-checks bank balances and suspicious transactions.', endpoint: 'https://secure.fiu.bt/aml/check', status: 'Maintenance', lastSync: '1 hour ago', uptime: '98.0%', requests24h: 0 },
    { id: 'API-04', name: 'Dept of Civil Registration (DCRC)', description: 'Verifies family tree and census data.', endpoint: 'https://api.dcrc.gov.bt/census', status: 'Online', lastSync: '1 min ago', uptime: '100%', requests24h: 3400 },
];

const ApiManagementPage = () => {
    const [connections, setConnections] = useState<ApiConnection[]>(initialConnections);

    const toggleStatus = (id: string) => {
        setConnections(connections.map(conn => 
            conn.id === id 
                ? { ...conn, status: conn.status === 'Online' ? 'Offline' : 'Online' } 
                : conn
        ));
    };

    const refreshSync = (id: string) => {
        setConnections(connections.map(conn => 
            conn.id === id ? { ...conn, lastSync: 'Just now' } : conn
        ));
        alert("Sync triggered successfully.");
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center">
                        <ServerIcon className="text-blue-600 w-8 h-8 mr-3" />
                        External API Management
                    </h1>
                    <p className="text-text-secondary mt-1">Monitor and manage integrations with external government agencies.</p>
                </div>
                <button className="mt-4 md:mt-0 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium text-sm">
                    View System Logs
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Active Connections" value={connections.filter(c => c.status === 'Online').length.toString()} subtitle="Operational APIs" variant="success" />
                <DashboardCard title="Total Requests (24h)" value={connections.reduce((acc, curr) => acc + curr.requests24h, 0).toLocaleString()} subtitle="Data Lookups" variant="primary" />
                <DashboardCard title="Avg Response Time" value="145ms" subtitle="Latency Check" />
                <DashboardCard title="Failed Requests" value="0.02%" subtitle="Error Rate" variant="warning" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Connected Agency Endpoints</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {connections.map((api) => (
                        <div key={api.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <h3 className="text-lg font-bold text-text-main mr-3">{api.name}</h3>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-bold border ${
                                        api.status === 'Online' ? 'bg-green-100 text-green-800 border-green-200' :
                                        api.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                        'bg-red-100 text-red-800 border-red-200'
                                    }`}>
                                        {api.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{api.description}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-400 space-x-4 font-mono">
                                    <span>{api.endpoint}</span>
                                    <span>•</span>
                                    <span>Last Sync: {api.lastSync}</span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center space-x-6">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Uptime</p>
                                    <p className="font-mono font-bold text-gray-800">{api.uptime}</p>
                                </div>
                                <div className="text-right border-l pl-6">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Usage</p>
                                    <p className="font-mono font-bold text-gray-800">{api.requests24h}</p>
                                </div>
                                <div className="flex space-x-2 pl-4">
                                    <button 
                                        onClick={() => refreshSync(api.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" 
                                        title="Force Sync"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    </button>
                                    <button 
                                        onClick={() => toggleStatus(api.id)}
                                        className={`p-2 rounded-full ${api.status === 'Online' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title={api.status === 'Online' ? 'Disconnect' : 'Connect'}
                                    >
                                        {api.status === 'Online' ? <CheckIcon /> : <XIcon />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApiManagementPage;