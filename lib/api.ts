// API utilities for PingOne integration
import type { 
  PingOneTokenResponse, 
  PresentationRequest, 
  PresentationResponse, 
  QRCodeResponse,
  VerificationStatusResponse,
  CredentialDataResponse,
  FlattenedCredentialData
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
    protocol: 'OPENID4VP',
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

  // Build issuerFilter dynamically from config to avoid unintended failures
  const configuredFilter = API_CONFIG.pingOne.issuerFilter || {};
  const dids = (configuredFilter.dids || []).filter(Boolean);
  const envIds = (configuredFilter.environmentIds || []).filter(Boolean);

  if (dids.length > 0 || envIds.length > 0) {
    presentationRequest.issuerFilter = {};
    if (dids.length > 0) {
      presentationRequest.issuerFilter.dids = dids;
    }
    if (envIds.length > 0) {
      presentationRequest.issuerFilter.environmentIds = envIds;
    }
  }

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
    
    if (!data.id) {
      throw new Error('Invalid presentation response: missing session ID');
    }
    
    if (!data.environment?.id) {
      throw new Error('Invalid presentation response: missing environment ID');
    }
    
    if (!data.expiresAt) {
      throw new Error('Invalid presentation response: missing expiry time');
    }

    console.log('Validated presentation response:', {
      id: data.id,
      environmentId: data.environment.id,
      expiresAt: data.expiresAt,
      status: data.status
    });

    return {
      qrCodeUrl: data._links.qr.href,
      sessionId: data.id,
      status: data.status,
      rawResponse: data // Store the full response for polling
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

// QR Code generation using presentation request
export async function generateQRCode(accessToken: string): Promise<QRCodeResponse> {
  try {
    console.log('Generating QR code...');
    const qrResponse = await createPresentationRequest(accessToken);
    
    console.log('QR code generated successfully:', {
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

// Get credential data when verification is successful
export async function getCredentialData(
  accessToken: string, 
  environmentId: string, 
  credentialVerificationId: string
): Promise<CredentialDataResponse> {
  const credentialUrl = `${API_CONFIG.pingOne.apiPath}/environments/${environmentId}/presentationSessions/${credentialVerificationId}/credentialData`;
  
  // Log the request details for debugging
  console.log('dY"? Fetching credential data with:', {
    url: credentialUrl,
    environmentId,
    credentialVerificationId,
    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'undefined'
  });
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUTS.pingOne);

    const response = await fetch(credentialUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('�?O Credential data request failed:', {
        status: response.status,
        statusText: response.statusText,
        url: credentialUrl,
        responseText: errorText
      });
      throw new Error(`Credential data request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Log the raw response for debugging
    console.log('dY"� Raw credential data response:', JSON.stringify(data, null, 2));
    
    // More flexible validation - check for different possible response structures
    const hasValidStructure = 
      (data.sessionData?.credentialsDataList) ||
      (data.status === 'VERIFICATION_SUCCESSFUL') ||
      (data.credentials) ||
      (data.payload?.credentials) ||
      (data.output?.credentials);
    
    if (!hasValidStructure) {
      console.error('�?O Invalid credential data response structure:', {
        receivedData: data,
        expectedPaths: [
          'sessionData.credentialsDataList',
          'status === VERIFICATION_SUCCESSFUL',
          'credentials',
          'payload.credentials',
          'output.credentials'
        ],
        actualKeys: Object.keys(data),
        sessionDataKeys: data.sessionData ? Object.keys(data.sessionData) : 'undefined',
        hasValidStatus: data.status === 'VERIFICATION_SUCCESSFUL'
      });
      throw new Error('Invalid credential data response: missing required fields. Check console for response structure details.');
    }

    console.log('�o. Credential data response validation passed');
    return data as CredentialDataResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('�?� Credential data request timed out after', API_TIMEOUTS.pingOne, 'ms');
        throw new Error('Credential data request timed out');
      }
      console.error('�?O Error in getCredentialData:', error.message);
      throw new Error(`Failed to get credential data: ${error.message}`);
    }
    console.error('�?O Unknown error in getCredentialData:', error);
    throw new Error('Failed to get credential data: Unknown error');
  }
}
// Flatten credential data into the required format
export function flattenCredentialData(credentialData: CredentialDataResponse): FlattenedCredentialData {
  const flattenedData: FlattenedCredentialData = {};
  
  try {
    console.log('ðŸ”„ Flattening credential data from structure:', {
      hasSessionData: !!credentialData.sessionData,
      hasCredentialsDataList: !!credentialData.sessionData?.credentialsDataList,
      credentialsCount: credentialData.sessionData?.credentialsDataList?.length || 0
    });
    
    // Extract credentials from the actual response structure
    const credentials = credentialData.sessionData?.credentialsDataList || [];
    
    if (credentials.length === 0) {
      console.warn('âš ï¸ No credentials found in sessionData.credentialsDataList');
      console.log('ðŸ” Available keys in credentialData:', Object.keys(credentialData));
      return {};
    }
    
    console.log(`ðŸ“Š Processing ${credentials.length} credentials:`, credentials);
    
    credentials.forEach((credential, index) => {
      console.log(`ðŸ” Processing credential ${index + 1}:`, credential);
      
      // Use the credential type as the key
      const credentialName = credential.type || `credential_${index}`;
      
      if (credentialName) {
        // Convert the data array to a key-value object
        const dataObject: Record<string, string> = {};
        credential.data.forEach(item => {
          if (item.key && item.value !== undefined) {
            dataObject[item.key] = item.value;
          }
        });
        
        // Extract user information from the data
        const userInfo = extractUserInfo(dataObject);
        
        flattenedData[credentialName] = {
          id: credential.issuerApplicationInstanceId || '',
          type: credential.type || '',
          verificationStatus: credential.verificationStatus || '',
          issuerName: credential.issuerName || '',
          issuerId: credential.issuerId || '',
          data: dataObject,
          userInfo
        };
        
        console.log(`âœ… Flattened credential "${credentialName}":`, flattenedData[credentialName]);
        console.log(`ðŸ‘¤ Extracted user info:`, userInfo);
      } else {
        console.warn(`âš ï¸ Skipping credential ${index + 1} - no type found:`, credential);
      }
    });
    
    console.log('ðŸŽ¯ Final flattened credential data:', flattenedData);
    return flattenedData;
  } catch (error) {
    console.error('âŒ Error flattening credential data:', error);
    console.error('ðŸ” Credential data that caused error:', credentialData);
    return {};
  }
}

// Extract user information from credential data
function extractUserInfo(data: Record<string, string>) {
  const userInfo: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    street?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    birthdate?: string;
    age?: number;
  } = {};
  
  try {
    // Extract name information
    userInfo.firstName = data['First Name'] || data['firstName'] || '';
    userInfo.lastName = data['Last Name'] || data['lastName'] || '';
    
    // Create full name
    if (userInfo.firstName && userInfo.lastName) {
      userInfo.fullName = `${userInfo.firstName} ${userInfo.lastName}`;
    } else if (userInfo.firstName) {
      userInfo.fullName = userInfo.firstName;
    } else if (userInfo.lastName) {
      userInfo.fullName = userInfo.lastName;
    }
    
    // Extract address information
    userInfo.street = data['Street'] || data['street'] || '';
    userInfo.city = data['City'] || data['city'] || '';
    userInfo.postalCode = data['Postal Code'] || data['postalCode'] || '';
    
    // Create full address
    const addressParts = [userInfo.street, userInfo.city, userInfo.postalCode].filter(Boolean);
    if (addressParts.length > 0) {
      userInfo.address = addressParts.join(', ');
    }
    
    // Extract birthdate and calculate age
    const birthdateStr = data['Birthdate'] || data['birthdate'] || '';
    if (birthdateStr) {
      userInfo.birthdate = birthdateStr;
      try {
        const birthDate = new Date(birthdateStr);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          userInfo.age = age - 1;
        } else {
          userInfo.age = age;
        }
      } catch {
        console.warn('âš ï¸ Could not parse birthdate:', birthdateStr);
      }
    }
    
    console.log('ðŸ‘¤ Extracted user information:', userInfo);
    return userInfo;
  } catch (error) {
    console.error('âŒ Error extracting user info:', error);
    return userInfo;
  }
}

// Check verification status for polling
export async function checkVerificationStatus(
  accessToken: string, 
  environmentId: string, 
  sessionId: string
): Promise<{
  verificationStatus: VerificationStatusResponse;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    birthdate?: string;
    age?: number;
  };
}> {
  const statusUrl = `${API_CONFIG.pingOne.apiPath}/environments/${environmentId}/presentationSessions/${sessionId}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUTS.pingOne);

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status check failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: VerificationStatusResponse = await response.json();
    
    // Validate response structure
    if (!data.id || !data.status) {
      throw new Error('Invalid status response: missing required fields');
    }

    let extractedUserInfo: {
      firstName?: string;
      lastName?: string;
      fullName?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      birthdate?: string;
      age?: number;
    } | undefined = undefined;

    // If verification is successful, fetch credential data in parallel
    if (data.status === 'VERIFICATION_SUCCESSFUL') {
      console.log('ðŸŽ‰ Verification successful! Fetching credential data...');
      console.log('ðŸ“‹ Session details:', {
        sessionId: data.id,
        environmentId: data.environment?.id,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt
      });
      
      // Make parallel call to get credential data
      getCredentialData(accessToken, environmentId, sessionId)
        .then((credentialResponse) => {
          console.log('âœ… Credential data API call successful');
          console.log('ðŸ“¥ Credential data API response:', credentialResponse);
          
          // Check if we got VERIFICATION_SUCCESSFUL from the credential data
          const verificationStatus = credentialResponse.status || 
                                   'Status not found in expected location';
          console.log('ðŸ” Credential verification status:', verificationStatus);
          
          // Flatten the credential data
          const flattenedCredentialData = flattenCredentialData(credentialResponse);
          console.log('ðŸ“Š Flattened credential data:', flattenedCredentialData);
          
          // Log the flattened data in the required format
          console.log('ðŸŽ¯ Credential data in required format:');
          if (Object.keys(flattenedCredentialData).length === 0) {
            console.warn('âš ï¸ No credentials were flattened - check the response structure above');
          } else {
            Object.entries(flattenedCredentialData).forEach(([credentialName, data]) => {
              console.log(`ðŸ“‹ ${credentialName}:`, {
                id: data.id,
                type: data.type,
                verificationStatus: data.verificationStatus,
                issuerName: data.issuerName,
                issuerId: data.issuerId,
                data: data.data
              });
            });
          }
        })
        .catch((error) => {
          console.error('âŒ Error fetching credential data:', error);
          console.error('ðŸ” Error details:', {
            message: error.message,
            stack: error.stack,
            sessionId,
            environmentId,
            hasAccessToken: !!accessToken
          });
        });

      // Also fetch credential data synchronously to return user info
      try {
        const credentialResponse = await getCredentialData(accessToken, environmentId, sessionId);
        const flattenedCredentialData = flattenCredentialData(credentialResponse);
        
        // Extract user info from the first credential
        const firstCredential = Object.values(flattenedCredentialData)[0];
        if (firstCredential?.userInfo) {
          extractedUserInfo = firstCredential.userInfo;
          console.log('ðŸ‘¤ Extracted user info for UI:', extractedUserInfo);
        }
      } catch (credentialError) {
        console.error('âŒ Error fetching credential data for UI:', credentialError);
      }
    }

    return {
      verificationStatus: data,
      userInfo: extractedUserInfo
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Status check request timed out');
      }
      throw new Error(`Failed to check verification status: ${error.message}`);
    }
    throw new Error('Failed to check verification status: Unknown error');
  }
}
