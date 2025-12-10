// types/coi.ts

export type CoICategory = 
  | 'Outside Employment' 
  | 'Post-Employment' 
  | 'Asset-Decision Linkage';

export type CoIRiskLevel = 'Low' | 'Medium' | 'High';

export type CoIStatus = 'Flagged' | 'Reviewed' | 'Mitigated' | 'Escalated';

export type CoIAssignedTo = 'ADA' | 'HoA' | 'CADA';

export interface CoIAlert {
  id: string;
  officialId: string;
  officialName: string;
  agency: string;
  schedule: 'Schedule I' | 'Schedule II';
  category: CoICategory;
  riskLevel: CoIRiskLevel;
  trigger: string;
  evidence: string[];
  status: CoIStatus;
  assignedTo: CoIAssignedTo;
  createdAt: string; // ISO string
  resolvedAt?: string;
  mitigationPlan?: {
    nature: string;
    steps: string;
    timeline: string;
    attachments?: string[];
  };
}