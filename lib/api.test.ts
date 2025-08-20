// Simple test file for API functions
// This can be run with: npx tsx lib/api.test.ts

import { getPingOneAccessToken, generateQRCode } from './api';

async function testPingOneIntegration() {
  console.log('🧪 Testing PingOne API Integration...\n');

  try {
    // Test 1: Get access token
    console.log('1️⃣ Testing PingOne access token retrieval...');
    const tokenResponse = await getPingOneAccessToken();
    
    console.log('✅ Successfully obtained access token:');
    console.log(`   Token Type: ${tokenResponse.token_type}`);
    console.log(`   Expires In: ${tokenResponse.expires_in} seconds`);
    console.log(`   Scope: ${tokenResponse.scope}`);
    console.log(`   Access Token: ${tokenResponse.access_token.substring(0, 20)}...\n`);

    // Test 2: Generate QR code
    console.log('2️⃣ Testing QR code generation...');
    const qrData = await generateQRCode(tokenResponse.access_token);
    
    console.log('✅ Successfully generated QR code:');
    console.log(`   QR Data: ${qrData}\n`);

    console.log('🎉 All tests passed! PingOne integration is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testPingOneIntegration();
}

export { testPingOneIntegration };
