import React, { useState, useEffect } from 'react';
import HeroSection from '../components/scientist/herosection';
import ScienceLab from '../components/scientist/ScienceLab';
import ActivityZone from '../components/scientist/ActivityZone';
import BreakActivity from '../components/scientist/BreakActivity';
import EmotionTracker from '../components/scientist/EmotionTracker';
// Import the three games
import EquationFixer from '../components/games/EquationFixer';
import MoleculeMatch from '../components/games/MoleculeMatch';
import ShapeLab from '../components/games/ShapeLab';
// First add the motion import at the top
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
// Add missing icon imports
import { FlaskConical, Atom, TestTube2, BrainCircuit, ArrowLeft } from 'lucide-react';

const MOLECULE_TYPES = {
  H: { symbol: 'H', color: '#FF9999' },
  O: { symbol: 'O', color: '#FF6666' },
  C: { symbol: 'C', color: '#666666' },
  N: { symbol: 'N', color: '#99CCFF' },
};

const COMPOUNDS = {
  H2O: { name: 'Water', formula: 'H2O', components: ['H', 'H', 'O'] },
  CO2: { name: 'Carbon Dioxide', formula: 'CO2', components: ['C', 'O', 'O'] },
  NH3: { name: 'Ammonia', formula: 'NH3', components: ['N', 'H', 'H', 'H'] },
};

