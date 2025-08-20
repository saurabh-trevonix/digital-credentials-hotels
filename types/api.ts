// API types and interfaces

export interface PingOneTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface QRCodeData {
  id: string;
  data: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'used';
}

export interface CheckInSession {
  id: string;
  qrCodeId: string;
  accessToken: string;
  createdAt: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
}
