import { apiClient } from '@/lib/api';
import { Bid, BidFormData, PaginatedResponse } from '@/types';

class BidService {
  async createBid(requirementId: string, data: BidFormData): Promise<Bid> {
    const formData = new FormData();
    
    formData.append('requirement', requirementId);
    formData.append('offeredPrice', data.offeredPrice.toString());
    
    if (data.deliveryDays) {
      formData.append('deliveryDays', data.deliveryDays.toString());
    }
    
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    return apiClient.uploadFile<Bid>('/bids', formData);
  }

  async getBids(params?: {
    requirementId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Bid>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return apiClient.get<PaginatedResponse<Bid>>(`/bids?${queryParams}`);
  }

  async getBid(id: string): Promise<Bid> {
    return apiClient.get<Bid>(`/bids/${id}`);
  }

  async getMyBids(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Bid>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return apiClient.get<PaginatedResponse<Bid>>(`/bids/my-bids?${queryParams}`);
  }

  async updateBid(id: string, data: Partial<BidFormData>): Promise<Bid> {
    const formData = new FormData();
    
    if (data.offeredPrice) {
      formData.append('offeredPrice', data.offeredPrice.toString());
    }
    
    if (data.deliveryDays) {
      formData.append('deliveryDays', data.deliveryDays.toString());
    }
    
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    return apiClient.uploadFile<Bid>(`/bids/${id}`, formData);
  }

  async deleteBid(id: string): Promise<void> {
    return apiClient.delete(`/bids/${id}`);
  }

  async acceptBid(bidId: string): Promise<Bid> {
    return apiClient.patch<Bid>(`/bids/${bidId}/accept`);
  }

  async rejectBid(bidId: string): Promise<Bid> {
    return apiClient.patch<Bid>(`/bids/${bidId}/reject`);
  }
}

export const bidService = new BidService();