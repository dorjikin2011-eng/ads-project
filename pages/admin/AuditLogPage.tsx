import React, { useState } from 'react';
import { UserRole } from '../../types';
import SearchIcon from '../../components/icons/SearchIcon';
import HistoryIcon from '../../components/icons/HistoryIcon';
import DashboardCard from '../../components/DashboardCard';

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    role: string;
    agency: string;
    action: string;
    details: string;
    ipAddress: string;
    severity: 'Info' | 'Warning' | 'Critical';
}

// Mock Data
const mockLogs: AuditLog[] = [
    { id: 'LOG-001', timestamp: '2024-03-20 10:30:05', user: 'ACC Admin', role: 'Admin', agency: 'ACC', action: 'User Registration', details: 'Created new Agency Admin for MoE', ipAddress: '192.168.1.10', severity: 'Info' },
    { id: 'LOG-002', timestamp: '2024-03-20 10:15:22', user: 'Tashi Wangmo', role: 'Agency Admin', agency: 'Ministry of Finance', action: 'Penalty Imposed', details: 'Imposed Late Filing fine on ID 11223344', ipAddress: '10.0.5.22', severity: 'Warning' },
    { id: 'LOG-003', timestamp: '2024-03-20 09:45:00', user: 'Dasho Pema', role: 'HoA', agency: 'Ministry of Finance', action: 'Report Approval', details: 'Approved Annual Compliance Report 2023', ipAddress: '10.0.5.50', severity: 'Critical' },
    { id: 'LOG-004', timestamp: '2024-03-19 16:20:10', user: 'Kinley Wangchuk', role: 'Declarant', agency: 'Ministry of Finance', action: 'Login', details: 'Successful login to declarant portal', ipAddress: '172.16.0.5', severity: 'Info' },
    { id: 'LOG-005', timestamp: '2024-03-19 14:10:00', user: 'ACC Admin', role: 'Admin', agency: 'ACC', action: 'Data Export', details: 'Exported encrypted asset data for FIU', ipAddress: '192.168.1.10', severity: 'Critical' },
    { id: 'LOG-006', timestamp: '2024-03-19 11:00:00', user: 'Tashi Wangmo', role: 'Agency Admin', agency: 'Ministry of Finance', action: 'Verification', details: 'Verified declaration DEC-2023-005', ipAddress: '10.0.5.22', severity: 'Info' },
];

interface AuditLogPageProps {
    userRole: UserRole;
}

const AuditLogPage: React.FC<AuditLogPageProps> = ({ userRole }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState('All');
    const [filterSeverity, setFilterSeverity] = useState('All');

    // Filter Logic
    const filteredLogs = mockLogs.filter(log => {
        // Role-based Access Control
        if (userRole === 'agency_admin') {
            if (log.agency !== 'Ministry of Finance') return false;
        }

        // Search
        const lowerSearch = searchQuery.toLowerCase();
        const matchesSearch = 
            log.user.toLowerCase().includes(lowerSearch) || 
            log.action.toLowerCase().includes(lowerSearch) ||
            log.details.toLowerCase().includes(lowerSearch);

        // Filters
        const matchesAction = filterAction === 'All' || log.action === filterAction;
        const matchesSeverity = filterSeverity === 'All' || log.severity === filterSeverity;

        return matchesSearch && matchesAction && matchesSeverity;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center">
                        <HistoryIcon className="w-8 h-8 mr-3" />
                        System Audit Trails
                    </h1>
                    <p className="text-text-secondary mt-1">Monitor system activities, security events, and user actions.</p>
                </div>
                <div className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm font-mono text-gray-600">
                    Total Records: {filteredLogs.length}
                </div>
            </div>

            {/* Stats (Optional Summary) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Critical Events (24h)" value={filteredLogs.filter(l => l.severity === 'Critical').length.toString()} subtitle="High Priority Actions" variant="danger" />
                <DashboardCard title="User Logins (24h)" value={filteredLogs.filter(l => l.action === 'Login').length.toString()} subtitle="Access Attempts" variant="primary" />
                <DashboardCard title="Data Modifications" value={filteredLogs.filter(l => ['Update', 'Delete', 'Penalty Imposed'].includes(l.action)).length.toString()} subtitle="Changes Recorded" variant="warning" />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="text-gray-400" /></div>
                    <input
                        type="text"
                        placeholder="Search logs by User, Action, or Details..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <select className="border border-gray-300 rounded-md py-2 px-3 text-sm" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                    <option value="All">All Severities</option>
                    <option value="Info">Info</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                </select>

                <select className="border border-gray-300 rounded-md py-2 px-3 text-sm" value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
                    <option value="All">All Actions</option>
                    <option value="Login">Login</option>
                    <option value="User Registration">Registration</option>
                    <option value="Penalty Imposed">Penalty</option>
                    <option value="Data Export">Data Export</option>
                    <option value="Verification">Verification</option>
                </select>
                
                <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 text-sm font-medium">Export Logs (CSV)</button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-200 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">User / Role</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">IP Address</th>
                            <th className="p-4 text-right">Severity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-gray-600 whitespace-nowrap">{log.timestamp}</td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{log.user}</div>
                                    <div className="text-xs text-gray-500">{log.role} • {log.agency}</div>
                                </td>
                                <td className="p-4 font-medium text-blue-700">{log.action}</td>
                                <td className="p-4 text-gray-700 max-w-xs truncate" title={log.details}>{log.details}</td>
                                <td className="p-4 font-mono text-xs text-gray-500">{log.ipAddress}</td>
                                <td className="p-4 text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        log.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                        log.severity === 'Warning' ? 'bg-orange-100 text-orange-800' :
                                        'bg-blue-50 text-blue-700'
                                    }`}>
                                        {log.severity}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 italic">No logs found matching your criteria.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogPage;