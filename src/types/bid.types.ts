import type { Attachment } from './requirement.types';

export interface Bid {
  _id: string;
  requirement: string; // Will be populated with Requirement object from API
  bidder: string; // Will be populated with User object from API
  offeredPrice: number;
  deliveryDays?: number;
  notes: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface BidFormData {
  offeredPrice: number;
  deliveryDays?: number;
  notes?: string;
  attachments?: File[];
}

export interface BidStatistics {
  totalBids: number;
  lowestBid?: number;
  averageBid?: number;
  myBid?: Bid;
  timeRemaining?: number;
}
