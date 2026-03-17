import { apiClient } from '@/lib/api';
import { User, UserRegistrationData } from '@/types/auth.types';

class UserService {
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/users/me');
  }

  async updateProfile(userData: Partial<UserRegistrationData>): Promise<User> {
    const formData = new FormData();
    
    Object.entries(userData).forEach(([key, value]) => {
      if (key === 'profilePic' && value instanceof File) {
        formData.append('profilePic', value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return apiClient.uploadFile<User>('/users/updateDetails', formData);
  }

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }
}

export const userService = new UserService();