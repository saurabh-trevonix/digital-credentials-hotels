// API utilities for PingOne integration
import type { PingOneTokenResponse, ApiError } from '@/types/api';
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

// QR Code generation placeholder (to be implemented with PingDaVinci)
export async function generateQRCode(accessToken: string): Promise<string> {
  // This is a placeholder - in real implementation, you would call PingDaVinci API
  // For now, we'll simulate a successful QR generation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('qr-code-data-placeholder');
    }, 1000);
  });
}
