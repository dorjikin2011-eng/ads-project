import React, { useState } from 'react';
import Modal from '../../components/Modal';

// Simple SVG Icons
const ScaleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowUpTrayIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentReportIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClipboardDocumentCheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

// Types and Interfaces
interface CaseBase {
  id: string;
  type: 'DA' | 'Penalty Waiver' | 'Non-Compliance';
  title: string;
  description: string;
  forwardedDate: string;
  status: 'Pending Review' | 'Decided';
  department: string;
}

interface DACase extends CaseBase {
  type: 'DA';
  originalDAId: string;
  officialName: string;
  officialId: string;
  disproportionateAmount: number;
  daPercentage: number;
  schedule: 'Schedule I' | 'Schedule II';
  declarationYear: number;
}

interface PenaltyWaiverCase extends CaseBase {
  type: 'Penalty Waiver';
  penaltyAmount: number;
  violationType: 'Late Declaration' | 'Non-Declaration' | 'Incomplete Declaration';
  declarantName: string;
  declarationYear: number;
  dueDate: string;
}

interface NonComplianceCase extends CaseBase {
  type: 'Non-Compliance';
  penaltyAmount: number;
  daysOverdue: number;
  declarantName: string;
  violationType: 'Late Declaration' | 'Non-Declaration' | 'Incomplete Declaration';
}

type CommissionCase = DACase | PenaltyWaiverCase | NonComplianceCase;

interface FileRecord {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
}

interface CommissionDecision {
  id: string;
  caseId: string;
  decisionDate: string;
  decision: string;
  remarks: string;
  decidedBy: string;
  files: FileRecord[];
}

// Mock Data for Commission Cases
const mockCommissionCases: CommissionCase[] = [
  // DA Cases
  {
    id: 'COM-DA-001',
    type: 'DA',
    originalDAId: 'DA-2024-001',
    title: 'Disproportionate Assets - Dasho Pema',
    description: 'High disproportionate assets (94.3% DA) requiring Commission decision',
    forwardedDate: '2024-01-15',
    status: 'Pending Review',
    department: 'Ministry of Finance',
    officialName: 'Dasho Pema',
    officialId: '99887766',
    disproportionateAmount: 6600000,
    daPercentage: 94.3,
    schedule: 'Schedule I',
    declarationYear: 2023
  },
  {
    id: 'COM-DA-002',
    type: 'DA',
    originalDAId: 'DA-2024-002',
    title: 'Assets Discrepancy - Mr. Karma Wangdi',
    description: 'Moderate disproportionate assets (86.7% DA) for Commission review',
    forwardedDate: '2024-01-18',
    status: 'Decided',
    department: 'Thimphu Thromde',
    officialName: 'Mr. Karma Wangdi',
    officialId: '11223344',
    disproportionateAmount: 2000000,
    daPercentage: 86.7,
    schedule: 'Schedule II',
    declarationYear: 2023
  },
  // Penalty Waiver Cases
  {
    id: 'COM-PW-001',
    type: 'Penalty Waiver',
    title: 'Penalty Waiver Request - ABC Corporation',
    description: 'Request for waiver of penalty for late declaration submission',
    forwardedDate: '2024-01-10',
    status: 'Pending Review',
    department: 'Revenue & Customs',
    penaltyAmount: 50000,
    violationType: 'Late Declaration',
    declarantName: 'ABC Corporation Ltd.',
    declarationYear: 2023,
    dueDate: '2023-12-31'
  },
  {
    id: 'COM-PW-002',
    type: 'Penalty Waiver',
    title: 'Penalty Waiver Request - Mr. Dorji',
    description: 'Request for waiver of penalty for non-declaration',
    forwardedDate: '2024-01-12',
    status: 'Decided',
    department: 'Business Licensing',
    penaltyAmount: 75000,
    violationType: 'Non-Declaration',
    declarantName: 'Mr. Dorji',
    declarationYear: 2023,
    dueDate: '2023-12-31'
  },
  // Non-Compliance Cases (failed to pay penalty)
  {
    id: 'COM-NC-001',
    type: 'Non-Compliance',
    title: 'Non-Payment of Penalty - XYZ Enterprises',
    description: 'Declarant failed to pay imposed penalty',
    forwardedDate: '2024-01-05',
    status: 'Pending Review',
    department: 'Ministry of Works',
    penaltyAmount: 25000,
    daysOverdue: 45,
    declarantName: 'XYZ Enterprises',
    violationType: 'Late Declaration'
  },
  {
    id: 'COM-NC-002',
    type: 'Non-Compliance',
    title: 'Non-Payment of Penalty - Officer Wangchuk',
    description: 'Official failed to pay penalty for incomplete declaration',
    forwardedDate: '2024-01-08',
    status: 'Decided',
    department: 'Procurement Department',
    penaltyAmount: 100000,
    daysOverdue: 60,
    declarantName: 'Mr. Wangchuk',
    violationType: 'Incomplete Declaration'
  }
];

// Mock Decisions
const mockDecisions: CommissionDecision[] = [
  {
    id: 'DEC-001',
    caseId: 'COM-DA-002',
    decisionDate: '2024-01-20',
    decision: 'Refer to DoI',
    remarks: 'Case referred to Department of Investigation for further investigation.',
    decidedBy: 'Commission Chairperson',
    files: [
      { id: '1', name: 'MoM-DA-002.pdf', size: '2.1 MB', type: 'PDF', uploadDate: '2024-01-20' }
    ]
  },
  {
    id: 'DEC-002',
    caseId: 'COM-PW-002',
    decisionDate: '2024-01-14',
    decision: 'Approve Partial Waiver',
    remarks: 'Penalty reduced by 50%. Declarant to submit declaration within 15 days.',
    decidedBy: 'Commission Secretary',
    files: [
      { id: '2', name: 'MoM-PW-002.pdf', size: '1.8 MB', type: 'PDF', uploadDate: '2024-01-14' }
    ]
  },
  {
    id: 'DEC-003',
    caseId: 'COM-NC-002',
    decisionDate: '2024-01-09',
    decision: 'Refer to RAA and IVS',
    remarks: 'Referred to RAA for record/follow-up and IVS for integrity vetting.',
    decidedBy: 'Commission Chairperson',
    files: [
      { id: '3', name: 'MoM-NC-002.pdf', size: '2.3 MB', type: 'PDF', uploadDate: '2024-01-09' }
    ]
  }
];

