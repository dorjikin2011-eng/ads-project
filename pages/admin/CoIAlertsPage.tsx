// pages/admin/CoIAlertsPage.tsx
import React, { useState } from 'react';
import CoIAlertCard from '../../components/CoIAlertCard';
import CoIMitigationForm from '../../components/CoIMitigationForm';
import DashboardCard from '../../components/DashboardCard';
import WarningIcon from '../../components/icons/WarningIcon';
import { UserRole } from '../../types';

// Mock data — replace with real API later
const mockCoIAlerts = [
  {
    id: 'COI-001',
    officialId: '99887766',
    officialName: 'Dasho Pema',
    agency: 'Ministry of Finance',
    schedule: 'Schedule I',
    category: 'Outside Employment',
    riskLevel: 'High',
    trigger: 'Spouse employed at ABC Construction (vendor to MoF)',
    evidence: [
      'Family: Spouse @ ABC Construction (Procurement Officer)',
      'MoF Vendor Registry: ABC in 2024 Contract #MOF-2024-101'
    ],
    status: 'Flagged',
    assignedTo: 'CADA',
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 'COI-002',
    officialId: '55667788',
    officialName: 'Mr. Tashi Wangmo',
    agency: 'Ministry of Finance',
    schedule: 'Schedule II',
    category: 'Post-Employment',
    riskLevel: 'Medium',
    trigger: 'Plans to join XYZ Bank (regulated by MoF)',
    evidence: [
      'Post-Employment Plan: “New Position: XYZ Bank, Advisor”',
      'XYZ Bank holds MoF Treasury Bond Dealer License #2023-45'
    ],
    status: 'Flagged',
    assignedTo: 'ADA',
    createdAt: '2024-03-18T14:20:00Z'
  }
];

interface CoIAlertsPageProps {
  userRole: UserRole;
}

const CoIAlertsPage: React.FC<CoIAlertsPageProps> = ({ userRole }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isMitigationOpen, setMitigationOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  // 🛑 Prevent "official" users from accessing this page
  if (userRole === 'official') {
    return (
      <div className="p-10 text-center text-red-700 font-semibold text-lg">
        Access Denied — Officials cannot view Conflict of Interest Alerts.
      </div>
    );
  }

  // Filter mock alerts by role
  React.useEffect(() => {
    let filtered = mockCoIAlerts;

    if (userRole === 'agency_admin') {
      filtered = filtered.filter(
        a => a.agency === 'Ministry of Finance' && a.assignedTo === 'ADA'
      );
    } else if (userRole === 'hoa') {
      filtered = filtered.filter(a => a.agency === 'Ministry of Finance');
    }

    setAlerts(filtered);
  }, [userRole]);

  const handleAction = (alert: any, action: string) => {
    switch (action) {
      case 'mitigate':
        setSelectedAlert(alert);
        setMitigationOpen(true);
        break;

      case 'review':
        setAlerts(alerts.map(a =>
          a.id === alert.id ? { ...a, status: 'Reviewed' } : a
        ));
        alert(`Review recorded for ${alert.officialName}.`);
        break;

      case 'clarify':
        alert(`Clarification request sent to ${alert.officialName}.`);
        break;

      case 'escalate':
        const target = userRole === 'agency_admin' ? 'HoA/CADA' : 'Commission';
        alert(`${alert.officialName} escalated to ${target}.`);
        break;
    }
  };

  const handleMitigationSubmit = (data: any) => {
    alert(`✅ Mitigation plan submitted for ${selectedAlert.officialName}:\n${data.steps}`);
    setMitigationOpen(false);

    setAlerts(alerts.map(a =>
      a.id === selectedAlert.id ? { ...a, status: 'Mitigated' } : a
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-main flex items-center">
          <WarningIcon className="text-red-600 w-8 h-8 mr-3" />
          Conflict of Interest Alerts
        </h1>

        <div className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm font-mono">
          {alerts.length} active alerts
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="High Risk"
          value={alerts.filter(a => a.riskLevel === 'High').length.toString()}
          subtitle="Immediate action required"
          variant="danger"
        />
        <DashboardCard
          title="Medium Risk"
          value={alerts.filter(a => a.riskLevel === 'Medium').length.toString()}
          subtitle="Review within 7 days"
          variant="warning"
        />
        <DashboardCard
          title="Mitigated"
          value={alerts.filter(a => a.status === 'Mitigated').length.toString()}
          subtitle="Resolved cases"
          variant="success"
        />
      </div>

      {/* Alerts */}
      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No active CoI alerts</h3>
          <p className="text-gray-600 mt-2">All conflicts are resolved or under control.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {alerts.map(alert => (
            <CoIAlertCard
              key={alert.id}
              alert={alert}
              onAction={action => handleAction(alert, action)}
              userRole={userRole}
            />
          ))}
        </div>
      )}

      {/* Mitigation Form Modal */}
      {selectedAlert && (
        <CoIMitigationForm
          isOpen={isMitigationOpen}
          onClose={() => setMitigationOpen(false)}
          onSubmit={handleMitigationSubmit}
          officialName={selectedAlert.officialName}
        />
      )}
    </div>
  );
};

export default CoIAlertsPage;
