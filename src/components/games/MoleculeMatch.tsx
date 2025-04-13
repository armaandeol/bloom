import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MOLECULE_TYPES = {
  H: { symbol: 'H', color: '#FF9999' },
  O: { symbol: 'O', color: '#FF6666' },
  C: { symbol: 'C', color: '#666666' },
  N: { symbol: 'N', color: '#99CCFF' },
};

// Add proper type annotations for COMPOUNDS
const COMPOUNDS = {
  H2O: { 
    name: 'Water', 
    formula: 'H2O', 
    components: ['H', 'H', 'O'] as string[]
  },
  CO2: { 
    name: 'Carbon Dioxide', 
    formula: 'CO2', 
    components: ['C', 'O', 'O'] as string[]
  },
  NH3: { 
    name: 'Ammonia', 
    formula: 'NH3', 
    components: ['N', 'H', 'H', 'H'] as string[]
  },
};

// Fix the particle animation duration
<style>{`
  @keyframes float {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
  }
  @keyframes jump {
    0% { transform: scale(0); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
  .animate-float {
    animation: float 1.5s ease-out forwards;
  }
  .animate-jump {
    animation: jump 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`}</style>

const MoleculeMatch: React.FC = () => {
  const [availableMolecules, setAvailableMolecules] = useState<string[]>([]);
  const [currentCompound, setCurrentCompound] = useState<string[]>([]);
  const [targetCompound, setTargetCompound] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => startNewRound(), []);

  const startNewRound = () => {
    const molecules = Object.keys(MOLECULE_TYPES);
    const randomMolecules = Array(10).fill(null).map(() => 
      molecules[Math.floor(Math.random() * molecules.length)]
    );
    setAvailableMolecules(randomMolecules);

    const compoundKeys = Object.keys(COMPOUNDS);
    const randomCompound = COMPOUNDS[compoundKeys[Math.floor(Math.random() * compoundKeys.length)]];
    setTargetCompound(randomCompound.components);
    setCurrentCompound([]);
    setGameStatus('playing');
  };

  const createParticles = () => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    })));
  };

  const handleMoleculeDrop = (molecule: string) => {
    if (currentCompound.length < 4) {
      setCurrentCompound([...currentCompound, molecule]);
      setAvailableMolecules(availableMolecules.filter(m => m !== molecule));
    }
  };

  const checkCompound = () => {
    if (currentCompound.length === targetCompound.length) {
      const isMatch = currentCompound.every((m, i) => m === targetCompound[i]);
      
      if (isMatch) {
        setScore(s => s + 100);
        setGameStatus('won');
        createParticles();
        setTimeout(startNewRound, 2000);
      } else {
        setCurrentCompound([]);
      }
    }
  };

  useEffect(checkCompound, [currentCompound]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4 relative overflow-hidden">
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-2xl animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${Math.random() * 1}s`
          }}
          onAnimationEnd={() => setParticles(prev => prev.filter(part => part.id !== p.id))}
        >
          {['✨', '🌟', '🎉', '💫'][Math.floor(Math.random() * 4)]}
        </div>
      ))}

      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
        🧪 Molecule Match 🔬
      </h1>

      <div className="text-2xl font-bold mb-4 text-white">
        Score: <span className="text-yellow-400">{score}</span>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl">
        {/* Available Molecules */}
        <div className="p-6 bg-white/20 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-white">Available Molecules</h3>
          <div className="flex flex-wrap gap-4">
            {availableMolecules.map((molecule, index) => (
              <motion.div
                key={index}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold cursor-grab active:cursor-grabbing shadow-lg"
                style={{ background: MOLECULE_TYPES[molecule].color }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={() => handleMoleculeDrop(molecule)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {MOLECULE_TYPES[molecule].symbol}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Target Area */}
        <div className="md:col-span-2 p-6 bg-white/20 rounded-xl shadow-lg">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-white">Target Compound</h3>
            <div className="flex gap-4 p-4 bg-white/10 rounded-lg">
              {targetCompound.map((molecule, index) => (
                <div
                  key={index}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                  style={{ background: MOLECULE_TYPES[molecule].color }}
                >
                  {MOLECULE_TYPES[molecule].symbol}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Your Compound</h3>
            <div className="flex gap-4 p-4 bg-white/10 rounded-lg min-h-[120px]">
              {currentCompound.map((molecule, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                  style={{ background: MOLECULE_TYPES[molecule].color }}
                >
                  {MOLECULE_TYPES[molecule].symbol}
                </motion.div>
              ))}
              {gameStatus === 'won' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="text-4xl animate-jump">🎉 Correct!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes jump {
          0% { transform: scale(0); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        .animate-float {
          animation: float 1.5s ease-out forwards;
        }
        .animate-jump {
          animation: jump 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};

export default MoleculeMatch;