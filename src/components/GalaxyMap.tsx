import React from 'react';
import { cn } from '@/lib/utils';
import {
  Rocket,
  Satellite,
  Atom,
  Music,
  Paintbrush,
  Globe,
  FlaskConical,
  BookOpen,
  Dumbbell,
  Code,
  HeartPulse,
  Users,
  BrainCircuit,
  Clock,
  Languages
} from 'lucide-react';
import { Link } from "react-router-dom";

interface PlanetNodeProps {
  title: string;
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
  progress?: number;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  style?: React.CSSProperties;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitStartPosition?: number;
}

const PlanetNode: React.FC<PlanetNodeProps> = ({ 
  title, 
  icon, 
  className, 
  onClick,
  progress = 0,
  position,
  style,
  orbitRadius = 0,
  orbitSpeed = 20,
  orbitStartPosition = 0,
}) => {
  return (
    <div 
      className="absolute origin-center animate-orbit"
      style={{ 
        top: position.top, 
        left: position.left,
        right: position.right,
        bottom: position.bottom,
        '--orbit-radius': `${orbitRadius}px`,
        animationDuration: `${orbitSpeed}s`,
        animationDelay: `-${orbitStartPosition / 360 * orbitSpeed}s`,
        ...style
      } as React.CSSProperties}
    >
      <div className="relative group -translate-x-1/2 -translate-y-1/2">
        <button 
          onClick={onClick} 
          className={cn(
            "planet w-20 h-20 flex items-center justify-center relative z-10 transition-transform hover:scale-110",
            className
          )}
        >
          <div className="absolute inset-0 rounded-full overflow-hidden bg-black/30">
            <div 
              className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"
              style={{ 
                clipPath: `polygon(0 0, 50% 0, 50% 100%, 0 100%)`,
                transform: `rotate(${progress * 3.6}deg)`
              }}
            />
            <div 
              className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"
              style={{ 
                clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%)`,
                transform: `rotate(${180 + (progress * 3.6)}deg)`
              }}
            />
          </div>
          <span className="relative z-10">
            {icon}
          </span>
        </button>
        <div className="absolute top-full left-1/2 mt-4 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1 rounded-full shadow-space text-sm whitespace-nowrap z-20 border border-white/10 text-black font-medium">
          {title}
        </div>
      </div>
    </div>
  );
};

interface GalaxyMapProps {
  onNodeSelect: (subject: string) => void;
}

const GalaxyMap: React.FC<GalaxyMapProps> = ({ onNodeSelect }) => {
  // Generate animated stars
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`
      };
      stars.push(
        <div 
          key={i} 
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={style}
        />
      );
    }
    return stars;
  };

  return (
    <div className="galaxy-container relative h-full w-full bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {generateStars()}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="stellar-core w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-600 blur-2xl opacity-30 rounded-full" />
          <div className="stellar-core-glow w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full absolute inset-0 m-auto" />
        </div>
      </div>

      {/* Orbital rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[1, 2, 3, 4].map((orbit) => (
          <div
            key={orbit}
            className="absolute border border-white/10 rounded-full"
            style={{
              width: `${orbit * 300}px`,
              height: `${orbit * 300}px`,
              top: `-${orbit * 150}px`,
              left: `-${orbit * 150}px`,
            }}
          />
        ))}
      </div>

      {/* Planet nodes */}
      <PlanetNode 
        title="Math" 
        icon={<Atom className="text-white" size={28} />} 
        onClick={() => onNodeSelect('math')}
        progress={60}
        position={{ top: "50%", left: "50%" }}
        orbitRadius={150}
        orbitSpeed={20}
        orbitStartPosition={0}
        className="bg-blue-500/80 hover:bg-blue-400/90"
      />

      <PlanetNode 
        title="English" 
        icon={<BookOpen className="text-white" size={28} />} 
        onClick={() => onNodeSelect('english')}
        progress={35}
        position={{ top: "50%", left: "50%" }}
        orbitRadius={250}
        orbitSpeed={25}
        orbitStartPosition={72}
        className="bg-purple-500/80 hover:bg-purple-400/90"
      />

      <PlanetNode 
        title="Science" 
        icon={<FlaskConical className="text-white" size={28} />} 
        onClick={() => onNodeSelect('science')}
        progress={45}
        position={{ top: "50%", left: "50%" }}
        orbitRadius={200}
        orbitSpeed={22}
        orbitStartPosition={144}
        className="bg-green-500/80 hover:bg-green-400/90"
      />

      <PlanetNode 
        title="Life Skills" 
        icon={<Users className="text-white" size={28} />} 
        onClick={() => onNodeSelect('life-skills')}
        progress={75}
        position={{ top: "50%", left: "50%" }}
        orbitRadius={300}
        orbitSpeed={28}
        orbitStartPosition={216}
        className="bg-orange-500/80 hover:bg-orange-400/90"
      />

      <PlanetNode 
        title="Emotions" 
        icon={<HeartPulse className="text-white" size={28} />} 
        onClick={() => onNodeSelect('emotions')}
        progress={50}
        position={{ top: "50%", left: "50%" }}
        orbitRadius={180}
        orbitSpeed={18}
        orbitStartPosition={288}
        className="bg-pink-500/80 hover:bg-pink-400/90"
      />

      <PlanetNode 
        title="Memory Games" 
        icon={<BrainCircuit className="text-white" size={28} />} 
        onClick={() => onNodeSelect('memory')}
        progress={25}
        position={{ top: "50%", left: "50%" }}
        orbitRadius={350}
        orbitSpeed={30}
        orbitStartPosition={230}
        className="bg-indigo-500/80 hover:bg-indigo-400/90"
      />

      {/* Additional decorative elements */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-pulse text-center text-white">
          <div className="text-lg font-bold mb-2">Galaxy of Knowledge</div>
        </div>
      </div>
      
      {/* Planet Match Game Button */}
      <div className="absolute bottom-8 right-8">
        <Link
          to="/games/planet-match"
          className="bg-yellow-300 text-blue-950 px-4 py-2 rounded-full 
            font-bold shadow-lg hover:scale-105 transition-transform
            flex items-center space-x-2"
        >
          <span>🪐</span>
          <span>Play Planet Match</span>
        </Link>
      </div>

      {/* Orbit Builder Button */}
      <div className="absolute bottom-8 left-8">
        <Link
          to="/games/orbit-builder"
          className="bg-purple-400 text-blue-950 px-4 py-2 rounded-full 
            font-bold shadow-lg hover:scale-105 transition-transform
            flex items-center space-x-2"
        >
          <span>🌌</span>
          <span>Orbit Builder</span>
        </Link>
        <Link 
        to="/games/rocket-launch"
        className="absolute bottom-8 right-8 bg-gradient-to-r from-red-500 to-orange-500 
        hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl
        transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
        flex items-center gap-2 z-10"
      >
        <span className="text-2xl">🚀</span>
        <span>Launch Rocket</span>
      </Link>
      </div>
    </div>
  );
};

export default GalaxyMap;