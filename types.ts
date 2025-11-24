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