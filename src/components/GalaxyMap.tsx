import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';


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

interface PlanetData {
  id: string;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface GalaxyMapProps {
  onNodeSelect: (subject: string) => void;
}

const GalaxyMap: React.FC<GalaxyMapProps> = ({ onNodeSelect }) => {
  const { userData, currentUser } = useAuth();
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Function to generate a random position within an orbit
  const generateRandomOrbit = (orbitIndex: number) => {
    const baseRadius = 150;
    const radius = baseRadius + (orbitIndex * 50);
    const angle = Math.random() * 360;
    const orbitSpeed = 15 + Math.random() * 20;
    return {
      radius,
      startPosition: angle,
      speed: orbitSpeed
    };
  };

  // Map icon name to component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Rocket': <Rocket className="text-white" size={28} />,
      'Satellite': <Satellite className="text-white" size={28} />,
      'Atom': <Atom className="text-white" size={28} />,
      'Globe': <Globe className="text-white" size={28} />,
      'Music': <Music className="text-white" size={28} />,
      'FlaskConical': <FlaskConical className="text-white" size={28} />,
      'BookOpen': <BookOpen className="text-white" size={28} />,
      'Code': <Code className="text-white" size={28} />
    };
    
    return iconMap[iconName] || <Atom className="text-white" size={28} />;
  };

  useEffect(() => {
    const fetchPlanets = async () => {
      if (!userData) return;
      
      // Check if the user's interest is "Astronaut"
      if (userData.interest === "Astronaut") {
        try {
          setLoading(true);
          const ageCategory = userData.ageCategory || "Adults";
          
          let planetsRef;
          let defaultPlanets: PlanetData[] = [];
          
          // Get the collection reference based on age category
          if (ageCategory === "Adults") {
            planetsRef = collection(db, "astronaut", "Adults", "planets");
            defaultPlanets = [
              {
                id: "mars",
                title: "Mars Mission",
                description: "Learn about Mars exploration",
                color: "red",
                icon: "Rocket"
              },
              {
                id: "iss",
                title: "ISS Operations",
                description: "International Space Station",
                color: "blue",
                icon: "Satellite"
              },
              {
                id: "moon",
                title: "Lunar Base",
                description: "Moon colonization studies",
                color: "purple",
                icon: "Globe"
              },
              {
                id: "physics",
                title: "Space Physics",
                description: "Advanced physics for space travel",
                color: "green",
                icon: "Atom"
              }
            ];
          } else if (ageCategory === "Teens") {
            planetsRef = collection(db, "astronaut", "Teens", "planets");
            defaultPlanets = [
              {
                id: "space-academy",
                title: "Space Academy",
                description: "Introduction to space training",
                color: "blue",
                icon: "BookOpen"
              },
              {
                id: "satellite",
                title: "Satellite Design",
                description: "Learn to design satellites",
                color: "green",
                icon: "Satellite"
              },
              {
                id: "astronomy",
                title: "Astronomy Basics",
                description: "Understanding our solar system",
                color: "purple",
                icon: "Globe"
              },
              {
                id: "rocketry",
                title: "Junior Rocketry",
                description: "Build your first rocket",
                color: "red",
                icon: "Rocket"
              }
            ];
          } else if (ageCategory === "Kids") {
            planetsRef = collection(db, "astronaut", "Kids", "planets");
            defaultPlanets = [
              {
                id: "space-fun",
                title: "Space Fun",
                description: "Fun activities about space",
                color: "yellow",
                icon: "Rocket"
              },
              {
                id: "star-explorer",
                title: "Star Explorer",
                description: "Learn about stars and constellations",
                color: "purple",
                icon: "BookOpen"
              },
              {
                id: "planet-adventure",
                title: "Planet Adventure",
                description: "Discover planets in our solar system",
                color: "blue",
                icon: "Globe"
              },
              {
                id: "space-games",
                title: "Space Games",
                description: "Fun games about space",
                color: "green",
                icon: "Satellite"
              }
            ];
          }
          
          if (planetsRef) {
            // Fetch planets from Firestore
            const snapshot = await getDocs(planetsRef);
            
            const planetData: PlanetData[] = [];
            snapshot.forEach(doc => {
              planetData.push({
                id: doc.id,
                ...doc.data() as Omit<PlanetData, 'id'>
              });
            });
            
            // If no planets found in Firestore, use default planets for testing
            if (planetData.length === 0) {
              console.log(`No planets found in Firestore for ${ageCategory}, using default data`);
              setPlanets(defaultPlanets);
            } else {
              setPlanets(planetData);
            }
          }
        } catch (error) {
          console.error("Error fetching planet data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPlanets();
  }, [userData]);

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

      {/* Dynamic Planet nodes based on user interest and age category */}
      {userData?.interest === "Astronaut" && planets.map((planet, index) => {
        const orbit = generateRandomOrbit(index % 4 + 1);
        return (
          <PlanetNode 
            key={planet.id}
            title={planet.title} 
            icon={getIconComponent(planet.icon || 'Atom')}
            onClick={() => onNodeSelect(planet.id)}
            progress={Math.floor(Math.random() * 100)}
            position={{ top: "50%", left: "50%" }}
            orbitRadius={orbit.radius}
            orbitSpeed={orbit.speed}
            orbitStartPosition={orbit.startPosition}
            className={`bg-${planet.color || 'blue'}-500/80 hover:bg-${planet.color || 'blue'}-400/90`}
          />
        );
      })}

      {/* Display default planets if no user data or not astronaut interest */}
      {(!userData?.interest || userData.interest !== "Astronaut" || planets.length === 0) && (
        <>
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
        </>
      )}

      {/* Additional decorative elements */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-pulse text-center text-white">
          <div className="text-lg font-bold mb-2">Galaxy of Knowledge</div>
          {userData?.interest === "Astronaut" && (
            <div className="text-md opacity-80">{userData.ageCategory || ""} Astronaut Training</div>
          )}
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

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default GalaxyMap;