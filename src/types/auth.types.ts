export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  gstNo: string;
  designation: string;
  industry: string;
  profilePic?: {
    key: string;
    url: string;
  };
  dob: string;
  firebaseUid: string;
  firebaseSignInProvider: string;
  roles: UserRole[];
  appNotificationsLastSeenAt: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isEmailVerified: boolean;
  preferences: {
    notificationEnabled: boolean;
    locationShared: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'Buyer' | 'Seller' | 'Admin';

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  pincode: string;
  gstNo: string;
  designation: string;
  industry: string;
  dob: string;
  profilePic?: File;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}