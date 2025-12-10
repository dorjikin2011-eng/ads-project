// components/CoIAlertCard.tsx
import React from 'react';
import WarningIcon from './icons/WarningIcon';

interface CoIAlertCardProps {
  alert: {
    id: string;
    officialName: string;
    agency: string;
    category: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    trigger: string;
    evidence: string[];
    status: string;
    assignedTo: string;
    createdAt: string;
  };
  onAction: (action: 'review' | 'clarify' | 'mitigate' | 'escalate') => void;
  userRole: 'agency_admin' | 'hoa' | 'admin';
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'High': return 'border-l-4 border-red-500 bg-red-50';
    case 'Medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
    case 'Low': return 'border-l-4 border-orange-500 bg-orange-50';
    default: return 'border-l-4 border-gray-300 bg-gray-50';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Flagged': return 'bg-yellow-100 text-yellow-800';
    case 'Reviewed': return 'bg-blue-100 text-blue-800';
    case 'Mitigated': return 'bg-green-100 text-green-800';
    case 'Escalated': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CoIAlertCard: React.FC<CoIAlertCardProps> = ({ alert, onAction, userRole }) => {
  return (
    <div className={`rounded-lg border shadow-sm p-4 ${getRiskColor(alert.riskLevel)}`}>
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-gray-900">{alert.officialName}</h3>
          <p className="text-sm text-gray-600">{alert.agency} • {alert.category}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusBadge(alert.status)}`}>
          {alert.status}
        </span>
      </div>
      
      <div className="mt-2">
        <div className="flex items-start gap-2">
          <WarningIcon className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium text-red-700">{alert.trigger}</p>
        </div>
        
        {alert.evidence.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            <p className="font-semibold">Evidence:</p>
            <ul className="list-disc pl-4 space-y-1">
              {alert.evidence.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
        <button 
          onClick={() => onAction('review')}
          className="text-xs font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
        >
          Review
        </button>
        
        {userRole === 'agency_admin' && (
          <>
            <button 
              onClick={() => onAction('clarify')}
              className="text-xs font-medium text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50"
            >
              Request Clarification
            </button>
            <button 
              onClick={() => onAction('mitigate')}
              className="text-xs font-medium text-purple-600 border border-purple-200 px-3 py-1.5 rounded hover:bg-purple-50"
            >
              Submit Mitigation Plan
            </button>
          </>
        )}
        
        {(userRole === 'agency_admin' || userRole === 'hoa') && (
          <button 
            onClick={() => onAction('escalate')}
            className="text-xs font-medium text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50"
          >
            Escalate to {userRole === 'agency_admin' ? 'HoA/CADA' : 'Commission'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CoIAlertCard;