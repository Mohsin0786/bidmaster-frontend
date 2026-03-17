export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface SocketEvents {
  // Client to Server
  'join-requirement': { requirementId: string };
  'leave-requirement': { requirementId: string };
  'new-bid': { requirementId: string; bid: any }; // Use any to avoid circular dependency
  
  // Server to Client
  'bid-update': { requirementId: string; bid: any; statistics: any }; // Use any to avoid circular dependency
  'requirement-status-change': { requirementId: string; status: string };
  'bidding-ended': { requirementId: string; winningBid?: any }; // Use any to avoid circular dependency
  'user-joined': { requirementId: string; userId: string };
}