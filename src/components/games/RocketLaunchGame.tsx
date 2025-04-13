import React, { useState, useEffect, useRef } from 'react';

const RocketLaunchGame = () => {
  // Core game state
  const [angle, setAngle] = useState(45);
  const [fuel, setFuel] = useState(50);
  const [message, setMessage] = useState('');
  const [gameState, setGameState] = useState('ready'); // ready, launching, success, failed
  const [flames, setFlames] = useState(0);
  const [score, setScore] = useState(0);
  const [launches, setLaunches] = useState(0);
  const [rocketPosition, setRocketPosition] = useState({ x: 50, y: 0 });
  const [showTutorial, setShowTutorial] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [animateBackground, setAnimateBackground] = useState(true);
  
  // Visual effects
  const [stars] = useState(() => 
    Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 3,
      speed: 0.05 + Math.random() * 0.2
    }))
  );
  
  const [confetti, setConfetti] = useState([]);
  const [shake, setShake] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState([]);
  const audioRef = useRef(null);
  
  // Calculated values
  const successRange = {
    angle: { min: difficulty === 'easy' ? 35 : 40, max: difficulty === 'easy' ? 55 : 50 },
    fuel: { min: difficulty === 'easy' ? 40 : 45, max: difficulty === 'easy' ? 60 : 55 }
  };
  
  const isAngleOptimal = angle >= successRange.angle.min && angle <= successRange.angle.max;
  const isFuelOptimal = fuel >= successRange.fuel.min && fuel <= successRange.fuel.max;
  
  // Flame animation
  useEffect(() => {
    if (gameState === 'launching') {
      const flameInterval = setInterval(() => {
        setFlames(f => (f + 1) % 10);
      }, 60);
      return () => clearInterval(flameInterval);
    }
  }, [gameState]);
  
  // Star movement animation
  useEffect(() => {
    if (animateBackground) {
      const starInterval = setInterval(() => {
        stars.forEach(star => {
          star.y = (star.y + star.speed) % 100;
        });
      }, 50);
      return () => clearInterval(starInterval);
    }
  }, [stars, animateBackground]);
  
  // Generate smoke particles
  const createSmokeEffect = () => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: 50 + (Math.random() * 10 - 5),
      y: 10 + (Math.random() * 5),
      size: 5 + Math.random() * 15,
      opacity: 0.7 + Math.random() * 0.3,
      speedX: (Math.random() - 0.5) * 2,
      speedY: -0.5 - Math.random() * 1,
      life: 100
    }));
    
    setSmokeParticles(prev => [...prev, ...newParticles]);
  };
  
  // Update smoke particles
  useEffect(() => {
    if (smokeParticles.length > 0) {
      const interval = setInterval(() => {
        setSmokeParticles(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            opacity: p.opacity - 0.02,
            size: p.size + 0.5,
            life: p.life - 1
          })).filter(p => p.life > 0)
        );
      }, 50);
      return () => clearInterval(interval);
    }
  }, [smokeParticles]);

  // Handle launch sequence
  const handleLaunch = () => {
    // Play sound effect
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    
    setGameState('launching');
    setMessage('');
    setShake(true);
    createSmokeEffect();
    
    // Create launch interval to animate the rocket rising
    let launchHeight = 0;
    const launchInterval = setInterval(() => {
      launchHeight += 1;
      setRocketPosition(prev => ({ 
        x: prev.x + (angle < 45 ? 0.3 : angle > 45 ? -0.3 : 0),
        y: launchHeight
      }));
      
      if (launchHeight >= 10) {
        createSmokeEffect();
      }
      
      if (launchHeight >= 50) {
        clearInterval(launchInterval);
        completeRocketLaunch();
      }
    }, 50);
    
    // Stop shake effect after a short time
    setTimeout(() => setShake(false), 1000);
    
    // Increment launches counter
    setLaunches(prev => prev + 1);
  };
  
  // Complete launch sequence
  const completeRocketLaunch = () => {
    const success = angle >= successRange.angle.min && angle <= successRange.angle.max && 
                   fuel >= successRange.fuel.min && fuel <= successRange.fuel.max;
    
    if (success) {
      setScore(prev => prev + 100);
      setGameState('success');
      setMessage("🚀 Successful Launch! You're a space hero!");
      createConfetti();
    } else {
      setGameState('failed');
      
      let reason = "";
      if (angle < successRange.angle.min) reason = "Angle too low";
      else if (angle > successRange.angle.max) reason = "Angle too high";
      else if (fuel < successRange.fuel.min) reason = "Not enough fuel";
      else if (fuel > successRange.fuel.max) reason = "Too much fuel";
      
      setMessage(`❌ Launch failed! ${reason}. Try again.`);
    }
    
    // Reset rocket position after 2 seconds
    setTimeout(() => {
      setRocketPosition({ x: 50, y: 0 });
      setGameState('ready');
    }, 2000);
  };
  
  // Create confetti for successful launch
  const createConfetti = () => {
    const newConfetti = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: -10,
      speed: 2 + Math.random() * 5,
      angle: Math.random() * 360,
      size: 5 + Math.random() * 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      rotation: Math.random() * 360,
      rotationSpeed: -5 + Math.random() * 10
    }));
    
    setConfetti(newConfetti);
    
    // Animate confetti
    const interval = setInterval(() => {
      setConfetti(prev => 
        prev.map(c => ({
          ...c,
          y: c.y + c.speed/2,
          rotation: c.rotation + c.rotationSpeed,
          x: c.x + Math.sin(c.rotation / 20) * 2
        })).filter(c => c.y < 110)
      );
    }, 50);
    
    // Clear interval after all confetti is gone
    setTimeout(() => {
      clearInterval(interval);
      setConfetti([]);
    }, 5000);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black text-white p-6 relative overflow-hidden ${shake ? 'animate-shake' : ''}`}>
      {/* Animated Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.3 + Math.random() * 0.7,
            animation: `twinkle ${2 + Math.random() * 3}s infinite ease-in-out`
          }}
        />
      ))}

      {/* Smoke particles */}
      {smokeParticles.map((particle, i) => (
        <div
          key={`smoke-${i}`}
          className="absolute rounded-full bg-white/30 blur-md"
          style={{
            left: `${particle.x}%`,
            bottom: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
        />
      ))}

      {/* Confetti */}
      {confetti.map((c, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            transform: `rotate(${c.rotation}deg)`,
            opacity: 0.8
          }}
        />
      ))}

      

      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse-slow z-10">
        🚀 Rocket Launch Simulator
      </h1>

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        {/* Score Display */}
        <div className="flex justify-between items-center">
          <div className="bg-indigo-900/50 px-4 py-2 rounded-xl">
            <span className="text-yellow-300 font-bold">Score: {score}</span>
          </div>
          <div className="bg-indigo-900/50 px-4 py-2 rounded-xl">
            <span className="text-yellow-300 font-bold">Launches: {launches}</span>
          </div>
          <button 
            onClick={() => setShowTutorial(true)}
            className="bg-indigo-900/50 px-4 py-2 rounded-xl hover:bg-indigo-800/50"
          >
            <span className="text-yellow-300 font-bold">Help</span>
          </button>
        </div>

        {/* Launch Pad Visualization */}
        <div className="relative h-64 mb-12">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full">
            <div className="w-48 h-48 bg-gray-800 rounded-full absolute left-1/2 -translate-x-1/2 -bottom-24 blur-xl opacity-50" />
            
            {/* Launch Platform */}
            <div className="w-32 h-8 bg-gray-700 absolute left-1/2 -translate-x-1/2 bottom-0 rounded-t-lg" />
            
            {/* Rocket */}
            <div 
              className="absolute transition-all duration-500"
              style={{ 
                left: `${rocketPosition.x}%`, 
                bottom: `${rocketPosition.y}%`,
                transform: `rotate(${angle - 45}deg)` 
              }}
            >
              <div className="text-6xl">🚀</div>
              {gameState === 'launching' && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-4xl animate-flame">
                  {['🔥', '🌋', '🔥', '🌋'][flames % 4]}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-8 backdrop-blur-sm bg-indigo-900/30 p-8 rounded-2xl shadow-lg">
          <div>
            <label className="block mb-4 text-xl font-semibold flex items-center gap-2">
              <span>📐 Launch Angle: {angle}°</span>
              <span className={`text-sm ${isAngleOptimal ? 'text-green-400' : 'text-yellow-400'}`}>
                ({successRange.angle.min}°-{successRange.angle.max}° ideal)
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="90"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              disabled={gameState !== 'ready'}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block mb-4 text-xl font-semibold flex items-center gap-2">
              <span>⛽ Fuel Mix: {fuel}%</span>
              <span className={`text-sm ${isFuelOptimal ? 'text-green-400' : 'text-yellow-400'}`}>
                ({successRange.fuel.min}%-{successRange.fuel.max}% ideal)
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={fuel}
              onChange={(e) => setFuel(Number(e.target.value))}
              disabled={gameState !== 'ready'}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ background: `linear-gradient(90deg, #dc2626 ${fuel}%, #1e3a8a ${fuel}%)` }}
            />
          </div>

          {/* Difficulty selector */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-4 py-2 rounded-xl ${difficulty === 'easy' ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('normal')}
              className={`px-4 py-2 rounded-xl ${difficulty === 'normal' ? 'bg-yellow-600' : 'bg-gray-700'}`}
            >
              Normal
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-4 py-2 rounded-xl ${difficulty === 'hard' ? 'bg-red-600' : 'bg-gray-700'}`}
            >
              Hard
            </button>
          </div>

          <button
            onClick={handleLaunch}
            disabled={gameState !== 'ready'}
            className={`w-full py-4 text-2xl font-bold rounded-xl transition-all ${
              gameState !== 'ready' 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 hover:scale-105'
            } active:scale-95 shadow-lg`}
          >
            {gameState === 'launching' ? '🚀 IGNITION SEQUENCE STARTED...' : '🔥 LAUNCH ROCKET'}
          </button>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center text-2xl font-bold animate-fly-in ${
              gameState === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-indigo-900/90 p-6 rounded-xl max-w-md">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Adjust the launch angle between {successRange.angle.min}° and {successRange.angle.max}° for optimal trajectory</li>
              <li>Set the fuel mix between {successRange.fuel.min}% and {successRange.fuel.max}% for perfect combustion</li>
              <li>Click the Launch button to send your rocket to space</li>
              <li>Score points for successful launches!</li>
            </ul>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowTutorial(false)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio */}
      <audio ref={audioRef} src="/assets/sounds/rocket.mp3" />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes flame {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fly-in {
          0% { transform: translateY(100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-flame {
          animation: flame 0.2s infinite alternate;
        }
        .animate-fly-in {
          animation: fly-in 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default RocketLaunchGame;
      