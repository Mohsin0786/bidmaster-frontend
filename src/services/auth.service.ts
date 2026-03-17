import { apiClient } from '@/lib/api';
import { AuthResponse, User, UserRegistrationData } from '@/types/auth.types';

class AuthService {
  async login(firebaseToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', {
      firebaseToken,
    });
  }

  async register(userData: UserRegistrationData, firebaseToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  }

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
}

export const authService = new AuthService();