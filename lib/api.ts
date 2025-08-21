// API utilities for PingOne integration
import type { 
  PingOneTokenResponse, 
  ApiError, 
  PresentationRequest, 
  PresentationResponse, 
  QRCodeResponse 
} from '@/types/api';
import { API_CONFIG, API_TIMEOUTS } from '@/lib/config';

// Generic typed fetch utility
export async function fetchJson<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error('API request failed: Unknown error');
  }
}

// PingOne API functions
export async function getPingOneAccessToken(): Promise<PingOneTokenResponse> {
  const tokenUrl = `${API_CONFIG.pingOne.baseUrl}/${API_CONFIG.pingOne.environmentId}/as/token`;
  
  const formData = new URLSearchParams();
  formData.append('client_id', API_CONFIG.pingOne.clientId);
  formData.append('client_secret', API_CONFIG.pingOne.clientSecret);
  formData.append('grant_type', 'client_credentials');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUTS.pingOne);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PingOne token request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.access_token) {
      throw new Error('Invalid token response: missing access_token');
    }

    return data as PingOneTokenResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('PingOne token request timed out');
      }
      throw new Error(`Failed to get PingOne access token: ${error.message}`);
    }
    throw new Error('Failed to get PingOne access token: Unknown error');
  }
}

// Create presentation request to generate QR code
export async function createPresentationRequest(
  accessToken: string, 
  message: string = "Please present your Digital ID for hotel check-in"
): Promise<QRCodeResponse> {
  const presentationUrl = `${API_CONFIG.pingOne.apiPath}/environments/${API_CONFIG.pingOne.environmentId}/presentationSessions`;
  
  const presentationRequest: PresentationRequest = {
    message,
    protocol: 'NATIVE',
    digitalWalletApplication: {
      id: '428b26a1-8833-43de-824b-f1ed336c6245'
    },
    requestedCredentials: [
      {
        type: 'Your Digital ID from NatWest',
        keys: []
      }
    ]
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUTS.pingOne);

    const response = await fetch(presentationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(presentationRequest),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Presentation request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: PresentationResponse = await response.json();
    
    // Validate response structure
    if (!data._links?.qr?.href) {
      throw new Error('Invalid presentation response: missing QR code URL');
    }

    return {
      qrCodeUrl: data._links.qr.href,
      sessionId: data.id,
      status: data.status
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Presentation request timed out');
      }
      throw new Error(`Failed to create presentation request: ${error.message}`);
    }
    throw new Error('Failed to create presentation request: Unknown error');
  }
}

// QR Code generation using PingOne presentation request
export async function generateQRCode(accessToken: string): Promise<QRCodeResponse> {
  try {
    console.log('Creating presentation request to generate QR code...');
    const qrResponse = await createPresentationRequest(accessToken);
    
    console.log('Successfully generated QR code:', {
      sessionId: qrResponse.sessionId,
      status: qrResponse.status,
      qrCodeUrl: qrResponse.qrCodeUrl
    });
    
    return qrResponse;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}
