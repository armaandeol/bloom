import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const correctOrder = ["Mercury", "Venus", "Earth", "Mars"];
const planetsInfo = {
    Mercury: {
      image: "/assets/planets/mercury.png",
      color: "from-purple-500 to-blue-500",
      fact: "Closest planet to the Sun",
    },
    Venus: {
      image: "/assets/planets/venus.png",
      color: "from-yellow-500 to-orange-500",
      fact: "Hottest planet in our solar system",
    },
    Earth: {
      image: "/assets/planets/earth.png",
      color: "from-green-500 to-blue-500",
      fact: "The only planet known to harbor life",
    },
    Mars: {
      image: "/assets/planets/mars.png",
      color: "from-red-500 to-orange-500",
      fact: "Known as the Red Planet",
    },
  };

// Add the missing planetStyles object
// Fix the Mercury image path to include file extension
const planetStyles = {
  Mercury: {
    image: "../src/components/resources/mercury.jpg",
    color: "from-purple-500 to-blue-500",
    fact: "Closest planet to the Sun"
  },
  Venus: {
    image: "../src/components/resources/venus.webp",
    color: "from-yellow-500 to-orange-500",
    fact: "Hottest planet in our solar system"
  },
  Earth: {
    image: "../src/components/resources/earth.jpg",
    color: "from-green-500 to-blue-500",
    fact: "The only planet known to harbor life"
  },
  Mars: {
    image: "../src/components/resources/mars.webp",
    color: "from-red-500 to-orange-500",
    fact: "Known as the Red Planet"
  }
};

export default function OrbitBuilder() {
  const [planets, setPlanets] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showFacts, setShowFacts] = useState(false);

  // Initialize planets on component mount
  useEffect(() => {
    resetGame();
  }, []);

  function resetGame() {
    setPlanets(shuffle([...correctOrder]));
    setIsCorrect(null);
    setCelebrate(false);
    setShowFacts(false);
  }

  function shuffle(arr: string[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); // Necessary to allow dropping
  }

  function handleDrop(index: number) {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...planets];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setPlanets(updated);
    setDraggedIndex(null);
    setIsCorrect(null);
  }

  function checkAnswer() {
    const correct = JSON.stringify(planets) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    if (correct) {
      setCelebrate(true);
      setTimeout(() => {
        setCelebrate(false);
        setShowFacts(true);
      }, 2000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center gap-6 relative overflow-hidden p-4">
      {/* Back button */}
      <Link 
        to="/"
        className="absolute top-4 left-4 text-white flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition-colors z-20"
      >
        ← Back to Galaxy
      </Link>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `star ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse-slow z-10 text-center">
        🌌 Cosmic Dance
      </h1>
      <p className="text-lg text-purple-300 font-mono z-10 text-center max-w-md">
        Arrange the planets in their correct order from the Sun!
      </p>

      <div className="flex gap-4 flex-wrap justify-center relative z-10 my-8">
        {planets.map((planet, index) => (
          <div
            key={planet}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`relative group p-2 rounded-3xl cursor-grab active:cursor-grabbing transition-all duration-300 ${
              draggedIndex === index
                ? "scale-125 rotate-12 shadow-2xl z-20"
                : "hover:scale-110 hover:-rotate-6 z-10"
            }`}
          >
            <div
              className={`bg-gradient-to-br ${
                planetStyles[planet as keyof typeof planetStyles]?.color || "from-gray-500 to-gray-700"
              } w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center 
              shadow-lg backdrop-blur-sm transition-transform duration-300 overflow-hidden`}
            >
              <img 
                src={planetStyles[planet as keyof typeof planetStyles]?.image} 
                alt={planet}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
            </div>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold text-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {planet}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-4 z-10">
        <button
          onClick={checkAnswer}
          className="relative z-10 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-purple-500 
          px-6 py-2 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 
          hover:scale-105 active:scale-95"
        >
          🌟 Validate Orbit
        </button>
        
        <button
          onClick={resetGame}
          className="relative z-10 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 
          px-6 py-2 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 
          hover:scale-105 active:scale-95"
        >
          🔄 Reset
        </button>
      </div>

      {isCorrect !== null && !showFacts && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm
          ${isCorrect ? "animate-fade-in" : "animate-shake"}`}
        >
          <div className={`text-center p-8 rounded-2xl ${
            isCorrect 
              ? "bg-gradient-to-br from-green-900/80 to-blue-900/80 border-2 border-green-500" 
              : "bg-gradient-to-br from-red-900/80 to-purple-900/80 border-2 border-red-500"
          }`}>
            <div className="text-4xl md:text-6xl font-bold mb-4">
              {isCorrect ? "🎉 Perfect Orbit! 🚀" : "💥 Try Again!"}
            </div>
            <p className="text-lg">
              {isCorrect 
                ? "You've mastered the cosmic order!" 
                : "The planets aren't aligned correctly yet."}
            </p>
          </div>
        </div>
      )}

      {/* Planet Facts */}
      {showFacts && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 p-6 rounded-2xl border-2 border-blue-500 max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Solar System Facts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {correctOrder.map(planet => (
                <div key={planet} className="bg-white/10 p-4 rounded-xl">
                  {/* Planet image and name */}
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={planetStyles[planet as keyof typeof planetStyles]?.image}
                      alt={planet}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                    <h3 className="text-xl font-bold">{planet}</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    {planetStyles[planet as keyof typeof planetStyles]?.fact}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-green-400 to-blue-500 px-6 py-2 rounded-xl font-bold 
                hover:from-pink-500 hover:to-purple-500 transition-all duration-300 hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {celebrate && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-celebrate"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                '--tx': `${Math.random() * 200 - 100}px`,
                '--ty': `${Math.random() * 200 - 100}px`,
                animationDelay: `${i * 0.02}s`,
              } as React.CSSProperties}
            >
              {["✨", "🌟", "💫", "🌠"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes star {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes celebrate {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) rotate(720deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s forwards;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .animate-celebrate {
          animation: celebrate 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}