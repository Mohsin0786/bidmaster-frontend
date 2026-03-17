export interface Requirement {
  _id: string;
  title: string;
  description: string;
  category?: string;
  attachments: Attachment[];
  currency: string;
  ceilingPrice: number;
  minDecrement: number;
  startTime: string;
  endTime: string;
  participants: Participant[];
  status: RequirementStatus;
  createdBy: string; // Will be populated with User object from API
  winningBid?: string; // Will be populated with Bid object from API
  createdAt: string;
  updatedAt: string;
}

export type RequirementStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'AWARDED';

export interface Participant {
  email: string;
  userId?: string;
  status: 'INVITED' | 'JOINED';
}

export interface Attachment {
  key: string;
  url: string;
}

export interface RequirementFormData {
  title: string;
  description: string;
  category?: string;
  attachments?: File[];
  currency: string;
  ceilingPrice: number;
  minDecrement: number;
  startTime: string;
  endTime: string;
  participants?: string[]; // email addresses
  status: RequirementStatus;
}
