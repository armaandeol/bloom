import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const allPlanets = [
  { name: "Earth", img: "../src/components/resources/earth.jpg", color: "#3B82F6" },
  { name: "Mars", img: "../src/components/resources/mars.webp", color: "#EF4444" },
  { name: "Saturn", img: "../src/components/resources/saturn.jpg", color: "#F59E0B" },
  { name: "Jupiter", img: "../src/components/resources/saturn.jpg", color: "#F97316" },
  { name: "Venus", img: "../src/components/resources/venus.webp", color: "#F472B6" },
];

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const PlanetMatch: React.FC = () => {
  // Initialize with shuffled arrays
  const [planets, setPlanets] = useState(() => shuffleArray([...allPlanets]));
  const [targetOrder, setTargetOrder] = useState(() => shuffleArray([...allPlanets]));
  const [matches, setMatches] = useState<{ [key: string]: boolean }>({});
  const [dragged, setDragged] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  // Check if game is complete
  useEffect(() => {
    if (Object.keys(matches).length === allPlanets.length) {
      setGameComplete(true);
    }
  }, [matches]);

  // Reset the game
  const resetGame = () => {
    setPlanets(shuffleArray([...allPlanets]));
    setTargetOrder(shuffleArray([...allPlanets]));
    setMatches({});
    setDragged(null);
    setGameComplete(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0a0b1a 0%, #1a1b2f 100%)',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Back button */}
      <Link 
        to="/"
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          fontSize: '0.9rem'
        }}
      >
        ← Back to Galaxy
      </Link>

      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#fff3a3',
        fontFamily: '"Comic Sans MS", cursive',
        textShadow: '0 0 15px rgba(255, 243, 163, 0.5)'
      }}>
        🌟 Match the Planets! 🌟
      </h1>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Draggable Planets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          {planets.filter(planet => !matches[planet.name]).map(planet => (
            <div
              key={planet.name}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', planet.name);
                setDragged(planet.name);
              }}
              onDragEnd={() => setDragged(null)}
              style={{
                position: 'relative',
                width: '8rem',
                height: '8rem',
                transition: 'all 0.3s ease',
                cursor: 'grab',
                filter: dragged === planet.name ? 
                  'drop-shadow(0 0 15px rgba(255,255,255,0.6))' : 
                  'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
                animation: dragged === planet.name ? 'pulse 1.5s infinite' : 'none'
              }}
            >
              <img
                src={planet.img}
                alt={planet.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  border: `4px solid ${planet.color}`,
                  boxShadow: `0 0 20px ${planet.color}80`
                }}
              />
            </div>
          ))}
        </div>

        {/* Drop Targets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>
          {targetOrder.map(planet => (
            <div
              key={planet.name}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const draggedPlanetName = e.dataTransfer.getData('text/plain');
                if (draggedPlanetName === planet.name) {
                  setMatches(prev => ({ ...prev, [planet.name]: true }));
                }
              }}
              style={{
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '1rem',
                transition: 'all 0.3s ease',
                background: matches[planet.name] ? 
                  'linear-gradient(45deg, #4ade80, #22c55e)' : 
                  'rgba(42, 43, 79, 0.8)',
                border: matches[planet.name] ? 
                  '4px solid #4ade80' : 
                  '4px dashed #fff3a3',
                boxShadow: matches[planet.name] ? 
                  '0 0 20px rgba(74, 222, 128, 0.5)' : 
                  '0 4px 15px rgba(0,0,0,0.2)',
                transform: dragged === planet.name ? 'scale(1.03)' : 'scale(1)'
              }}
            >
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: matches[planet.name] ? '#fff' : '#fff3a3',
                fontFamily: '"Comic Sans MS", cursive',
                margin: 0,
                transition: 'all 0.3s ease'
              }}>
                {planet.name}
                {matches[planet.name] && (
                  <span style={{ 
                    marginLeft: '0.5rem',
                    animation: 'bounce 0.5s ease-out',
                    display: 'inline-block'
                  }}>
                    🎉
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Game completion modal */}
      {gameComplete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 100
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2a2b4f 0%, #1a1b2f 100%)',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            maxWidth: '400px',
            border: '3px solid #fff3a3',
            boxShadow: '0 0 30px rgba(255, 243, 163, 0.3)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              color: '#fff3a3',
              marginBottom: '1rem',
              fontFamily: '"Comic Sans MS", cursive',
            }}>
              🎉 Great Job! 🎉
            </h2>
            <p style={{ color: 'white', marginBottom: '1.5rem' }}>
              You've matched all the planets correctly!
            </p>
            <button 
              onClick={resetGame}
              style={{
                background: '#fff3a3',
                color: '#1a1b2f',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Reset button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={resetGame}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '0.5rem 1.5rem',
            borderRadius: '2rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          Reset Game
        </button>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0% { transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PlanetMatch;