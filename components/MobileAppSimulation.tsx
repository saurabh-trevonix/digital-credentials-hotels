'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  Smartphone, 
  Fingerprint, 
  Shield, 
  User, 
  MapPin, 
  CheckCircle, 
  Lock,
  ArrowRight,
  Wifi,
  Battery,
  Signal,
  Bell,
  X,
  ChevronLeft,
  Eye,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileAppSimulationProps {
  onComplete: (data: any) => void;
}

export function MobileAppSimulation({ onComplete }: MobileAppSimulationProps) {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedVCs, setSelectedVCs] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);

  const verifiableCredentials = [
    {
      id: 'address',
      title: 'Address Proof',
      issuer: 'NatWest Bank',
      details: '123 Main Street, London, UK',
      icon: <MapPin className="w-6 h-6" />,
      required: true,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'age',
      title: 'Age Verification',
      issuer: 'HM Government',
      details: 'Age: 25+ verified',
      icon: <User className="w-6 h-6" />,
      required: true,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      id: 'identity',
      title: 'Identity Document',
      issuer: 'HM Passport Office',
      details: 'Passport verification',
      icon: <Shield className="w-6 h-6" />,
      required: false,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    }
  ];

  const handleVCSelection = (vcId: string) => {
    setSelectedVCs(prev => 
      prev.includes(vcId) 
        ? prev.filter(id => id !== vcId)
        : [...prev, vcId]
    );
  };

  const handleShare = () => {
    const sharedData = {
      credentials: selectedVCs,
      timestamp: new Date().toISOString(),
      consent: consentGiven
    };
    onComplete(sharedData);
  };

  const renderStatusBar = () => (
    <div className="flex justify-between items-center px-6 py-2 text-white text-sm">
      <div className="flex items-center gap-1">
        <span className="font-medium">9:41</span>
      </div>
      <div className="flex items-center gap-1">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 space-y-8"
          >
            <div className="text-center pt-8">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h3>
              <p className="text-gray-600">Sign in to continue to NatWest</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Smith</p>
                    <p className="text-gray-500 text-sm">john.smith@email.com</p>
                  </div>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => setCurrentScreen('biometric')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-2xl shadow-lg transition-all duration-300"
                >
                  <Eye className="w-5 h-5 mr-3" />
                  Continue with Face ID
                </Button>
              </motion.div>
              
              <button className="w-full text-purple-600 py-2 text-sm font-medium">
                Use different account
              </button>
            </div>
          </motion.div>
        );

      case 'biometric':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 space-y-8"
          >
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setCurrentScreen('login')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">Face ID</h3>
              <div className="w-10"></div>
            </div>
            
            <div className="text-center space-y-8">
              <motion.div 
                className="relative mx-auto"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <ScanLine className="w-16 h-16 text-white" />
                  </motion.div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 scale-110 animate-pulse delay-150"></div>
              </motion.div>
              
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Biometric Verification</h4>
                <p className="text-gray-600">Look directly at your camera to verify your identity</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-center gap-3 text-blue-700">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Eye className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium">Scanning your face...</span>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => setCurrentScreen('vcSelection')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl shadow-lg transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 mr-3" />
                Verification Successful
              </Button>
            </motion.div>
          </motion.div>
        );

      case 'vcSelection':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center px-6 py-4">
              <button 
                onClick={() => setCurrentScreen('biometric')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">Share Credentials</h3>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="px-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-900">The Grand Hotel</h4>
                </div>
                <p className="text-blue-700 text-sm">
                  Requesting access to verify your identity for check-in
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Select credentials to share:</h4>
                {verifiableCredentials.map((vc) => (
                  <motion.div 
                    key={vc.id}
                    className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      selectedVCs.includes(vc.id) 
                        ? 'border-blue-500 bg-gradient-to-r ' + vc.bgGradient + ' shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                    onClick={() => handleVCSelection(vc.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${vc.gradient} flex items-center justify-center shadow-lg`}>
                        <div className="text-white">
                          {vc.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{vc.title}</p>
                          {vc.required && (
                            <Badge className="bg-red-100 text-red-700 text-xs px-2 py-1">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{vc.details}</p>
                        <p className="text-gray-500 text-xs">Issued by {vc.issuer}</p>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          checked={selectedVCs.includes(vc.id)}
                          onChange={() => handleVCSelection(vc.id)}
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="consent"
                    checked={consentGiven}
                    onCheckedChange={(checked) => setConsentGiven(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="consent" className="text-amber-800 text-sm leading-relaxed">
                    I consent to sharing the selected information with The Grand Hotel for check-in purposes. 
                    This data will be used only for identity verification and will not be stored permanently.
                  </label>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleShare}
                  disabled={selectedVCs.length === 0 || !consentGiven}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Share Selected Credentials
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </motion.div>
              
              <div className="h-8"></div> {/* Bottom spacing for safe area */}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* iPhone-style container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Phone Frame */}
        <div className="bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-inner">
            {/* Status Bar */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600">
              {renderStatusBar()}
            </div>
            
            {/* App Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Smartphone className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-white font-bold text-lg">NatWest</h2>
                  <p className="text-purple-100 text-sm">Digital ID Wallet</p>
                </div>
              </div>
            </div>
            
            {/* Screen Content */}
            <div className="bg-white min-h-[32rem]">
              <AnimatePresence mode="wait">
                {renderScreen()}
              </AnimatePresence>
            </div>
            
            {/* Home Indicator */}
            <div className="bg-white pb-2 flex justify-center">
              <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}