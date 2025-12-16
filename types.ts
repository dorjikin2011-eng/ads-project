export enum DeclarationStatus {
  SUBMITTED = 'Submitted',
  PENDING = 'Pending Review',
  APPROVED = 'Approved',
  FLAGGED = 'Flagged for Review',
  REJECTED = 'Rejected'
}

export type UserRole = 'official' | 'admin' | 'agency_admin' | 'hoa';

export interface Declaration {
  id?: string;
  officialName?: string;
  officialId?: string;
  year: number;
  type: string;
  submissionDate: string;
  status: DeclarationStatus;
  riskScore?: 'Low' | 'Medium' | 'High';
  schedule?: 'Schedule I' | 'Schedule II';
  agency?: string;
}
// --- Commission Decision Types ---
export type DecisionType = 
  | 'DA_Case' 
  | 'Penalty_Waiver' 
  | 'Non_Declarant_Escalation';

export type DecisionStatus = 'Pending Commission' | 'Approved' | 'Rejected' | 'Modified';

export type ReferralType = 'DARe' | 'DoI' | 'RAA' | 'IVS';

// types.ts
export interface DACase {
  id: string;
  name: string;
  officialId: string;
  agency: string;
  schedule: 'Schedule I' | 'Schedule II';
  totalAssets: number;
  totalLiabilities: number;
  totalIncome: number;
  totalExpenditure: number;
  disproportion: number;
  daPercentage: number;
  status: string;
}

export interface CommissionDecision {
  id: string;
  caseId: string;           // e.g., 'DA-2024-001', 'PEN-24-001'
  officialId: string;
  officialName: string;
  agency: string;
  schedule: 'Schedule I' | 'Schedule II';
  type: DecisionType;
  title: string;            // e.g., "DA Case: Dasho Pema (Nu. 6.6M)"
  summary: string;          // CADA's recommendation (auto-filled)
  commissionDecision: string; // formal directive text
  status: DecisionStatus;
  decidedAt?: string;       // ISO date (only if status ≠ 'Pending Commission')
  decidedBy?: string;       // e.g., "ACC Commission – 15 Dec 2024"
  momFile?: {
    name: string;           // e.g., "ACC_MOM_2024-12-15.pdf"
    url: string;            // e.g., "/uploads/mom/ACC_MOM_2024-12-15.pdf"
    uploadedAt: string;
  };
  referrals?: ReferralType[];
  referralJustifications?: {
    DARe?: string;
    DoI?: string;
    RAA?: string;
    IVS?: string;
  };
  createdAt: string;
   // ✅ ADD THIS
  isNew?: boolean;
}