const CommissionDecisionsPage = () => {
  const [cases, setCases] = useState<CommissionCase[]>(mockCommissionCases);
  const [decisions, setDecisions] = useState<CommissionDecision[]>(mockDecisions);
  const [selectedCase, setSelectedCase] = useState<CommissionCase | null>(mockCommissionCases[0]);
  const [isDecisionModalOpen, setDecisionModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);
  const [filters, setFilters] = useState({
    type: 'All',
    status: 'All'
  });

  // Statistics
  const totalCases = cases.length;
  const pendingReviews = cases.filter(c => c.status === 'Pending Review').length;
  const decisionsTaken = decisions.length;
  
  // Case type statistics
  const daCases = cases.filter(c => c.type === 'DA').length;
  const penaltyWaiverCases = cases.filter(c => c.type === 'Penalty Waiver').length;
  const nonComplianceCases = cases.filter(c => c.type === 'Non-Compliance').length;

  // Filter cases based on active filters
  const filteredCases = cases.filter(caseItem => {
    if (filters.type !== 'All' && caseItem.type !== filters.type) return false;
    if (filters.status !== 'All' && caseItem.status !== filters.status) return false;
    return true;
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: FileRecord[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0]
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Handle decision submission
  const handleDecisionSubmit = (decisionData: Omit<CommissionDecision, 'id' | 'files'>) => {
    if (!selectedCase) return;

    const newDecision: CommissionDecision = {
      ...decisionData,
      id: `DEC-${Date.now()}`,
      files: uploadedFiles
    };

    setDecisions(prev => [...prev, newDecision]);
    
    // Update case status
    setCases(prev => prev.map(c => 
      c.id === selectedCase.id ? { ...c, status: 'Decided' as const } : c
    ));

    setDecisionModalOpen(false);
    setUploadedFiles([]);
  };

  // Get case type icon
  const getCaseTypeIcon = (type: string) => {
    switch(type) {
      case 'DA': return <ScaleIcon />;
      case 'Penalty Waiver': return <DocumentTextIcon />;
      case 'Non-Compliance': return <ExclamationCircleIcon />;
      default: return <FolderIcon />;
    }
  };

  // Get case type description
  const getCaseTypeDescription = (type: string) => {
    switch(type) {
      case 'DA': return 'DA Case';
      case 'Penalty Waiver': return 'Penalty Waiver Request';
      case 'Non-Compliance': return 'Non-Compliance Case';
      default: return 'Case Review';
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Decided': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return "Nu. " + amount.toLocaleString();
  };

  // Handle file removal
  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="p-6">
      {/* Decision Recording Modal */}
      <Modal
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setDecisionModalOpen(false);
          setUploadedFiles([]);
        }}
        title="Record Commission Decision"
      >
        <DecisionForm
          selectedCase={selectedCase}
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onDecisionSubmit={handleDecisionSubmit}
          onRemoveFile={handleRemoveFile}
        />
      </Modal>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ClipboardDocumentCheckIcon />
          <span className="ml-3">Commission Decisions</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Record Commission decisions and upload Minutes of Meeting
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          title="Total Cases"
          value={totalCases}
          icon={<FolderIcon />}
          color="blue"
          description="All cases pending Commission decision"
        />
        <DashboardCard
          title="Pending Review"
          value={pendingReviews}
          icon={<ClockIcon />}
          color="yellow"
          description="Awaiting Commission decision"
        />
        <DashboardCard
          title="Decisions Taken"
          value={decisionsTaken}
          icon={<CheckCircleIcon />}
          color="green"
          description="Commission decisions recorded"
        />
        <DashboardCard
          title="DA Cases"
          value={daCases}
          icon={<ScaleIcon />}
          color="purple"
          description="Disproportionate assets cases"
        />
        <DashboardCard
          title="Penalty Waivers"
          value={penaltyWaiverCases}
          icon={<DocumentTextIcon />}
          color="blue"
          description="Penalty waiver requests"
        />
        <DashboardCard
          title="Non-Compliance"
          value={nonComplianceCases}
          icon={<ExclamationCircleIcon />}
          color="red"
          description="Failed to pay penalty cases"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          {/* Filters */}
          <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-3">
            <select 
              className="border rounded px-3 py-2 text-sm"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="All">All Types</option>
              <option value="DA">DA Cases</option>
              <option value="Penalty Waiver">Penalty Waiver</option>
              <option value="Non-Compliance">Non-Compliance</option>
            </select>

            <select 
              className="border rounded px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="All">All Status</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Decided">Decided</option>
            </select>

            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredCases.length} of {totalCases} cases
            </div>
          </div>

          {/* Cases List */}
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {filteredCases.map(caseItem => {
              const caseDecision = decisions.find(d => d.caseId === caseItem.id);
              return (
                <div
                  key={caseItem.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedCase?.id === caseItem.id ? 'bg-blue-50 border-l-4 border-primary' : ''}`}
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded ${
                        caseItem.type === 'DA' ? 'bg-purple-100 text-purple-600' :
                        caseItem.type === 'Penalty Waiver' ? 'bg-blue-100 text-blue-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {getCaseTypeIcon(caseItem.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 truncate">{caseItem.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 gap-2 mt-1 flex-wrap">
                          <span className="font-medium">{getCaseTypeDescription(caseItem.type)}</span>
                          <span>•</span>
                          <span className="truncate">{caseItem.department}</span>
                          <span>•</span>
                          <span>Forwarded: {caseItem.forwardedDate}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {caseItem.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                      {caseDecision && (
                        <span className="text-xs text-green-600 font-medium text-right">
                          Decided: {caseDecision.decision}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredCases.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No cases found matching the selected filters.
              </div>
            )}
          </div>
        </div>

        {/* Case Details & Decision Panel */}
        <div className="bg-white rounded-lg shadow h-fit sticky top-24">
          {selectedCase ? (
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Case Details</h2>
                  <p className="text-sm text-gray-500">{selectedCase.id}</p>
                </div>
                <button
                  onClick={() => setDecisionModalOpen(true)}
                  disabled={selectedCase.status === 'Decided'}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    selectedCase.status === 'Decided'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  Record Decision
                </button>
              </div>

              {/* Case Information */}
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">Case Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Case Type</p>
                      <p className="font-medium">{getCaseTypeDescription(selectedCase.type)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className={`font-medium ${getStatusBadgeClass(selectedCase.status)} inline-block px-2 py-0.5 rounded-full`}>
                        {selectedCase.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Forwarded Date</p>
                      <p className="font-medium">{selectedCase.forwardedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium">{selectedCase.department}</p>
                    </div>
                  </div>
                </div>

                {/* Type-Specific Details */}
                {selectedCase.type === 'DA' && (
                  <div className="p-3 bg-purple-50 rounded">
                    <h3 className="font-semibold text-purple-700 mb-2 text-sm">DA Case Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-purple-600">Official Name</p>
                        <p className="font-medium truncate">{(selectedCase as DACase).officialName}</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Official ID</p>
                        <p className="font-medium">{(selectedCase as DACase).officialId}</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Disproportionate Amount</p>
                        <p className="font-medium text-red-600 truncate">
                          {formatCurrency((selectedCase as DACase).disproportionateAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-600">DA Percentage</p>
                        <p className="font-medium">{(selectedCase as DACase).daPercentage}%</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Schedule</p>
                        <p className="font-medium">{(selectedCase as DACase).schedule}</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Declaration Year</p>
                        <p className="font-medium">{(selectedCase as DACase).declarationYear}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedCase.type === 'Penalty Waiver' && (
                  <div className="p-3 bg-blue-50 rounded">
                    <h3 className="font-semibold text-blue-700 mb-2 text-sm">Penalty Waiver Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-blue-600">Declarant Name</p>
                        <p className="font-medium truncate">{(selectedCase as PenaltyWaiverCase).declarantName}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Violation Type</p>
                        <p className="font-medium">{(selectedCase as PenaltyWaiverCase).violationType}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Penalty Amount</p>
                        <p className="font-medium text-red-600 truncate">
                          {formatCurrency((selectedCase as PenaltyWaiverCase).penaltyAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-600">Declaration Year</p>
                        <p className="font-medium">{(selectedCase as PenaltyWaiverCase).declarationYear}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-blue-600">Due Date</p>
                        <p className="font-medium">{(selectedCase as PenaltyWaiverCase).dueDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedCase.type === 'Non-Compliance' && (
                  <div className="p-3 bg-red-50 rounded">
                    <h3 className="font-semibold text-red-700 mb-2 text-sm">Non-Compliance Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-red-600">Declarant Name</p>
                        <p className="font-medium truncate">{(selectedCase as NonComplianceCase).declarantName}</p>
                      </div>
                      <div>
                        <p className="text-red-600">Violation Type</p>
                        <p className="font-medium">{(selectedCase as NonComplianceCase).violationType}</p>
                      </div>
                      <div>
                        <p className="text-red-600">Penalty Amount</p>
                        <p className="font-medium text-red-600 truncate">
                          {formatCurrency((selectedCase as NonComplianceCase).penaltyAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-red-600">Days Overdue</p>
                        <p className="font-medium">{(selectedCase as NonComplianceCase).daysOverdue} days</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-red-600">Commission Action</p>
                        <p className="font-medium">Refer to RAA and/or IVS</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Decisions */}
                {(() => {
                  const caseDecisions = decisions.filter(d => d.caseId === selectedCase.id);
                  if (caseDecisions.length === 0) return null;
                  
                  return (
                    <div className="p-3 bg-green-50 rounded">
                      <h3 className="font-semibold text-green-700 mb-2 text-sm">Commission Decisions</h3>
                      {caseDecisions.map(decision => (
                        <div key={decision.id} className="mb-3 last:mb-0 p-2 bg-white rounded border text-xs">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-green-600 truncate">{decision.decision}</span>
                            <span className="text-gray-500 whitespace-nowrap">{decision.decisionDate}</span>
                          </div>
                          <p className="text-gray-600 mb-2 line-clamp-2">{decision.remarks}</p>
                          <div>
                            <p className="text-gray-500 mb-1">Attached Files:</p>
                            <div className="space-y-1">
                              {decision.files.map(file => (
                                <div key={file.id} className="flex items-center">
                                  <DocumentTextIcon />
                                  <span className="ml-1 truncate">{file.name}</span>
                                  <span className="ml-auto text-gray-500 whitespace-nowrap">{file.size}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-400 mt-2">
                            Decided by: {decision.decidedBy}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-gray-400">
              <ClipboardDocumentCheckIcon />
              <p className="mt-3 text-center text-sm">Select a case to view details and record decisions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'red';
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, description }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <div className={`p-2 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Decision Form Component
interface DecisionFormProps {
  selectedCase: CommissionCase | null;
  uploadedFiles: FileRecord[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDecisionSubmit: (decisionData: Omit<CommissionDecision, 'id' | 'files'>) => void;
  onRemoveFile: (fileId: string) => void;
}

const DecisionForm: React.FC<DecisionFormProps> = ({ 
  selectedCase, 
  uploadedFiles, 
  onFileUpload, 
  onDecisionSubmit,
  onRemoveFile 
}) => {
  const [decision, setDecision] = useState('');
  const [remarks, setRemarks] = useState('');
  const [decidedBy, setDecidedBy] = useState('Commission Chairperson');
  const [decisionDate, setDecisionDate] = useState(new Date().toISOString().split('T')[0]);

  const getDecisionOptions = (caseType: string) => {
    switch(caseType) {
      case 'DA':
        return [
          { value: 'Refer to DoI', label: 'Refer to DoI (Investigation)' },
          { value: 'Refer to DARe', label: 'Refer to DARe (Intelligence Gathering)' },
          { value: 'Drop Case', label: 'Drop Case' },
          { value: 'Keep in Watch List', label: 'Keep in Watch List' }
        ];
      case 'Penalty Waiver':
        return [
          { value: 'Approve Full Waiver', label: 'Approve Full Waiver' },
          { value: 'Approve Partial Waiver', label: 'Approve Partial Waiver' },
          { value: 'Reject Waiver', label: 'Reject Waiver' },
          { value: 'Approve with Conditions', label: 'Approve with Conditions' }
        ];
      case 'Non-Compliance':
        return [
          { value: 'Refer to RAA', label: 'Refer to RAA (Record/Follow-up)' },
          { value: 'Refer to IVS', label: 'Refer to IVS (Integrity Vetting)' },
          { value: 'Refer to RAA and IVS', label: 'Refer to RAA and IVS' },
          { value: 'Issue Warning', label: 'Issue Warning' },
          { value: 'Take Legal Action', label: 'Take Legal Action' }
        ];
      default:
        return [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
          { value: 'Modify', label: 'Modify' },
          { value: 'Refer Back', label: 'Refer Back' }
        ];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    
    onDecisionSubmit({
      caseId: selectedCase.id,
      decisionDate,
      decision,
      remarks,
      decidedBy
    });

    // Reset form
    setDecision('');
    setRemarks('');
    setDecidedBy('Commission Chairperson');
    setDecisionDate(new Date().toISOString().split('T')[0]);
  };

  const decisionOptions = selectedCase ? getDecisionOptions(selectedCase.type) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-3 rounded mb-3">
        <p className="text-sm font-medium text-blue-800">Recording decision for:</p>
        <p className="font-bold">{selectedCase?.title}</p>
        <p className="text-sm text-blue-600">Case ID: {selectedCase?.id} • Type: {getCaseTypeDescription(selectedCase?.type || '')}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission Decision *
          </label>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          >
            <option value="">Select a decision</option>
            {decisionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {selectedCase?.type === 'DA' && 'Commission decision on disproportionate assets case'}
            {selectedCase?.type === 'Penalty Waiver' && 'Commission decision on penalty waiver request'}
            {selectedCase?.type === 'Non-Compliance' && 'Commission decision on non-payment of penalty'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks / Instructions *
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter detailed remarks, instructions, or conditions for the decision..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decided By *
            </label>
            <select
              value={decidedBy}
              onChange={(e) => setDecidedBy(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            >
            
              <option value="Commissioner In-charge">Commissioner In-charge</option>
              <option value="Director">Director</option>
              <option value="Commission">Commission</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decision Date *
            </label>
            <input
              type="date"
              value={decisionDate}
              onChange={(e) => setDecisionDate(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Minutes of Meeting *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
            <div className="w-10 h-10 mx-auto text-gray-400 mb-2">
              <ArrowUpTrayIcon />
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Upload scanned Minutes of Meeting
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Only PDF files are accepted for official records
            </p>
            <input
              type="file"
              onChange={onFileUpload}
              multiple
              className="hidden"
              id="file-upload"
              accept=".pdf"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark cursor-pointer"
            >
              <ArrowUpTrayIcon />
              <span className="ml-1">Upload PDF</span>
            </label>
          </div>
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="border rounded p-3">
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Files to be uploaded:</h4>
            <div className="space-y-1">
              {uploadedFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs">
                  <div className="flex items-center truncate">
                    <DocumentTextIcon />
                    <div className="ml-2 truncate">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-gray-500">{file.size} • {file.type}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(file.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-3">
          <button
            type="button"
            onClick={() => {
              setDecision('');
              setRemarks('');
              setDecidedBy('Commission Chairperson');
              setDecisionDate(new Date().toISOString().split('T')[0]);
            }}
            className="px-3 py-1.5 border rounded text-gray-700 text-sm hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-primary text-white rounded text-sm font-medium hover:bg-primary-dark"
          >
            Record Commission Decision
          </button>
        </div>
      </div>
    </form>
  );
};

// Helper function to get case type description
const getCaseTypeDescription = (type: string) => {
  switch(type) {
    case 'DA': return 'DA Case';
    case 'Penalty Waiver': return 'Penalty Waiver Request';
    case 'Non-Compliance': return 'Non-Compliance Case';
    default: return 'Case Review';
  }
};

export default CommissionDecisionsPage;

