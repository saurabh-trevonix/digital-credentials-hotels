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
    appOpenUrl: {
      href: string;
    };
    self: {
      href: string;
    };
    [key: string]: any;
  };
  createdAt: string;
  expiresAt: string;
  environment: {
    id: string;
  };
  applicationInstance: {
    id: string;
  };
  [key: string]: any;
}

export interface QRCodeResponse {
  qrCodeUrl: string;
  sessionId: string;
  status: string;
  rawResponse?: PresentationResponse; // Store the full response for polling
}

// Verification status types for polling
export type VerificationStatus = 
  | 'INITIAL'           // QR displayed, waiting for scan
  | 'SCANNED'           // QR scanned, waiting for approval
  | 'APPROVED'          // Credentials shared successfully
  | 'DECLINED'          // User rejected on device
  | 'EXPIRED'           // Session expired
  | 'FAILED'            // Any terminal error
  | 'TIMEOUT';          // Polling timeout

export interface VerificationStatusResponse {
  id: string;
  status: VerificationStatus;
  createdAt: string;
  expiresAt: string;
  environment: {
    id: string;
  };
  applicationInstance: {
    id: string;
  };
  _links: {
    self: {
      href: string;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

// Normalized status for frontend
export type NormalizedStatus = 
  | 'pending'           // Waiting for scan
  | 'scanned'           // QR scanned, approve in app
  | 'approved'          // Verification successful
  | 'declined'          // User rejected
  | 'expired'           // Session expired
  | 'failed'            // Terminal error
  | 'timeout';          // Polling timeout
