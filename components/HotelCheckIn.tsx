'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Clock, Smartphone, Shield, User, MapPin, Sparkles, Wifi, Scan, Building2, Loader2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPingOneAccessToken, generateQRCode } from '@/lib/api';
import { showToast } from './ui/toast';
import { useVerificationPolling } from '@/hooks/useVerificationPolling';
import type { QRCodeResponse, NormalizedStatus, VerificationStatusResponse } from '@/types/api';

interface CheckInStep {
  id: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
  actor: string;
}

export function HotelCheckIn() {
  const [currentStep, setCurrentStep] = useState(1);

  const [verificationData, setVerificationData] = useState<{
    name?: string;
    address?: string;
    age?: string;
    verified?: boolean;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<QRCodeResponse | null>(null);

  // Polling hook for verification status - always call the hook but with current data
  const hasRequiredData = accessToken && qrCodeData?.rawResponse?.environment?.id && qrCodeData?.sessionId && qrCodeData?.rawResponse?.expiresAt;
  
  const {
    status: verificationStatus,
    isLoading: isPolling,
    error: pollingError,
    startPolling,
    reset: resetPolling
  } = useVerificationPolling({
    accessToken: accessToken || '',
    environmentId: qrCodeData?.rawResponse?.environment?.id || '',
    sessionId: qrCodeData?.sessionId || '',
    expiresAt: qrCodeData?.rawResponse?.expiresAt || '',
    onStatusChange: handleVerificationStatusChange,
    onError: handlePollingError
  });

  // Debug logging for polling data
  useEffect(() => {
    if (qrCodeData) {
      console.log('Polling hook data:', {
        accessToken: !!accessToken,
        environmentId: qrCodeData.rawResponse?.environment?.id,
        sessionId: qrCodeData.sessionId,
        expiresAt: qrCodeData.rawResponse?.expiresAt,
        hasRequiredData,
        verificationStatus
      });
    }
  }, [qrCodeData, accessToken, hasRequiredData, verificationStatus]);

  // Auto-start polling when required data becomes available
  useEffect(() => {
    if (hasRequiredData && verificationStatus === 'pending' && !isPolling) {
      console.log('Auto-starting polling with available data...');
      startPolling();
    }
  }, [hasRequiredData, verificationStatus, isPolling, startPolling]);

  const steps: CheckInStep[] = [
    { id: 1, title: 'Generate QR Code', status: currentStep >= 1 ? 'completed' : 'pending', actor: 'Hotel System' },
    { id: 2, title: 'QR Code Display', status: currentStep >= 2 ? 'completed' : 'pending', actor: 'Hotel System' },
    { id: 3, title: 'App Redirect', status: currentStep >= 3 ? 'completed' : 'pending', actor: 'NatWest App' },
    { id: 4, title: 'VC Verification', status: currentStep >= 4 ? 'completed' : 'pending', actor: 'Hotel System' },
    { id: 5, title: 'Check-in Complete', status: currentStep >= 5 ? 'completed' : 'pending', actor: 'Hotel System' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle verification status changes
  function handleVerificationStatusChange(
    status: NormalizedStatus, 
    data: VerificationStatusResponse, 
    userInfo?: {
      firstName?: string;
      lastName?: string;
      fullName?: string;
      street?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      birthdate?: string;
      age?: number;
    }
  ) {
    console.log('Verification status changed:', status, data);
    console.log('User info received:', userInfo);
    
    switch (status) {
      case 'scanned':
        setCurrentStep(3);
        showToast('success', 'QR Code scanned! Please approve in your app.', 4000);
        break;
      case 'approved':
        // Set verification data with actual user information if available
        if (userInfo) {
          setVerificationData({
            name: userInfo.fullName || `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'User',
            address: userInfo.address || `${userInfo.street || ''} ${userInfo.city || ''} ${userInfo.postalCode || ''}`.trim() || 'Address not available',
            age: userInfo.age ? `${userInfo.age}` : 'Age not available',
            verified: true
          });
          console.log('✅ Verification data populated with user info:', userInfo);
        } else {
          // Fallback to default data if no user info available
          setVerificationData({
            name: 'User',
            address: 'Address not available',
            age: 'Age not available',
            verified: true
          });
          console.log('⚠️ No user info available, using fallback data');
        }
        
        // Start progressive step-by-step flow through verification steps
        startProgressiveVerification();
        break;
      case 'declined':
        showToast('error', 'Verification declined by user. Please try again.', 6000);
        break;
      case 'expired':
        showToast('error', 'QR Code expired. Please generate a new one.', 6000);
        break;
      case 'failed':
        showToast('error', 'Verification failed. Please try again.', 6000);
        break;
      case 'timeout':
        showToast('error', 'Verification timeout. Please try again.', 6000);
        break;
      default:
        console.log('Unhandled status:', status, 'Raw status:', data.status);
        break;
    }
  }

  // Progressive verification flow through steps 3-5
  const startProgressiveVerification = () => {
    showToast('success', 'Verification successful! Processing credentials...', 4000);
    
    // Progress through each step with 2-second delays
    const progressSteps = () => {
      setCurrentStep(3);
      
      setTimeout(() => {
        setCurrentStep(4);
        showToast('success', 'VC verification in progress', 2000);
      }, 2000);
      
      setTimeout(() => {
        setCurrentStep(5);
        showToast('success', 'Check-in complete! Welcome to The Grand Hotel.', 6000);
      }, 4000);
    };
    
    progressSteps();
  };

  // Handle polling errors
  function handlePollingError(error: Error) {
    console.error('Polling error:', error);
    showToast('error', `Polling error: ${error.message}`, 4000);
  }

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    
    try {
      // Step 1: Get access token from PingOne
      console.log('Getting access token from PingOne...');
      const tokenResponse = await getPingOneAccessToken();
      setAccessToken(tokenResponse.access_token);
      
      console.log('Successfully obtained access token:', {
        token_type: tokenResponse.token_type,
        expires_in: tokenResponse.expires_in,
        scope: tokenResponse.scope
      });
      
      showToast('success', 'Successfully authenticated with PingOne!', 4000);
      
      // Step 2: Generate QR code via presentation request
      console.log('Creating presentation request to generate QR code...');
      const qrResponse = await generateQRCode(tokenResponse.access_token);
      setQrCodeData(qrResponse);
      
      console.log('Successfully generated QR code:', {
        sessionId: qrResponse.sessionId,
        status: qrResponse.status,
        qrCodeUrl: qrResponse.qrCodeUrl,
        rawResponse: qrResponse.rawResponse
      });
      
      showToast('success', 'QR Code generated successfully!', 4000);
      
      // Move to next step
      setCurrentStep(2);
      
      // Start polling immediately after QR is shown
      // Only start if we have all required data
      if (qrResponse.rawResponse?.environment?.id && qrResponse.sessionId && qrResponse.rawResponse.expiresAt) {
        console.log('Starting polling with:', {
          environmentId: qrResponse.rawResponse.environment.id,
          sessionId: qrResponse.sessionId,
          expiresAt: qrResponse.rawResponse.expiresAt
        });
        
        // Start polling if the hook is ready
        if (hasRequiredData) {
          console.log('Starting polling immediately...');
          startPolling();
        } else {
          console.log('Polling hook not ready yet, will start on next render');
        }
      } else {
        console.error('Missing required data for polling:', {
          environmentId: qrResponse.rawResponse?.environment?.id,
          sessionId: qrResponse.sessionId,
          expiresAt: qrResponse.rawResponse?.expiresAt
        });
      }
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showToast('error', `Failed to generate QR code: ${errorMessage}`, 6000);
      
      // Log detailed error for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleRefreshQR = () => {
    resetPolling();
    setQrCodeData(null);
    setCurrentStep(1);
    handleGenerateQR();
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      
      if (currentStep === 4) {
        setVerificationData({
          name: 'John Smith',
          address: '123 Main Street, London, UK',
          age: '25+',
          verified: true
        });
      }
    }
  };

  const getStepIcon = (step: CheckInStep) => {
    if (step.status === 'completed') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (step.status === 'active') return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100" />;
  };

  // Get status display text and icon
  const getStatusDisplay = () => {
    switch (verificationStatus) {
      case 'pending':
        return {
          text: 'Waiting for scan...',
          icon: <Clock className="w-6 h-6 text-blue-500 animate-pulse" />,
          color: 'text-blue-500'
        };
      case 'scanned':
        return {
          text: 'QR scanned. Approve in your app...',
          icon: <Smartphone className="w-6 h-6 text-yellow-500" />,
          color: 'text-yellow-500'
        };
      case 'approved':
        return {
          text: 'Verified!',
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          color: 'text-green-500'
        };
      case 'declined':
        return {
          text: 'User rejected. Try again?',
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          color: 'text-red-500'
        };
      case 'expired':
        return {
          text: 'QR expired. Refresh to continue.',
          icon: <AlertCircle className="w-6 h-6 text-orange-500" />,
          color: 'text-orange-500'
        };
      case 'failed':
        return {
          text: 'Verification failed. Please retry.',
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          color: 'text-red-500'
        };
      case 'timeout':
        return {
          text: 'Verification timeout. Please retry.',
          icon: <AlertCircle className="w-6 h-6 text-orange-500" />,
          color: 'text-orange-500'
        };
      default:
        return {
          text: 'Ready for scan',
          icon: <Scan className="w-6 h-6 text-blue-500" />,
          color: 'text-blue-500'
        };
    }
  };

  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Card className="w-full max-w-lg text-center shadow-2xl border-0 bg-white/80 backdrop-blur-md">
            <CardHeader className="pb-6">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <CardTitle className="text-3xl text-emerald-700 mb-2">Check-in Successful!</CardTitle>
              <CardDescription className="text-lg text-gray-600">Welcome to The Grand Hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">Verified Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">{verificationData?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">{verificationData?.address}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">Age: {verificationData?.age}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <p className="text-blue-800 font-medium">
                  🗝️ Your digital room key has been activated
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Room 237 • Floor 2 • Executive Suite
                </p>
              </div>
              
              <Button 
                onClick={() => {
                  setCurrentStep(1);
                  setVerificationData(null);
                  setAccessToken(null);
                  setQrCodeData(null);
                  resetPolling();
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                Start New Check-in
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Kiosk Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">The Grand Hotel</h1>
                <p className="text-blue-200">Digital Identity Check-in Terminal</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-xl font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-blue-200 text-sm">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Main Interface */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">
                        Step {currentStep}: {steps[currentStep - 1]?.title}
                      </CardTitle>
                      <CardDescription className="text-blue-200 text-lg">
                        {steps[currentStep - 1]?.actor}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                      <Wifi className="w-4 h-4 mr-2" />
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-6"
                      >
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                          <Scan className="w-16 h-16 text-white" />
                        </div>
                        <div className="text-white">
                          <h3 className="text-2xl font-bold mb-3">Welcome to Digital Check-in</h3>
                          <p className="text-blue-200 text-lg mb-6">Click the button below to generate your secure QR code and begin the check-in process</p>
                        </div>
                        
                        {accessToken && (
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                            <p className="text-green-300 text-sm">
                              ✅ PingOne authentication successful
                            </p>
                          </div>
                        )}
                        
                        <Button 
                          onClick={handleGenerateQR}
                          disabled={isGeneratingQR}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingQR ? (
                            <>
                              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                              Authenticating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 mr-3" />
                              Generate QR Code
                            </>
                          )}
                        </Button>
                        
                        {isGeneratingQR && (
                          <div className="text-blue-200 text-sm">
                            <p>🔐 Authenticating with PingOne...</p>
                            <p>📱 Creating presentation request...</p>
                            <p>🔄 Generating secure QR code...</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-6"
                      >
                        {/* Status Display - only show when we have required data */}
                        {hasRequiredData && (
                          <div className="flex items-center justify-center gap-3 mb-4">
                            {getStatusDisplay().icon}
                            <span className={`text-lg font-semibold ${getStatusDisplay().color}`}>
                              {getStatusDisplay().text}
                            </span>
                          </div>
                        )}

                        {/* Polling Status - always visible */}
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 text-blue-300">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Checking verification status...</span>
                          </div>
                        </div>

                        {/* Error Display - only show when we have required data */}
                        {hasRequiredData && pollingError && (
                          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-red-300">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">Error: {pollingError.message}</span>
                            </div>
                          </div>
                        )}

                        <div className="w-64 h-64 bg-white/95 rounded-3xl shadow-2xl mx-auto flex items-center justify-center border-4 border-gray-200">
                          {qrCodeData?.qrCodeUrl ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <img 
                                src={qrCodeData.qrCodeUrl} 
                                alt="Secure QR Code" 
                                className="w-full h-full object-contain rounded-3xl"
                                onError={(e) => {
                                  console.error('Failed to load QR code image:', e);
                                  showToast('error', 'Failed to load QR code image', 4000);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-black mx-auto rounded-2xl flex items-center justify-center shadow-lg">
                                <div className="grid grid-cols-8 gap-1">
                                  {Array.from({ length: 64 }).map((_, i) => (
                                    <motion.div 
                                      key={i} 
                                      className={`w-1 h-1 rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}
                                      animate={{ opacity: [0.3, 1, 0.3] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 font-medium">QR Code Loading...</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons - only show when we have required data */}
                        {hasRequiredData && (
                          <div className="flex gap-3 justify-center">
                            {verificationStatus === 'expired' && (
                              <Button 
                                onClick={handleRefreshQR}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh QR
                              </Button>
                            )}
                            
                            {verificationStatus === 'declined' && (
                              <Button 
                                onClick={handleRefreshQR}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                              </Button>
                            )}
                            
                            {verificationStatus === 'approved' && (
                              <Button 
                                onClick={() => setCurrentStep(3)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <Smartphone className="w-5 h-4 mr-2" />
                                Continue to Next Step
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {/* Session Info */}
                        {qrCodeData?.rawResponse && (
                          <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-3 mt-4">
                            <div className="text-gray-300 text-xs space-y-1">
                              <p>Session ID: {qrCodeData.sessionId}</p>
                              <p>Expires: {new Date(qrCodeData.rawResponse.expiresAt).toLocaleTimeString()}</p>
                              <p>Environment: {qrCodeData.rawResponse.environment.id}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {currentStep >= 3 && currentStep <= 4 && (
                      <motion.div
                        key="step3-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-6"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
                        >
                          <Shield className="w-10 h-10 text-white" />
                        </motion.div>
                        <div className="text-white">
                          <h3 className="text-xl font-semibold mb-2">{steps[currentStep - 1]?.title}</h3>
                          <p className="text-blue-200 mb-6">Secure verification in progress...</p>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep - 2) / 3) * 100}%` }}
                          />
                        </div>
                        <Button 
                          onClick={handleNextStep}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Continue to Next Step
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Credentials Display */}
            <AnimatePresence>
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Verifiable Credentials</CardTitle>
                      <CardDescription className="text-blue-200">Information being verified</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <motion.div 
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-emerald-300" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">Address Proof</p>
                              <p className="text-emerald-200 text-sm">NatWest Verified</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-500/50">
                            Verified
                          </Badge>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-300" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">Age Verification</p>
                              <p className="text-blue-200 text-sm">Government Issued</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/30 text-blue-200 border-blue-500/50">
                            Verified
                          </Badge>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Progress Flow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl h-fit">
              <CardHeader>
                <CardTitle className="text-xl text-white">Check-in Progress</CardTitle>
                <CardDescription className="text-blue-200">Digital ID verification workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <motion.div 
                      key={step.id} 
                      className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex-shrink-0">
                        {getStepIcon(step)}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold transition-colors ${
                          step.status === 'completed' ? 'text-emerald-300' :
                          step.status === 'active' ? 'text-blue-300' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400">{step.actor}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs transition-colors ${
                          step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          step.status === 'active' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}
                      >
                        {step.status === 'completed' ? 'Done' :
                         step.status === 'active' ? 'Active' : 'Pending'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}