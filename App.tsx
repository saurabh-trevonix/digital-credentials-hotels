'use client';

import { useState } from 'react';
import { HotelCheckIn } from './components/HotelCheckIn';
import { MobileAppSimulation } from './components/MobileAppSimulation';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Hotel, Smartphone, Monitor, Users, Shield, Zap, CheckCircle, ArrowRight, Star, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  const [activeView, setActiveView] = useState<'overview' | 'hotel' | 'mobile'>('overview');
  const [verificationData, setVerificationData] = useState<any>(null);

  const handleMobileComplete = (data: any) => {
    setVerificationData(data);
    setActiveView('hotel');
  };

  const renderOverview = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20">
                <Hotel className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Digital Identity
            <br />
            <span className="text-5xl">Hotel Check-in</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Experience the future of hospitality with secure, contactless check-in using 
            Verifiable Credentials and biometric authentication powered by NatWest Digital ID.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Secure & Verified
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Instant Check-in
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Privacy First
            </Badge>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {[
            {
              icon: <Hotel className="w-8 h-8" />,
              title: "Hotel Kiosk System",
              description: "Professional check-in terminal with QR code generation and real-time verification",
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-500/10 to-cyan-500/10"
            },
            {
              icon: <Smartphone className="w-8 h-8" />,
              title: "NatWest Digital Wallet",
              description: "Secure mobile app with biometric authentication and credential management",
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-500/10 to-pink-500/10"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Seamless Experience",
              description: "Contactless, secure, and lightning-fast check-in process for modern travelers",
              gradient: "from-emerald-500 to-teal-500",
              bgGradient: "from-emerald-500/10 to-teal-500/10"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center border border-white/20`}>
                  <div className={`text-transparent bg-gradient-to-r ${feature.gradient} bg-clip-text`}>
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </motion.div>

        {/* Process Flow */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white mb-2">How It Works</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Experience the complete digital identity verification workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl text-white mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Verification Process
                  </h4>
                  <div className="space-y-4">
                    {[
                      'Hotel system displays secure QR code',
                      'Guest scans code with mobile device',
                      'NatWest app opens automatically',
                      'Biometric authentication (Face ID/Touch ID)',
                      'Select credentials to share',
                      'Consent and data sharing',
                      'Real-time verification',
                      'Instant check-in completion'
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-white text-sm font-semibold">{index + 1}</span>
                        </div>
                        <p className="text-gray-300 group-hover:text-white transition-colors">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl text-white mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    Key Benefits
                  </h4>
                  <div className="space-y-4">
                    {[
                      { icon: <Shield className="w-5 h-5" />, text: 'Bank-grade security with biometric verification', color: 'text-green-400' },
                      { icon: <Zap className="w-5 h-5" />, text: 'Lightning-fast 30-second check-in process', color: 'text-blue-400' },
                      { icon: <Users className="w-5 h-5" />, text: 'Completely contactless and hygienic', color: 'text-purple-400' },
                      { icon: <CheckCircle className="w-5 h-5" />, text: 'Selective data sharing with full consent', color: 'text-emerald-400' },
                      { icon: <Globe className="w-5 h-5" />, text: 'Real-time credential verification', color: 'text-cyan-400' },
                      { icon: <Hotel className="w-5 h-5" />, text: 'Premium guest experience', color: 'text-pink-400' }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className={benefit.color}>
                          {benefit.icon}
                        </div>
                        <span className="text-gray-300">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-3xl text-white mb-8">Ready to Experience the Future?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              onClick={() => setActiveView('hotel')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Monitor className="w-5 h-5 mr-2" />
              Try Hotel System
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => setActiveView('mobile')}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Mobile Experience
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (activeView === 'overview') {
    return renderOverview();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Navigation Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => setActiveView('overview')}
                className="hover:bg-gray-100/50 rounded-xl px-4 py-2 transition-colors"
              >
                ← Back to Overview
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Hotel className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Digital ID Check-in Demo</h2>
              </div>
            </div>
            
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
              <TabsList className="bg-gray-100/50 border border-gray-200/50 rounded-xl p-1">
                <TabsTrigger 
                  value="hotel" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Monitor className="w-4 h-4" />
                  Hotel System
                </TabsTrigger>
                <TabsTrigger 
                  value="mobile" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile App
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeView === 'hotel' && (
          <HotelCheckIn />
        )}
        
        {activeView === 'mobile' && (
          <div className="max-w-2xl mx-auto py-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">NatWest Mobile Experience</h2>
              <p className="text-gray-600 text-lg">
                Complete the digital ID verification process
              </p>
            </motion.div>
            <MobileAppSimulation onComplete={handleMobileComplete} />
          </div>
        )}
      </div>
    </div>
  );
}