// pages/admin/CoIAlertsPage.tsx
import React, { useState, useEffect } from 'react';
import CoIAlertCard from '../../components/CoIAlertCard';
import CoIMitigationForm from '../../components/CoIMitigationForm';
import DashboardCard from '../../components/DashboardCard';
import WarningIcon from '../../components/icons/WarningIcon';
import { UserRole } from '../../types';

// Define proper interface - RENAME to avoid conflict
interface ConflictAlert {
  id: string;
  officialId: string;
  officialName: string;
  agency: string;
  schedule: string;
  category: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  trigger: string;
  evidence: string[];
  status: 'Flagged' | 'Reviewed' | 'Mitigated' | 'Escalated' | 'Resolved';
  assignedTo: 'ADA' | 'CADA' | 'Commission';
  createdAt: string;
}

interface CoIAlertsPageProps {
  userRole: UserRole;
  userAgency?: string; // Add user agency from context
}

// Mock data — move to top level
const mockConflictAlerts: ConflictAlert[] = [
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
      'Post-Employment Plan: "New Position: XYZ Bank, Advisor"',
      'XYZ Bank holds MoF Treasury Bond Dealer License #2023-45'
    ],
    status: 'Flagged',
    assignedTo: 'ADA',
    createdAt: '2024-03-18T14:20:00Z'
  }
];

const CoIAlertsPage: React.FC<CoIAlertsPageProps> = ({ 
  userRole, 
  userAgency = 'Ministry of Finance' // Default for now
}) => {
  const [alerts, setAlerts] = useState<ConflictAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMitigationOpen, setMitigationOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<ConflictAlert | null>(null);

  // 🛑 Prevent "official" users from accessing
  if (userRole === 'official') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-8 bg-red-50 border border-red-200 rounded-xl">
          <WarningIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-3">Access Restricted</h2>
          <p className="text-red-600 mb-4">
            Conflict of Interest alerts are only accessible to administrators.
          </p>
          <p className="text-sm text-red-500">
            If you believe this is an error, please contact the system administrator.
          </p>
        </div>
      </div>
    );
  }

  // Filter alerts by role
  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filtered = mockConflictAlerts;

      if (userRole === 'agency_admin') {
        filtered = filtered.filter(
          a => a.agency === userAgency && a.assignedTo === 'ADA'
        );
      } else if (userRole === 'hoa') {
        filtered = filtered.filter(a => a.agency === userAgency);
      }

      setAlerts(filtered);
      setIsLoading(false);
    };

    loadAlerts();
  }, [userRole, userAgency]);

  const handleAction = (alert: ConflictAlert, action: string) => {
    // Create a type-safe action handler
    const handleMitigate = () => {
      setSelectedAlert(alert);
      setMitigationOpen(true);
    };

    const handleReview = () => {
      setAlerts(alerts.map(a =>
        a.id === alert.id ? { ...a, status: 'Reviewed' } : a
      ));
      window.alert(`Review recorded for ${alert.officialName}.`); // Use window.alert
    };

    const handleClarify = () => {
      window.alert(`Clarification request sent to ${alert.officialName}.`); // Use window.alert
    };

    const handleEscalate = () => {
      const target = userRole === 'agency_admin' ? 'HoA/CADA' : 'Commission';
      window.alert(`${alert.officialName} escalated to ${target}.`); // Use window.alert
    };

    // Execute based on action
    switch (action) {
      case 'mitigate':
        handleMitigate();
        break;
      case 'review':
        handleReview();
        break;
      case 'clarify':
        handleClarify();
        break;
      case 'escalate':
        handleEscalate();
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const handleMitigationSubmit = (data: any) => {
    if (!selectedAlert) return;
    
    window.alert(`✅ Mitigation plan submitted for ${selectedAlert.officialName}:\n${data.steps}`);
    setMitigationOpen(false);

    setAlerts(alerts.map(a =>
      a.id === selectedAlert.id ? { ...a, status: 'Mitigated' } : a
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <WarningIcon className="text-red-600 w-8 h-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-text-main">
              Conflict of Interest Alerts
            </h1>
            <p className="text-text-secondary mt-1">
              Monitor and manage potential conflict of interest cases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-semibold">
            <span className="text-gray-600">Active alerts:</span>
            <span className="ml-2 text-primary font-bold">{alerts.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg 
              className="w-8 h-8 text-green-600" 
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
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No active CoI alerts
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            All conflict of interest cases are currently resolved or under control.
            New alerts will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {alerts.map(alert => (
            <CoIAlertCard
              key={alert.id}
              alert={alert}
              onAction={(action: string) => handleAction(alert, action)}
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
