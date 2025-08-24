'use client';

import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  Star, 
  Globe, 
  DollarSign, 
  Heart, 
  Award, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight,
  Play,
  Download,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import { motion } from 'framer-motion';
import { HotelCheckIn } from './components/HotelCheckIn'; // Fixed: using named import instead of default import

export default function App() {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [currency, setCurrency] = useState('USD');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showHotelCheckIn, setShowHotelCheckIn] = useState(false);

  // Mock data for destinations and deals
  const popularDestinations = [
    { name: 'New York', country: 'USA', image: '/api/placeholder/300/200', rating: 4.8 },
    { name: 'London', country: 'UK', image: '/api/placeholder/300/200', rating: 4.7 },
    { name: 'Paris', country: 'France', image: '/api/placeholder/300/200', rating: 4.9 },
    { name: 'Tokyo', country: 'Japan', image: '/api/placeholder/300/200', rating: 4.6 },
    { name: 'Sydney', country: 'Australia', image: '/api/placeholder/300/200', rating: 4.5 },
    { name: 'Dubai', country: 'UAE', image: '/api/placeholder/300/200', rating: 4.7 }
  ];

  const topDeals = [
    { title: 'Summer Escape Package', location: 'Caribbean', discount: '30% OFF', price: 'From $199', image: '/api/placeholder/400/250' },
    { title: 'Business Traveler Special', location: 'Major Cities', discount: '25% OFF', price: 'From $149', image: '/api/placeholder/400/250' },
    { title: 'Family Adventure Deal', location: 'Europe', discount: '20% OFF', price: 'From $299', image: '/api/placeholder/400/250' },
    { title: 'Romantic Getaway', location: 'Tropical Islands', discount: '35% OFF', price: 'From $249', image: '/api/placeholder/400/250' }
  ];

  const experiences = [
    { category: 'Business', icon: Building, description: 'Corporate rates, meeting rooms, business centers' },
    { category: 'Family', icon: Users, description: 'Kids clubs, family suites, entertainment' },
    { category: 'Romantic', icon: Heart, description: 'Honeymoon packages, couples retreats' },
    { category: 'Wellness', icon: Award, description: 'Spa treatments, fitness centers, healthy dining' }
  ];

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) return;
    
    // In a real app, this would redirect to search results
    console.log('Search submitted:', {
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      promoCode,
      flexibleDates,
      nearMe,
      language,
      currency
    });
    
    // Simulate redirect to search results
    alert('Search submitted! Redirecting to results...');
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNearMe(true);
          setDestination('Near Me');
          // In real app, would reverse geocode to get city name
        },
        (error) => {
          console.log('Geolocation error:', error);
          setNearMe(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {showHotelCheckIn ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
          {/* Header for Hotel Check-in */}
          <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowHotelCheckIn(false)}
                    className="hover:bg-gray-100/50 rounded-xl px-4 py-2 transition-colors"
                  >
                    ← Back to Homepage
                  </Button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Hotel Check-in System</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Check-in Component - Full Page */}
          <div className="w-full h-full">
            <HotelCheckIn />
          </div>
        </div>
      ) : (
        <>
          {/* Global Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">LuxuryHotels</span>
                </div>

                {/* Primary Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Find a Hotel</a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Destinations</a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Offers</a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Meetings & Events</a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Loyalty</a>
                  <Button 
                    onClick={() => setShowHotelCheckIn(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Check-in
                  </Button>
                </nav>

                {/* Utility Navigation */}
                <div className="flex items-center space-x-4">
                  {/* Language Selector */}
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EN">EN</option>
                    <option value="ES">ES</option>
                    <option value="FR">FR</option>
                    <option value="DE">DE</option>
                    <option value="IT">IT</option>
                    <option value="PT">PT</option>
                    <option value="AR">AR</option>
                    <option value="JA">JA</option>
                    <option value="ZH">ZH</option>
                  </select>

                  {/* Currency Selector */}
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                  </select>

                  {/* Support */}
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>

                  {/* Sign In */}
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Hero + Search Section */}
          <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white">
            {/* Background Video/Image Placeholder */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-blue-900/80 z-20"></div>
            
            <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center mb-12">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold mb-6"
                >
                  Luxury Hotels Worldwide
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
                >
                  Discover exceptional experiences at over 100 locations worldwide. 
                  Best price guarantee, flexible cancellation, and 24/7 support.
                </motion.p>
                
                {/* Prominent Hotel Check-in Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-8"
                >
                  <Button
                    onClick={() => setShowHotelCheckIn(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-white/20"
                  >
                    <Building className="w-8 h-8 mr-3" />
                    Hotel Check-in
                    <ArrowRight className="w-8 h-8 ml-3" />
                  </Button>
                  <p className="text-blue-100 text-lg mt-4 opacity-90">
                    Fast, secure, and contactless check-in experience
                  </p>
                </motion.div>
              </div>

              {/* Search Module */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Destination */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-blue-100 mb-2">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => setShowSearchSuggestions(true)}
                        placeholder="City, hotel, or landmark"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    {showSearchSuggestions && (
                      <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 mt-1 z-50">
                        {popularDestinations.slice(0, 3).map((dest, index) => (
                          <div 
                            key={index}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setDestination(dest.name);
                              setShowSearchSuggestions(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-900">{dest.name}, {dest.country}</span>
                              <Star className="w-4 h-4 text-yellow-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Check-in / Check-out</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Guests & Rooms */}
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Guests & Rooms</label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} Adults</option>
                        ))}
                      </select>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        {[0,1,2,3,4].map(num => (
                          <option key={num} value={num}>{num} Children</option>
                        ))}
                      </select>
                      <select
                        value={rooms}
                        onChange={(e) => setRooms(Number(e.target.value))}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num} Rooms</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Promo/Corporate Code</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flexibleDates}
                        onChange={(e) => setFlexibleDates(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-blue-100">Flexible dates (±3 days)</span>
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNearMe}
                      className="border-blue-200 text-blue-100 hover:bg-blue-200 hover:text-blue-900"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Near Me
                    </Button>
                  </div>
                </div>

                {/* Search Button */}
                <div className="text-center">
                  <Button
                    onClick={handleSearch}
                    disabled={!destination || !checkIn || !checkOut}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Hotels
                  </Button>
                </div>

                {/* Value Props */}
                <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center space-x-2 text-blue-100">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Best Price Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Free Cancellation*</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Popular & Nearby Destinations */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Popular & Nearby Destinations
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover our most sought-after locations and find your perfect getaway
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {popularDestinations.map((dest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <div className="relative h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <Building className="w-12 h-12 text-white" />
                        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium text-gray-900">{dest.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-4 text-center">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-gray-600">{dest.country}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Deals & Packages */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Top Deals & Packages
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Exclusive offers and packages designed for every type of traveler
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topDeals.map((deal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <Building className="w-16 h-16 text-white" />
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                          {deal.discount}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {deal.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{deal.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">{deal.price}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Experiences */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Tailored Experiences
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose your perfect travel style and let us create an unforgettable experience
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                  >
                    <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <exp.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {exp.category}
                      </h3>
                      <p className="text-gray-600">{exp.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Loyalty Teaser */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Join Our Loyalty Program
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Earn points on every stay, enjoy exclusive member rates, and unlock premium benefits 
                  including room upgrades, late check-out, and complimentary amenities.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <span>Earn points on every stay</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span>Exclusive member rates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-yellow-300" />
                    <span>Premium benefits</span>
                  </div>
                </div>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Join Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="ml-2 text-lg font-semibold text-gray-900">4.8/5</span>
                </div>
                <p className="text-lg text-gray-600 mb-8">
                  Trusted by over 2 million guests worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                  <div className="text-2xl font-bold text-gray-400">LUXURY</div>
                  <div className="text-2xl font-bold text-gray-400">AWARDS</div>
                  <div className="text-2xl font-bold text-gray-400">TRUSTED</div>
                  <div className="text-2xl font-bold text-gray-400">GLOBAL</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* App Download */}
          <section className="py-16 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Get Our Mobile App
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Book on the go, manage your reservations, and access exclusive mobile-only deals
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-black hover:bg-gray-800 px-8 py-4 rounded-xl text-lg font-semibold">
                    <Download className="w-5 h-5 mr-2" />
                    App Store
                  </Button>
                  <Button className="bg-black hover:bg-gray-800 px-8 py-4 rounded-xl text-lg font-semibold">
                    <Download className="w-5 h-5 mr-2" />
                    Google Play
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Global Footer */}
          <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Company</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Emergency</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Legal</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                      <Youtube className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-300 text-sm">
                    © 2025 LuxuryHotels. All rights reserved. | 
                    <a href="#" className="hover:text-white transition-colors ml-1">Sustainability</a> | 
                    <a href="#" className="hover:text-white transition-colors ml-1">Accessibility</a>
                  </p>
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <span className="text-gray-300 text-sm">Displayed prices are estimates in {currency}. Final price shown at checkout.</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
