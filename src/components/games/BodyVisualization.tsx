import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface BodyPart {
  id: string;
  name: string;
  description: string;
  learned: number;
  funFact: string;
  sound?: string;
}

interface BodyVisualizationProps {
  bodyParts: BodyPart[];
  updateProgress: (bodyPartId: string, value: number) => void;
}

const BodyVisualization = ({ bodyParts, updateProgress }: BodyVisualizationProps) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [animateBody, setAnimateBody] = useState(false);

  // Initial body parts if not provided
  const defaultBodyParts: BodyPart[] = [
    {
      id: 'brain',
      name: 'The Amazing Brain',
      description: 'Your brain is like a super computer! It helps you think, learn, and remember things. It also controls your whole body!',
      learned: 0,
      funFact: 'Your brain is wrinkly to fit more thinking power in your head!'
    },
    {
      id: 'heart',
      name: 'The Busy Heart',
      description: 'Your heart is a special muscle that pumps blood all around your body. It gives your body energy to run and play!',
      learned: 0,
      funFact: 'Your heart is about the size of your fist and beats over 100,000 times every day!'
    },
    {
      id: 'lungs',
      name: 'The Balloon Lungs',
      description: 'Your lungs help you breathe! When you breathe in, they fill up with air like balloons. They give oxygen to your blood.',
      learned: 0,
      funFact: 'If you stretched out your lungs, they would be as big as a tennis court!'
    },
    {
      id: 'stomach',
      name: 'The Hungry Tummy',
      description: 'Your tummy breaks down all the yummy food you eat into tiny pieces. This gives you energy to grow big and strong!',
      learned: 0,
      funFact: 'Your tummy makes rumbling sounds when you\'re hungry because it\'s telling you it\'s time to eat!'
    },
    {
      id: 'bones',
      name: 'Strong Bones',
      description: 'Your bones are super strong and help you stand tall! They protect the squishy parts inside your body.',
      learned: 0,
      funFact: 'You have 206 bones in your body, and the smallest one is in your ear!'
    },
    {
      id: 'muscles',
      name: 'Mighty Muscles',
      description: 'Your muscles help you move, jump, and play! When you exercise, your muscles get stronger and stronger!',
      learned: 0,
      funFact: 'You use over 30 muscles just to smile!'
    },
  ];

  const partsToUse = bodyParts.length > 0 ? bodyParts : defaultBodyParts;
  
  useEffect(() => {
    if (celebration) {
      const timer = setTimeout(() => setCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [celebration]);

  const playSoundEffect = () => {
    // In a real implementation, this would play a fun sound effect
    console.log("Playing fun sound effect!");
  };

  const handlePartClick = (partId: string) => {
    playSoundEffect();
    setSelectedPart(partId);
    setShowTooltip(true);
    // This is the critical line: pass the selected part ID back to the parent component
    updateProgress(partId, 5);
  };

  const handleLearnedClick = () => {
    if (selectedPart) {
      playSoundEffect();
      updateProgress(selectedPart, 10);
      setCelebration(true);
      setShowTooltip(false);
    }
  };

  const handleWiggle = () => {
    setAnimateBody(true);
    setTimeout(() => setAnimateBody(false), 1000);
  };

  const getBodyPartColor = (partId: string) => {
    const part = partsToUse.find(p => p.id === partId);
    const learningLevel = part ? part.learned : 0;
    
    switch (partId) {
      case 'brain': 
        return selectedPart === 'brain' 
          ? '#93c5fd' 
          : learningLevel > 50 ? '#60a5fa' : '#dbeafe';
      case 'heart': 
        return selectedPart === 'heart' 
          ? '#fca5a5' 
          : learningLevel > 50 ? '#f87171' : '#fee2e2';
      case 'lungs': 
        return selectedPart === 'lungs' 
          ? '#a5b4fc' 
          : learningLevel > 50 ? '#818cf8' : '#e0e7ff';
      case 'stomach': 
        return selectedPart === 'stomach' 
          ? '#fdba74' 
          : learningLevel > 50 ? '#fb923c' : '#ffedd5';
      case 'bones': 
        return selectedPart === 'bones' 
          ? '#a3a3a3' 
          : learningLevel > 50 ? '#737373' : '#e5e5e5';
      case 'muscles': 
        return selectedPart === 'muscles' 
          ? '#f87171' 
          : learningLevel > 50 ? '#ef4444' : '#fecaca';
      default: 
        return '#e5e5e5';
    }
  };

  return (
    <div className="relative h-full bg-blue-50 rounded-xl p-6 border-4 border-blue-300">
      <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center">
        My Amazing Body Adventure!
        <button 
          className="ml-4 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
          onClick={handleWiggle}
        >
          Wiggle!
        </button>
      </h2>
      
      <p className="mb-6 text-lg text-purple-700 font-medium">
        Click on the different parts to learn cool body facts! 👉
      </p>
      
      <div className="relative w-full h-96 md:h-128 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg overflow-hidden border-2 border-blue-300">
        {/* SVG Body Outline Container */}
        <div className="relative w-full h-full">
          {/* SVG of human body outline with animations */}
          <svg 
            viewBox="0 0 200 400" 
            className={`h-full mx-auto ${animateBody ? 'animate-bounce' : ''}`}
          >
            {/* Simple body outline with fun colors */}
            <path 
              d="M100,30 C130,30 150,60 150,80 C150,100 140,120 140,140 
                C140,160 150,180 150,220 C150,260 130,300 100,350 
                C70,300 50,260 50,220 C50,180 60,160 60,140 
                C60,120 50,100 50,80 C50,60 70,30 100,30z" 
              fill="#f3f4f6" 
              stroke="#60a5fa" 
              strokeWidth="3"
              className="transition-all duration-300"
            />
            
            {/* Head with face */}
            <circle cx="100" cy="20" r="18" fill="#f3f4f6" stroke="#60a5fa" strokeWidth="3" />
            
            {/* Simple face */}
            <circle cx="93" cy="15" r="2" fill="#1e3a8a" /> {/* Left eye */}
            <circle cx="107" cy="15" r="2" fill="#1e3a8a" /> {/* Right eye */}
            <path d="M93,25 Q100,30 107,25" fill="none" stroke="#1e3a8a" strokeWidth="2" /> {/* Smile */}
            
            {/* Interactive body parts with animations */}
            <circle 
              id="brain" 
              cx="100" cy="15" r="12" 
              fill={getBodyPartColor('brain')}
              stroke="#3b82f6" 
              strokeWidth="2"
              className="cursor-pointer hover:fill-blue-300 transition-colors hover:scale-110 transform duration-300"
              onClick={() => handlePartClick('brain')}
            />
            
            <circle 
              id="heart" 
              cx="95" cy="100" r="12" 
              fill={getBodyPartColor('heart')}
              stroke="#ef4444" 
              strokeWidth="2"
              className={`cursor-pointer hover:fill-red-300 transition-colors ${selectedPart === 'heart' ? 'animate-pulse' : ''}`}
              onClick={() => handlePartClick('heart')}
            />
            
            <rect 
              id="lungs" 
              x="75" y="85" width="50" height="30" 
              rx="10" ry="10"
              fill={getBodyPartColor('lungs')}
              stroke="#6366f1" 
              strokeWidth="2"
              className="cursor-pointer hover:fill-indigo-300 transition-colors"
              onClick={() => handlePartClick('lungs')}
            />
            
            <ellipse 
              id="stomach" 
              cx="100" cy="150" rx="22" ry="18" 
              fill={getBodyPartColor('stomach')}
              stroke="#f97316" 
              strokeWidth="2"
              className="cursor-pointer hover:fill-orange-300 transition-colors"
              onClick={() => handlePartClick('stomach')}
            />
            
            <path 
              id="bones" 
              d="M90,180 L90,300 M110,180 L110,300 M90,220 L110,220 M90,260 L110,260" 
              stroke={getBodyPartColor('bones')}
              strokeWidth="8" 
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-gray-400 transition-colors"
              onClick={() => handlePartClick('bones')}
            />
            
            <path 
              id="muscles" 
              d="M75,200 C65,210 65,230 75,240 C85,250 85,270 75,280"
              stroke={getBodyPartColor('muscles')}
              strokeWidth="10" 
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-red-400 transition-colors"
              onClick={() => handlePartClick('muscles')}
            />
            <path 
              id="muscles-right" 
              d="M125,200 C135,210 135,230 125,240 C115,250 115,270 125,280"
              stroke={getBodyPartColor('muscles')}
              strokeWidth="10" 
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-red-400 transition-colors"
              onClick={() => handlePartClick('muscles')}
            />
            
            {/* Labels to make it more obvious what to click */}
            <text x="100" y="5" textAnchor="middle" fill="#3b82f6" fontSize="6" className="pointer-events-none">BRAIN</text>
            <text x="95" y="100" textAnchor="middle" fill="#ef4444" fontSize="6" className="pointer-events-none">HEART</text>
            <text x="100" y="100" textAnchor="middle" fill="#6366f1" fontSize="6" className="pointer-events-none">LUNGS</text>
            <text x="100" y="150" textAnchor="middle" fill="#f97316" fontSize="6" className="pointer-events-none">TUMMY</text>
            <text x="100" y="240" textAnchor="middle" fill="#525252" fontSize="6" className="pointer-events-none">BONES</text>
            <text x="60" y="240" textAnchor="middle" fill="#ef4444" fontSize="6" className="pointer-events-none">MUSCLES</text>
          </svg>
          
          {/* Fun celebration elements */}
          {celebration && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#f87171', '#60a5fa', '#4ade80', '#facc15'][Math.floor(Math.random() * 4)],
                    width: `${Math.random() * 15 + 5}px`,
                    height: `${Math.random() * 15 + 5}px`,
                    borderRadius: '50%',
                    animationDuration: `${Math.random() * 2 + 1}s`
                  }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Sparkles size={80} className="text-yellow-400 animate-pulse" />
              </div>
            </div>
          )}
          
          {/* Kid-friendly tooltip */}
          {showTooltip && selectedPart && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg max-w-xs border-4 border-purple-500">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <svg width="30" height="30" viewBox="0 0 30 30">
                  <polygon points="15,0 30,30 0,30" fill="#a855f7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-purple-700 mb-2">
                {partsToUse.find(part => part.id === selectedPart)?.name}
              </h3>
              
              <p className="text-gray-700 text-lg">
                {partsToUse.find(part => part.id === selectedPart)?.description}
              </p>
              
              <div className="mt-3 bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
                <p className="text-yellow-800 font-medium">
                  <span className="font-bold">WOW FACT:</span> {partsToUse.find(part => part.id === selectedPart)?.funFact}
                </p>
              </div>
              
              <button 
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center w-full text-lg font-bold shadow-md"
                onClick={handleLearnedClick}
              >
                <Sparkles size={20} className="mr-2" />
                I learned this!
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-purple-100 p-4 rounded-lg border-2 border-purple-300">
        <h3 className="text-2xl font-bold text-purple-700 mb-3 flex items-center">
          <span className="mr-2">🔍</span> Your Body Adventure Guide
        </h3>
        
        <p className="text-gray-700 mb-3 text-lg">
          Your body is like a super cool machine with many parts that work together! 
          Click on the different colorful parts of the body to learn what each part does.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {partsToUse.map(part => (
            <div 
              key={part.id}
              className={`p-3 rounded-lg border-2 ${
                part.learned > 50 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-gray-100 border-gray-300'
              } cursor-pointer hover:shadow-md transition-all`}
              onClick={() => handlePartClick(part.id)}
            >
              <h4 className="font-bold">{part.name}</h4>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${part.learned}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyVisualization;