import React, { useState, useEffect } from "react";

type ShapeType = "circle" | "square" | "triangle";
type Particle = { id: number; x: number; y: number; type: 'sparkle' | 'burst'; color: string };

interface Shape {
  id: number;
  type: ShapeType;
}

const initialShapes: Shape[] = [
  { id: 1, type: "circle" },
  { id: 2, type: "square" },
  { id: 3, type: "triangle" },
];

export const ShapeLab: React.FC = () => {
  const [draggedShape, setDraggedShape] = useState<Shape | null>(null);
  const [matched, setMatched] = useState<ShapeType[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [celebrate, setCelebrate] = useState(false);
  const [labPowered, setLabPowered] = useState(false);

  // Theme colors
  const shapeColors = {
    circle: "#FF5E78",
    square: "#00E1D9",
    triangle: "#FFBE0B"
  };

  useEffect(() => {
    // Lab power-up sequence on load
    const timer = setTimeout(() => {
      setLabPowered(true);
      playSound('startup');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDragStart = (shape: Shape) => {
    setDraggedShape(shape);
    playSound('pickup');
  };

  const handleDrop = (targetType: ShapeType) => {
    if (draggedShape?.type === targetType) {
      setMatched((prev) => [...prev, targetType]);
      createParticles(targetType);
      playSound('success');
      if (matched.length + 1 === initialShapes.length) {
        setCelebrate(true);
        setTimeout(() => playSound('complete'), 300);
      }
    } else {
      playSound('error');
      // Create "error" particles
      createParticles(targetType, true);
    }
    setDraggedShape(null);
  };

  const createParticles = (type: ShapeType, isError = false) => {
    const color = isError ? "#FF5252" : shapeColors[type];
    const particleCount = isError ? 8 : 15;
    
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: Math.random() > 0.5 ? 'sparkle' : 'burst',
      color
    }));
    
    setParticles((prev) => {
      const combinedParticles = [...prev, ...newParticles];
      return combinedParticles.slice(-50);
    });
  };

  const playSound = (type: 'success' | 'error' | 'pickup' | 'startup' | 'complete') => {
    const sounds = {
      success: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      error: 'https://assets.mixkit.co/active_storage/sfx/2747/2747-preview.mp3',
      pickup: 'https://assets.mixkit.co/active_storage/sfx/2497/2497-preview.mp3',
      startup: 'https://assets.mixkit.co/active_storage/sfx/43/43-preview.mp3',
      complete: 'https://assets.mixkit.co/active_storage/sfx/1010/1010-preview.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = type === 'startup' ? 0.3 : 0.5;
    audio.play();
  };

  useEffect(() => {
    if (celebrate) {
      const timer = setTimeout(() => setCelebrate(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [celebrate]);

  const resetGame = () => {
    setMatched([]);
    setCelebrate(false);
    playSound('startup');
  };

  // Render different shape outlines for the drop zones
  const renderDropZoneShape = (type: ShapeType) => {
    const isMatched = matched.includes(type);
    const color = shapeColors[type];
    
    switch(type) {
      case "circle":
        return (
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: `3px dashed ${isMatched ? color : '#666'}`,
            opacity: isMatched ? 0.3 : 0.8
          }} />
        );
      case "square":
        return (
          <div style={{
            width: '60px',
            height: '60px',
            border: `3px dashed ${isMatched ? color : '#666'}`,
            opacity: isMatched ? 0.3 : 0.8
          }} />
        );
      case "triangle":
        return (
          <div style={{
            width: 0,
            height: 0,
            borderLeft: '30px solid transparent',
            borderRight: '30px solid transparent',
            borderBottom: `60px solid ${isMatched ? color : '#666'}`,
            opacity: isMatched ? 0.3 : 0.8
          }} />
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* Laboratory Equipment Decorations */}
      <div style={styles.labDecor}>
        <div style={styles.beaker} />
        <div style={styles.tube} />
        <div style={{...styles.beaker, left: '80%', height: '120px'}} />
        <div style={{...styles.tube, left: '10%', transform: 'rotate(45deg)'}} />
      </div>

      {/* Power-up Animation */}
      <div style={{...styles.powerUpOverlay, opacity: labPowered ? 0 : 1}}>
        <div style={styles.powerButton}>⚡</div>
        <div style={styles.loadingBar}>
          <div style={styles.loadingProgress} />
        </div>
        <div style={styles.powerText}>INITIALIZING LAB SYSTEMS</div>
      </div>

      <header style={styles.header}>
        <div style={styles.labControls}>
          <div style={styles.knob} />
          <div style={styles.button} />
          <div style={styles.switch} />
        </div>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>🧪</span>
          <span style={styles.titleText}>MAD SHAPE LAB</span>
          <span style={styles.titleIcon}>⚗️</span>
        </h1>
        <div style={styles.labControls}>
          <div style={styles.switch} />
          <div style={styles.button} />
          <div style={styles.knob} />
        </div>
      </header>
      
      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            ...styles.particle,
            ...(p.type === 'sparkle' ? styles.sparkle : styles.burst),
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color
          }}
          onAnimationEnd={() => setParticles(prev => prev.filter(part => part.id !== p.id))}
        />
      ))}

      {/* Bubbling background elements */}
      <div style={styles.bubbles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`bubble-${i}`} 
            style={{
              ...styles.bubble,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
              opacity: 0.1 + Math.random() * 0.2
            }}
          />
        ))}
      </div>

      {/* Celebration Overlay */}
      {celebrate && (
        <div style={styles.celebration}>
          <div style={styles.fireworks}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={`fw-${i}`}
                style={{
                  ...styles.firework,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: Object.values(shapeColors)[i % 3],
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          <div style={styles.celebrationBox}>
            <h2 style={styles.celebrationTitle}>FORMULA COMPLETE!</h2>
            <p style={styles.celebrationText}>All shapes successfully matched!</p>
            <button 
              style={styles.resetButton}
              onClick={resetGame}
            >
              NEW EXPERIMENT
            </button>
          </div>
        </div>
      )}

      <div style={styles.labPanel}>
        <div style={styles.panelLabel}>AVAILABLE COMPOUNDS</div>
        <div style={styles.shapesSection}>
          {initialShapes.map((shape) => (
            !matched.includes(shape.type) && (
              <div
                key={shape.id}
                style={{
                  ...styles.shape,
                  ...(shape.type === "circle" && styles.circle),
                  ...(shape.type === "square" && styles.square),
                  ...(shape.type === "triangle" && styles.triangle),
                  backgroundColor: shapeColors[shape.type],
                  ...(draggedShape?.id === shape.id ? styles.dragging : {}),
                }}
                draggable
                onDragStart={() => handleDragStart(shape)}
                onDragEnd={() => setDraggedShape(null)}
              >
                <div style={styles.shapeGlow} />
                <div style={styles.shapePulse} />
              </div>
            )
          ))}
        </div>
      </div>

      <div style={styles.labTableSection}>
        <div style={styles.scanLines} />
        <div style={styles.dropZoneSection}>
          {(["circle", "square", "triangle"] as ShapeType[]).map((type) => (
            <div
              key={type}
              style={{
                ...styles.dropZone,
                ...(matched.includes(type) ? styles.matched : {}),
                ...(draggedShape?.type === type ? styles.activeHover : {}),
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(type)}
            >
              <div style={styles.targetGlow} />
              <div style={styles.targetRing} />
              
              {matched.includes(type) ? (
                <div style={styles.successContent}>
                  <div style={{
                    ...styles[type],
                    backgroundColor: shapeColors[type],
                    width: '60px',
                    height: '60px',
                    position: 'relative',
                    animation: 'float 2s infinite ease-in-out'
                  }}>
                    <div style={styles.successStar}>✨</div>
                  </div>
                </div>
              ) : (
                <div style={styles.dropZoneContent}>
                  {renderDropZoneShape(type)}
                  <div style={styles.dropLabel}>{type.toUpperCase()}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>DISCOVERY PROGRESS</div>
        <div style={styles.progress}>
          <div 
            style={{
              ...styles.progressBar,
              width: `${(matched.length / initialShapes.length) * 100}%`
            }}
          />
          <div style={styles.progressMarkers}>
            {Array.from({ length: initialShapes.length + 1 }).map((_, i) => (
              <div 
                key={`marker-${i}`}
                style={{
                  ...styles.progressMark,
                  backgroundColor: i <= matched.length ? '#4ECDC4' : '#333'
                }}
              />
            ))}
          </div>
          <span style={styles.progressText}>
            {matched.length}/{initialShapes.length}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px currentColor; }
          50% { box-shadow: 0 0 30px currentColor; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bubble {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
        @keyframes particle-float {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(calc(Math.random() * 100px - 50px), -100px) scale(0); opacity: 0; }
        }
        @keyframes firework {
          0% { transform: scale(0); opacity: 1; box-shadow: 0 0 0 0 currentColor; }
          50% { opacity: 1; }
          100% { transform: scale(15); opacity: 0; box-shadow: 0 0 20px 10px transparent; }
        }
        @keyframes appear {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        @keyframes shine {
          0% { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #121638 0%, #090A1A 100%)',
    padding: '1rem',
    fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
    textAlign: 'center' as const,
    position: 'relative',
    overflow: 'hidden',
    color: '#E4F1FE',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderBottom: '2px solid rgba(78, 205, 196, 0.3)',
  },
  title: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  titleText: {
    background: 'linear-gradient(90deg, #FF5E78, #00E1D9)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    fontWeight: 'bold',
    fontSize: '2.2rem',
    letterSpacing: '2px',
    padding: '0 1rem',
    position: 'relative',
  },
  titleIcon: {
    fontSize: '1.8rem',
    animation: 'float 3s infinite ease-in-out',
  },
  labPanel: {
    background: 'rgba(18, 22, 56, 0.6)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(78, 205, 196, 0.3)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    animation: 'appear 0.5s ease-out',
  },
  panelLabel: {
    fontSize: '0.8rem',
    color: '#4ECDC4',
    letterSpacing: '1px',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  shapesSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '1rem',
  },
  shape: {
    width: '80px',
    height: '80px',
    cursor: 'grab',
    transition: 'all 0.3s ease',
    position: 'relative',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    animation: 'float 3s infinite ease-in-out',
  },
  circle: {
    borderRadius: '50%',
  },
  square: {
    borderRadius: '8px',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeft: '40px solid transparent',
    borderRight: '40px solid transparent',
    borderBottom: '80px solid currentColor',
    backgroundColor: 'transparent',
  },
  dragging: {
    opacity: 0.7,
    transform: 'scale(1.2) rotate(5deg)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    animation: 'none',
  },
  shapeGlow: {
    position: 'absolute',
    inset: '-10px',
    borderRadius: 'inherit',
    background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)',
    opacity: 0.6,
    filter: 'blur(8px)',
  },
  shapePulse: {
    position: 'absolute',
    inset: '-5px',
    borderRadius: 'inherit',
    border: '2px solid rgba(255,255,255,0.5)',
    opacity: 0.6,
    animation: 'pulse 2s infinite',
  },
  labTableSection: {
    position: 'relative',
    background: 'linear-gradient(to bottom, #0E1231, #191F45)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: 'inset 0 0 30px rgba(78, 205, 196, 0.2), 0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  scanLines: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.1) 51%)',
    backgroundSize: '100% 4px',
    pointerEvents: 'none',
    opacity: 0.2,
    animation: 'scanline 8s linear infinite',
    zIndex: 1,
    borderRadius: 'inherit',
  },
  dropZoneSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    padding: '1rem 0',
    position: 'relative',
    zIndex: 2,
  },
  dropZone: {
    width: '130px',
    height: '130px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    backgroundColor: 'rgba(30, 40, 70, 0.6)',
    transition: 'all 0.3s ease',
    position: 'relative',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  dropZoneContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
    zIndex: 2,
  },
  dropLabel: {
    color: '#CCC',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    marginTop: '0.5rem',
    fontWeight: 'bold',
  },
  matched: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    border: '2px solid rgba(46, 204, 113, 0.5)',
    boxShadow: '0 0 20px rgba(46, 204, 113, 0.3)',
  },
  activeHover: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderColor: '#4ECDC4',
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(78, 205, 196, 0.5)',
  },
  targetGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(78, 205, 196, 0.3), transparent 70%)',
    opacity: 0.8,
    animation: 'pulse 3s infinite',
  },
  targetRing: {
    position: 'absolute',
    inset: '-5px',
    border: '2px dashed rgba(78, 205, 196, 0.3)',
    borderRadius: 'inherit',
    animation: 'spin 20s linear infinite',
  },
  successContent: {
    position: 'relative',
    zIndex: 2,
  },
  successStar: {
    position: 'absolute',
    top: '-15px',
    right: '-15px',
    fontSize: '1.5rem',
    animation: 'pulse 1.5s infinite',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  progressLabel: {
    fontSize: '0.8rem',
    color: '#4ECDC4',
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  progress: {
    background: 'rgba(255, 255, 255, 0.1)',
    height: '12px',
    borderRadius: '10px',
    position: 'relative',
    width: '300px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #4ECDC4, #45B7AF)',
    borderRadius: '10px',
    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    zIndex: 5,
    textShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
  },
  progressMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 5px',
  },
  progressMark: {
    width: '4px',
    height: '8px',
    borderRadius: '2px',
    alignSelf: 'center',
    transition: 'background-color 0.3s ease',
  },
  particle: {
    position: 'absolute',
    pointerEvents: 'none',
    animation: 'particle-float 2s ease-out forwards',
    zIndex: 10,
  },
  sparkle: {
    width: '8px',
    height: '8px',
    background: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor',
  },
  burst: {
    width: '12px',
    height: '12px',
    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    boxShadow: '0 0 10px currentColor',
  },
  celebration: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.8)',
    animation: 'appear 0.5s',
    zIndex: 100,
  },
  fireworks: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  firework: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    animation: 'firework 2s ease-out infinite',
    boxShadow: '0 0 20px currentColor',
  },
  celebrationBox: {
    background: 'rgba(18, 22, 56, 0.9)',
    borderRadius: '15px',
    padding: '2rem',
    maxWidth: '400px',
    textAlign: 'center' as const,
    boxShadow: '0 0 30px rgba(78, 205, 196, 0.5)',
    border: '2px solid rgba(78, 205, 196, 0.5)',
    animation: 'appear 0.5s ease-out',
    zIndex: 101,
  },
  celebrationTitle: {
    fontSize: '2rem',
    marginBottom: '1rem',
    background: 'linear-gradient(90deg, #FF5E78, #00E1D9)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 2px 10px rgba(255, 255, 255, 0.1)',
  },
  celebrationText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#E4F1FE',
  },
  resetButton: {
    background: 'linear-gradient(90deg, #4ECDC4, #2A9D8F)',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'inherit',
  },
  bubbles: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  bubble: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: '#4ECDC4',
    bottom: '-20px',
    animation: 'bubble 15s linear infinite',
  },
  labDecor: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    opacity: 0.2,
  },
  beaker: {
    position: 'absolute',
    width: '100px',
    height: '150px',
    borderRadius: '0 0 20px 20px',
    border: '3px solid rgba(255, 255, 255, 0.5)',
    borderTop: 'none',
    bottom: '20px',
    right: '50px',
    opacity: 0.5,
    boxShadow: 'inset 0 0 20px rgba(78, 205, 196, 0.5)',
  },
  tube: {
    position: 'absolute',
    width: '20px',
    height: '200px',
    borderRadius: '10px',
    border: '3px solid rgba(255, 255, 255, 0.5)',
    top: '100px',
    right: '150px',
    opacity: 0.5,
    transform: 'rotate(-30deg)',
    boxShadow: 'inset 0 0 20px rgba(255, 94, 120, 0.5)',
  },
  labControls: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  knob: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#666',
    border: '2px solid #333',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  button: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: '#444',
    border: '2px solid #333',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  switch: {
    width: '30px',
    height: '16px',
    borderRadius: '8px',
    backgroundColor: '#333',
    border: '2px solid #444',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s ease',
  },
}
export default ShapeLab;