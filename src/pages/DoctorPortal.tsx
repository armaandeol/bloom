// src/pages/DoctorPortal.tsx
import React, { useState } from 'react';
import BodyVisualization from '../components/games/BodyVisualization';
import ProgressTracker from '../components/games/ProgressTracker';
import LearningContent from '../components/games/LearningContent';
import TeachingStrategies from '../components/games/TeachingStrategies';
import HeroSection from '../components/doctor/HeroSection';

// Import or define the BodyPart interface to match BodyVisualization component
interface BodyPart {
  id: string;
  name: string;
  description: string;
  learned: number;
  funFact: string;
  sound?: string;
}

const bodyParts: BodyPart[] = [
  { id: 'brain', name: 'Brain', description: 'The brain helps you think, feel, and control your body.', learned: 0, funFact: 'Your brain is wrinkly to fit more thinking power in your head!' },
  { id: 'heart', name: 'Heart', description: 'The heart pumps blood all around your body.', learned: 0, funFact: 'Your heart is about the size of your fist and beats over 100,000 times every day!' },
  { id: 'lungs', name: 'Lungs', description: 'The lungs help you breathe in oxygen and breathe out carbon dioxide.', learned: 0, funFact: 'If you stretched out your lungs, they would be as big as a tennis court!' },
  { id: 'stomach', name: 'Stomach', description: 'The stomach helps digest the food you eat.', learned: 0, funFact: 'Your stomach can growl even when you\'re not hungry - it\'s just digesting food!' },
  { id: 'bones', name: 'Bones', description: 'Bones protect your body and help you move around.', learned: 0, funFact: 'You have 206 bones in your body, and the smallest one is in your ear!' },
  { id: 'muscles', name: 'Muscles', description: 'Muscles help you move and stay strong.', learned: 0, funFact: 'You use over 30 muscles just to smile!' },
];

const DoctorPortal = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [showEmotionTracker, setShowEmotionTracker] = useState(false);
  const [learningProgress, setLearningProgress] = useState<{ [key: string]: number }>(
    bodyParts.reduce((acc, part) => ({ ...acc, [part.id]: 0 }), {})
  );
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  
  const handleNodeSelect = (bodyPartId: string) => {
    setSelectedBodyPart(bodyPartId);
  };

  const handleBack = () => {
    setSelectedBodyPart(null);
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

  const updateProgress = (bodyPartId: string, value: number) => {
    setLearningProgress(prev => {
      const newProgress = { ...prev, [bodyPartId]: Math.min(100, prev[bodyPartId] + value) };
      
      // Check if we've earned a new badge
      if (newProgress[bodyPartId] >= 100 && !earnedBadges.includes(bodyPartId)) {
        setEarnedBadges(prev => [...prev, bodyPartId]);
      }
      
      return newProgress;
    });
  };

  return (
    <div className="bg-blue-100 min-h-screen">
      {/* Hero Section using our new component */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="relative min-h-screen overflow-hidden">
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Full-width header with 3D effect */}
          <div className="w-full bg-gradient-to-b from-blue-200/90 to-blue-300/90 backdrop-blur-sm p-6 text-center shadow-lg border-b border-blue-400/20">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 text-blue-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]">
              Explore the Human Body!
            </h2>
            <p className="text-lg md:text-2xl font-normal text-blue-700 drop-shadow-md">
              Select a body part to start your medical journey!
            </p>
            
            {/* Badge display */}
            <div className="flex justify-center mt-4 space-x-2 flex-wrap">
              {earnedBadges.map(badge => {
                const bodyPart = bodyParts.find(part => part.id === badge);
                return (
                  <div key={badge} className="bg-yellow-300 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center m-1">
                    <span className="mr-1">⭐</span> {bodyPart?.name} Expert
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Integrated content area */}
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
            
            {/* Main interactive area */}
            <div className="flex-1 relative">
              {/* Body Visualization - Full screen when no body part selected */}
              {!selectedBodyPart && !isBreakTime && (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <BodyVisualization 
                    bodyParts={bodyParts} 
                    updateProgress={(bodyPartId, value) => {
                      updateProgress(bodyPartId, value);
                      // Automatically navigate to the selected body part after a small delay
                      if (!selectedBodyPart) {
                        setTimeout(() => setSelectedBodyPart(bodyPartId), 800);
                      }
                    }} 
                  />
                </div>
              )}
              
              {/* Learning Zone - Shows when body part is selected */}
              {(selectedBodyPart || isBreakTime) && (
                <div className="absolute inset-0 m-4 bg-black/30 backdrop-blur-md rounded-3xl shadow-xl p-6 overflow-auto transform transition-all duration-500 hover:shadow-2xl">
                  {isBreakTime ? (
                    <div className="h-full flex flex-col items-center justify-center text-white">
                      <h3 className="text-2xl font-bold mb-4">Break Time!</h3>
                      <p className="text-lg mb-6">Let's take a moment to relax.</p>
                      <button 
                        onClick={handleBreakComplete}
                        className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors"
                      >
                        Return to Learning
                      </button>
                    </div>
                  ) : (
                    <div className="text-white h-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold">
                          {bodyParts.find(part => part.id === selectedBodyPart)?.name || 'Learning Zone'}
                        </h3>
                        <button 
                          onClick={handleBack}
                          className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors"
                        >
                          Back to Body
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100%-3rem)]">
                        <div className="bg-blue-900/50 rounded-xl p-4 backdrop-blur-sm">
                          <LearningContent 
                            bodyParts={[bodyParts.find(part => part.id === selectedBodyPart)!]} 
                            updateProgress={(_, value) => updateProgress(selectedBodyPart!, value)}
                          />
                        </div>
                        <div className="bg-blue-900/50 rounded-xl p-4 backdrop-blur-sm">
                          <TeachingStrategies 
                            bodyParts={[bodyParts.find(part => part.id === selectedBodyPart)!]} 
                            updateProgress={(_, value) => updateProgress(selectedBodyPart!, value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Emotion Tracker - Slide in panel */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-blue-950/90 backdrop-blur-md shadow-2xl p-6 z-20 transition-transform duration-500 ease-in-out ${showEmotionTracker ? 'translate-x-0' : 'translate-x-full'}`}>
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
                {/* Simple emotion tracker */}
                <h3 className="text-xl font-bold text-white mb-6">How are you feeling?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Happy', 'Sad', 'Excited', 'Tired', 'Confused', 'Curious'].map(emotion => (
                    <button 
                      key={emotion}
                      className="bg-blue-800/50 hover:bg-blue-700/50 text-white py-3 px-4 rounded-lg text-center"
                      onClick={() => {
                        if (['Tired', 'Sad'].includes(emotion)) {
                          handleBreakRequested();
                          toggleEmotionTracker();
                        }
                      }}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  <button 
                    onClick={handleBreakRequested} 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg"
                  >
                    Take a Break
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 text-center text-sm text-blue-800 p-4 bg-gradient-to-r from-blue-200/60 to-blue-300/60 backdrop-blur-sm border-t border-blue-400/20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <p className="font-medium">Bloom - A learning platform designed for children with Autism Spectrum Disorder</p>
      </footer>
    </div>
  );
};

export default DoctorPortal;