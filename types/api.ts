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

// PingOne Presentation Request types
export interface PresentationRequest {
  message: string;
  protocol: 'NATIVE';
  digitalWalletApplication: {
    id: string;
  };
  requestedCredentials: Array<{
    type: string;
    keys: string[];
  }>;
}

export interface PresentationResponse {
  id: string;
  status: string;
  _links: {
    qr: {
      href: string;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface QRCodeResponse {
  qrCodeUrl: string;
  sessionId: string;
  status: string;
}
