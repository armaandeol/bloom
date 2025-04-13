import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GalaxyMap from '../components/GalaxyMap';
import ActivityZone from '../components/ActivityZone';
import EmotionTracker from '../components/EmotionTracker';
import BreakActivity from '../components/BreakActivity';
import HeroSection from '../components/HeroSection';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedPlanetTitle, setSelectedPlanetTitle] = useState<string | null>(null);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [showEmotionTracker, setShowEmotionTracker] = useState(false);

  const handleNodeSelect = (subject: string, title?: string) => {
    setSelectedSubject(subject);
    setSelectedPlanetTitle(title || null);
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setSelectedPlanetTitle(null);
  };

  const handleBreakRequested = () => {
    setIsBreakTime(true);
  };

  const handleBreakComplete = () => {
    setIsBreakTime(false);
  };

  const toggleEmotionTracker = () => {
    setShowEmotionTracker(!showEmotionTracker);
  };

  const goToDoctorPortal = () => {
    navigate('/doctor-portal');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-space"></div>
        
        {/* Adding colorful gradient circles similar to LandingPage */}
        <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full bg-circle-purple opacity-20 blur-2xl"></div>
        <div className="absolute top-[40%] left-[10%] w-[400px] h-[400px] rounded-full bg-circle-blue-purple opacity-15 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[25%] w-[350px] h-[350px] rounded-full bg-circle-green opacity-15 blur-2xl"></div>
        <div className="absolute top-[60%] left-[30%] w-[250px] h-[250px] rounded-full bg-circle-red opacity-15 blur-xl"></div>
        <div className="absolute top-[15%] left-[25%] w-[200px] h-[200px] rounded-full bg-circle-yellow opacity-10 blur-xl"></div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="relative min-h-screen overflow-hidden z-10">
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Full-width header with 3D effect */}
          <div className="w-full bg-gradient-header backdrop-blur-sm p-6 text-center shadow-lg border-b border-white/20">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              {userData?.name || 'Explorer'}'s Galaxy of Knowledge!
            </h2>
            <p className="text-lg md:text-2xl font-normal text-white/90 drop-shadow-md">
              Select a planet to start your learning journey!
            </p>
          </div>
          
          {/* Integrated content area - Modified to allow full screen galaxy map */}
          <div className="flex-1 relative w-full h-full flex flex-col">
            {/* Emotion tracker toggle button */}
            <button 
              onClick={toggleEmotionTracker}
              className="fixed top-24 right-4 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full shadow-lg transition-transform hover:scale-110"
            >
              <span className="sr-only">Toggle Emotion Tracker</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            
            {/* Doctor Portal Button */}
            <button 
              onClick={goToDoctorPortal}
              className="fixed top-24 left-4 z-30 bg-teal-600/70 hover:bg-teal-600/90 backdrop-blur-sm p-3 rounded-full shadow-lg transition-transform hover:scale-110"
            >
              <span className="sr-only">Go to Doctor Portal</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
            
            {/* Main interactive area - Changed to flex-1 to fill all available space */}
            <div className="flex-1 relative">
              {/* Galaxy Map - Full screen when no subject selected */}
              {!selectedSubject && !isBreakTime && (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <GalaxyMap onNodeSelect={handleNodeSelect} />
                </div>
              )}
              
              {/* Activity Zone - Shows when subject is selected */}
              {(selectedSubject || isBreakTime) && (
                <div className="absolute inset-0 m-4 bg-black/30 backdrop-blur-md rounded-3xl shadow-xl p-6 overflow-auto transform transition-all duration-500 hover:shadow-2xl">
                  {isBreakTime ? (
                    <BreakActivity onBreakComplete={handleBreakComplete} />
                  ) : (
                    <ActivityZone 
                      subject={selectedSubject} 
                      planetTitle={selectedPlanetTitle}
                      onBack={handleBack} 
                    />
                  )}
                </div>
              )}
            </div>
            
            {/* Emotion Tracker - Slide in panel */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-md shadow-2xl p-6 z-20 transition-transform duration-500 ease-in-out ${showEmotionTracker ? 'translate-x-0' : 'translate-x-full'}`}>
              <button 
                onClick={toggleEmotionTracker}
                className="absolute top-4 right-4 bg-red-900/50 hover:bg-red-900/70 p-2 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="mt-10">
                <EmotionTracker onBreakRequested={handleBreakRequested} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 text-center text-sm text-white p-4 bg-gradient-footer bg-opacity-80 backdrop-blur-sm border-t border-white/20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <p className="font-medium">Bloom - A learning platform designed for You</p>
      </footer>
    </div>
  );
};

export default Index;