const ScientistPortal = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [showEmotionTracker, setShowEmotionTracker] = useState(false);
  // Add molecular lab state
  const [availableMolecules, setAvailableMolecules] = useState<string[]>([]);
  const [currentCompound, setCurrentCompound] = useState<string[]>([]);
  const [targetCompound, setTargetCompound] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // Add game initialization
  useEffect(() => {
    setTimeout(() => setShowWelcome(false), 3000);
    startNewRound();
  }, []);

  const startNewRound = () => {
    const molecules = Object.keys(MOLECULE_TYPES);
    const randomMolecules = Array.from({ length: 10 }, () => 
      molecules[Math.floor(Math.random() * molecules.length)]
    );
    
    const compoundKeys = Object.keys(COMPOUNDS);
    const randomKey = compoundKeys[Math.floor(Math.random() * compoundKeys.length)];
    const target = COMPOUNDS[randomKey as keyof typeof COMPOUNDS].components;
    
    setAvailableMolecules(randomMolecules);
    setTargetCompound(target);
    setCurrentCompound([]);
  };

  const handleMoleculeDrop = (molecule: string) => {
    const newCompound = [...currentCompound, molecule];
    setCurrentCompound(newCompound);
    
    // Check if compound matches target
    const currentSorted = newCompound.sort().join('');
    const targetSorted = [...targetCompound].sort().join('');
    
    if (currentSorted === targetSorted) {
      setScore(score + 100);
      startNewRound();
    }
  };

  const handleNodeSelect = (subject: string) => {
    setSelectedSubject(subject);
    if (subject === 'molecular-lab') {
      setShowWelcome(true);
    }
  };

  const handleBack = () => {
    setSelectedSubject(null);
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

  return (
    <div className="bg-blue-100 min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="relative min-h-screen overflow-hidden">
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Full-width header with 3D effect */}
          <div className="w-full bg-gradient-to-b from-blue-200/90 to-blue-300/90 backdrop-blur-sm p-6 text-center shadow-lg border-b border-blue-400/20">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 text-blue-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]">
              Explore the Laboratory of Knowledge!
            </h2>
            <p className="text-lg md:text-2xl font-normal text-blue-700 drop-shadow-md">
              Select a scientific field to start your learning journey!
            </p>
          </div>
        
          {/* Interactive Labs Section */}
          <div className="portal-section">
            <div className="lab-buttons">
              <button onClick={() => handleNodeSelect('shape-lab')} className="lab-button">
                <div className="lab-icon">🧪</div>
                <span>Shape Laboratory</span>
              </button>
            </div>
            <div className="lab-buttons">
              <button onClick={() => handleNodeSelect('equation-fixer')} className="lab-button">
                <div className="lab-icon">🧪</div>
                <span>Equation Fixer</span>
              </button>
            </div>
            <div className="lab-buttons">
              <button onClick={() => handleNodeSelect('molecule-match')} className="lab-button">
                <div className="lab-icon">🧪</div>
                <span>Molecule Match</span>
              </button>
            </div>
            <div className="lab-buttons">
              <button 
                onClick={() => handleNodeSelect('molecular-lab')}
                className="lab-button"
              >
                <div className="lab-icon">🧪</div>
                <span>Molecular Lab</span>
              </button>
            </div>
          </div>
          {/* Integrated content area - Modified to allow full screen science lab */}
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
            
            {/* Main interactive area - Changed to flex-1 to fill all available space */}
            <div className="flex-1 relative">
              {/* Science Lab - Full screen when no subject selected */}
              {!selectedSubject && !isBreakTime && (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <ScienceLab onNodeSelect={handleNodeSelect} />
                </div>
              )}
              
              {/* Activity Zone - Shows when subject is selected */}
              {(selectedSubject || isBreakTime) && (
                <div className="absolute inset-0 m-4 bg-black/30 backdrop-blur-md rounded-3xl shadow-xl p-6 overflow-auto transform transition-all duration-500 hover:shadow-2xl">
                  {/* Back button for games */}
                  {selectedSubject && !isBreakTime && (
                    <button 
                      onClick={handleBack}
                      className="absolute top-4 left-4 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                    >
                      <ArrowLeft className="text-white" size={24} />
                      <span className="sr-only">Back to Lab</span>
                    </button>
                  )}
                  
                  {/* Show appropriate content based on selection */}
                  {isBreakTime ? (
                    <BreakActivity onBreakComplete={handleBreakComplete} />
                  ) : selectedSubject === 'shape-lab' ? (
                    <ShapeLab />
                  ) : selectedSubject === 'equation-fixer' ? (
                    <EquationFixer />
                  ) : selectedSubject === 'molecule-match' ? (
                    <MoleculeMatch />
                  ) : selectedSubject === 'molecular-lab' && showWelcome ? (
                    <Card className="h-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 border-none shadow-sm rounded-xl">
                      <div className="absolute inset-0">
                        {Array.from({ length: 100 }, (_, i) => (
                          <div 
                            key={i} 
                            className="absolute bg-white rounded-full twinkle-star"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              width: `${Math.random() * 2 + 1}px`,
                              height: `${Math.random() * 2 + 1}px`,
                              animationDelay: `${Math.random() * 3}s`,
                              animationDuration: `${Math.random() * 3 + 2}s`
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-center p-8 z-10">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                          🧪 Welcome to Molecular Lab! 🔬
                        </h2>
                        <p className="text-xl mb-6 text-blue-100">
                          Combine atoms to discover chemical compounds!
                        </p>
                      </div>
                      
                      {/* Add custom animation styles */}
                      <style>{`
                        .twinkle-star {
                          animation: twinkle 3s infinite ease-in-out;
                        }
                        @keyframes twinkle {
                          0%, 100% { opacity: 0.3; transform: scale(1); }
                          50% { opacity: 1; transform: scale(1.2); }
                        }
                      `}</style>
                    </Card>
                  ) : selectedSubject === 'molecular-lab' ? (
                    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 p-4 relative overflow-hidden">
                      {/* Molecular Lab game interface */}
                      <div className="w-full max-w-6xl z-10">
                        <div className="flex items-center justify-between mb-8">
                          <h1 className="text-3xl font-bold text-white flex items-center">
                            <FlaskConical className="mr-3 text-cyan-400" size={32} />
                            Molecular Builder
                          </h1>
                          <div className="bg-white/10 px-4 py-2 rounded-full">
                            <span className="text-cyan-400 font-bold">Score:</span>
                            <span className="text-white ml-2">{score}</span>
                          </div>
                        </div>
                
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Available Molecules */}
                          <Card className="p-6 bg-white/10 backdrop-blur-sm border-none shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                              <Atom className="mr-2 text-green-400" size={24} />
                              Available Atoms
                            </h3>
                            <div className="flex flex-wrap gap-4">
                              {availableMolecules.map((molecule, index) => (
                                <motion.div
                                  key={`${molecule}-${index}`}
                                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold cursor-grab active:cursor-grabbing shadow-lg"
                                  style={{ background: MOLECULE_TYPES[molecule as keyof typeof MOLECULE_TYPES].color }}
                                  drag
                                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                  onDragEnd={() => handleMoleculeDrop(molecule)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {MOLECULE_TYPES[molecule as keyof typeof MOLECULE_TYPES].symbol}
                                </motion.div>
                              ))}
                            </div>
                          </Card>
                
                          {/* Target Compound */}
                          <Card className="p-6 bg-white/10 backdrop-blur-sm border-none shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                              <TestTube2 className="mr-2 text-yellow-400" size={24} />
                              Target Compound
                            </h3>
                            <div className="flex flex-wrap gap-4">
                              {targetCompound.map((molecule, index) => (
                                <div
                                  key={index}
                                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                  style={{ background: MOLECULE_TYPES[molecule as keyof typeof MOLECULE_TYPES].color }}
                                >
                                  {MOLECULE_TYPES[molecule as keyof typeof MOLECULE_TYPES].symbol}
                                </div>
                              ))}
                            </div>
                          </Card>
                
                          {/* Current Compound */}
                          <Card className="p-6 bg-white/10 backdrop-blur-sm border-none shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                              <BrainCircuit className="mr-2 text-purple-400" size={24} />
                              Your Compound
                            </h3>
                            <div className="flex flex-wrap gap-4">
                              {currentCompound.map((molecule, index) => (
                                <div
                                  key={index}
                                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                  style={{ background: MOLECULE_TYPES[molecule as keyof typeof MOLECULE_TYPES].color }}
                                >
                                  {MOLECULE_TYPES[molecule as keyof typeof MOLECULE_TYPES].symbol}
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ) : null}
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
                <EmotionTracker onBreakRequested={handleBreakRequested} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 text-center text-sm text-blue-800 p-4 bg-gradient-to-r from-blue-200/60 to-blue-300/60 backdrop-blur-sm border-t border-blue-400/20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <p className="font-medium">Bloom - A learning platform designed for You</p>
      </footer>
    </div>
  );
};

export default ScientistPortal;