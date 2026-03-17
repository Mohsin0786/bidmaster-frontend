import { apiClient } from '@/lib/api';
import { Requirement, RequirementFormData, PaginatedResponse } from '@/types';

class RequirementService {
  async createRequirement(data: RequirementFormData): Promise<Requirement> {
    const formData = new FormData();
    
    // Append requirement data
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'attachments' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append('attachments', file);
          }
        });
      } else if (key === 'participants' && Array.isArray(value)) {
        formData.append('participants', JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return apiClient.uploadFile<Requirement>('/requirements', formData);
  }

  async updateRequirement(id: string, data: Partial<RequirementFormData>): Promise<Requirement> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'attachments' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) {
            formData.append('attachments', file);
          }
        });
      } else if (key === 'participants' && Array.isArray(value)) {
        formData.append('participants', JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return apiClient.uploadFile<Requirement>(`/requirements/${id}`, formData);
  }

  async getRequirements(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Requirement>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return apiClient.get<PaginatedResponse<Requirement>>(`/requirements?${queryParams}`);
  }

  async getRequirement(id: string): Promise<Requirement> {
    return apiClient.get<Requirement>(`/requirements/${id}`);
  }

  async deleteRequirement(id: string): Promise<void> {
    return apiClient.delete(`/requirements/${id}`);
  }

  async activateRequirement(id: string): Promise<Requirement> {
    return apiClient.patch<Requirement>(`/requirements/${id}`, {
      status: 'ACTIVE'
    });
  }

  async closeRequirement(id: string): Promise<Requirement> {
    return apiClient.patch<Requirement>(`/requirements/${id}`, {
      status: 'CLOSED'
    });
  }
}

export const requirementService = new RequirementService();