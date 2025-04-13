import React, { useState, useEffect } from "react";

type ShapeType = "circle" | "square" | "triangle";
type Particle = { id: number; x: number; y: number; type: 'sparkle' | 'burst' };

interface Shape {
  id: number;
  type: ShapeType;
}

const initialShapes: Shape[] = [
  { id: 1, type: "circle" },
  { id: 2, type: "square" },
  { id: 3, type: "triangle" },
];

const ShapeLab: React.FC = () => {
  const [draggedShape, setDraggedShape] = useState<Shape | null>(null);
  const [matched, setMatched] = useState<ShapeType[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  const handleDragStart = (shape: Shape) => {
    setDraggedShape(shape);
    playSound('pickup');
  };

  const handleDrop = (targetType: ShapeType) => {
    if (draggedShape?.type === targetType) {
      setMatched((prev) => [...prev, targetType]);
      createParticles(targetType);
      playSound('success');
      if (matched.length + 1 === initialShapes.length) setCelebrate(true);
    } else {
      playSound('error');
    }
    setDraggedShape(null);
  };

  const createParticles = (type: ShapeType) => {
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: Math.random() > 0.5 ? 'sparkle' : 'burst'
    }));
    // Fix the particles update to ensure we're not exceeding state update limits
    setParticles((prev) => {
      // Limit the total number of particles to prevent performance issues
      const combinedParticles = [...prev, ...newParticles];
      return combinedParticles.slice(-50); // Keep only the most recent 50 particles
    });
  };

  const playSound = (type: 'success' | 'error' | 'pickup') => {
    const sounds = {
      success: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      error: 'https://assets.mixkit.co/active_storage/sfx/2747/2747-preview.mp3',
      pickup: 'https://assets.mixkit.co/active_storage/sfx/2497/2497-preview.mp3'
    };
    new Audio(sounds[type]).play();
  };

  useEffect(() => {
    if (celebrate) {
      const timer = setTimeout(() => setCelebrate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [celebrate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔬 MAD SHAPE LABORATORY 🧪</h2>
      
      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            ...styles.particle,
            ...styles[p.type],
            left: `${p.x}%`,
            top: `${p.y}%`
          }}
          onAnimationEnd={() => setParticles(prev => prev.filter(part => part.id !== p.id))}
        />
      ))}

      {/* Celebration Overlay */}
      {celebrate && (
        <div style={styles.celebration}>
          <div style={styles.firework} />
          <div style={{ ...styles.firework, animationDelay: '0.2s' }} />
          <div style={{ ...styles.firework, animationDelay: '0.4s' }} />
          <span style={styles.celebrationText}>FORMULA COMPLETE! 🌟</span>
        </div>
      )}

      <div style={styles.shapesSection}>
        {initialShapes.map((shape) => (
          !matched.includes(shape.type) && (
            <div
              key={shape.id}
              style={{
                ...styles.shape,
                ...styles[shape.type],
                ...(draggedShape?.id === shape.id ? styles.dragging : {}),
                transform: `scale(${draggedShape?.id === shape.id ? 1.2 : 1}) 
                  rotate(${draggedShape?.id === shape.id ? '15deg' : '0deg'})`
              }}
              draggable
              onDragStart={() => handleDragStart(shape)}
              onDragEnd={() => setDraggedShape(null)}
            >
              <div style={styles.shapeGlow} />
            </div>
          )
        ))}
      </div>

      <div style={styles.dropZoneSection}>
        {(["circle", "square", "triangle"] as ShapeType[]).map((type) => (
          <div
            key={type}
            style={{
              ...styles.dropZone,
              ...styles[type],
              ...(matched.includes(type) ? styles.matched : {}),
              ...(draggedShape?.type === type ? styles.activeHover : {}),
              transform: `scale(${draggedShape?.type === type ? 1.05 : 1})`
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(type)}
          >
            <div style={styles.targetGlow} />
            {matched.includes(type) ? (
              <div style={styles.successMark}>✨</div>
            ) : (
              <div style={styles.pulsingText}>🔽 {type.toUpperCase()}</div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.progress}>
        <div 
          style={{
            ...styles.progressBar,
            width: `${(matched.length / initialShapes.length) * 100}%`
          }}
        />
        <span style={styles.progressText}>
          DISCOVERY PROGRESS: {matched.length}/{initialShapes.length}
        </span>
      </div>

      <style>{`
        @keyframes title-glow {
          0%, 100% { text-shadow: 0 0 10px #ff6b6b; }
          50% { text-shadow: 0 0 20px #ff6b6b, 0 0 30px #ff6b6b; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg) scale(0); }
          to { transform: rotate(720deg) scale(1); }
        }
        @keyframes particle-float {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50px, -100px) scale(0); opacity: 0; }
        }
        @keyframes firework {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(20); opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes text-pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #020617 0%, #0a0b1a 100%)',
    padding: '2rem',
    fontFamily: "'Comic Sans MS', cursive",
    textAlign: 'center' as const,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    color: '#ff6b6b',
    textShadow: '0 0 10px #ff6b6b',
    animation: 'title-glow 2s infinite',
    fontSize: '2.5rem',
    marginBottom: '2rem',
  },
  shapesSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  shape: {
    width: '80px',
    height: '80px',
    cursor: 'grab',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  circle: {
    borderRadius: '50%',
    backgroundColor: '#fca311',
  },
  square: {
    backgroundColor: '#2a9d8f',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeft: '40px solid transparent',
    borderRight: '40px solid transparent',
    borderBottom: '80px solid #e63946',
    backgroundColor: 'transparent',
  },
  dragging: {
    opacity: 0.7,
    filter: 'drop-shadow(0 0 15px #fff)',
  },
  shapeGlow: {
    position: 'absolute',
    inset: '-5px',
    borderRadius: 'inherit',
    background: 'radial-gradient(circle, #fff, transparent 60%)',
    opacity: 0.3,
  },
  dropZoneSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
  },
  dropZone: {
    width: '100px',
    height: '100px',
    border: '2px dashed #ccc',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
    transition: 'all 0.3s ease',
  },
  matched: {
    backgroundColor: '#90ee90',
    border: '2px solid #2ecc71',
  },
  activeHover: {
    background: 'rgba(255,255,255,0.1)',
    borderColor: '#4ecdc4',
  },
  targetGlow: {
    position: 'absolute',
    inset: '-2px',
    borderRadius: 'inherit',
    background: 'radial-gradient(circle, #4ecdc4, transparent 70%)',
    opacity: 0.3,
  },
  pulsingText: {
    animation: 'pulse 1.5s infinite',
  },
  successMark: {
    fontSize: '2.5em',
    animation: 'spin 1s ease-out',
  },
  progress: {
    marginTop: '2rem',
    background: 'rgba(255,255,255,0.1)',
    height: '20px',
    borderRadius: '10px',
    position: 'relative',
    width: '300px',
    margin: '0 auto',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #4ecdc4, #45b7af)',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '0.8rem',
  },
  particle: {
    position: 'absolute',
    pointerEvents: 'none',
    animation: 'particle-float 1.5s ease-out forwards',
  },
  sparkle: {
    width: '6px',
    height: '6px',
    background: '#fff',
    borderRadius: '50%',
  },
  burst: {
    width: '12px',
    height: '12px',
    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    background: '#4ecdc4',
  },
  celebration: {
    position: 'fixed',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(0,0,0,0.7)',
    animation: 'fadeIn 0.5s',
  },
  celebrationText: {
    fontSize: '3em',
    color: '#fff',
    textShadow: '0 0 20px #4ecdc4',
    animation: 'text-pop 0.5s',
  },
  firework: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: '#fff',
    borderRadius: '50%',
    animation: 'firework 1s ease-out',
  },
};

export default ShapeLab;