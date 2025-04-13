import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Satellite, 
  Atom, 
  BookOpen, 
  Users, 
  HeartPulse, 
  BrainCircuit,
  FileSpreadsheet,
  User,
  Heart,
  Brain,
  Globe,
  Paintbrush,
  Music,
  Code,
  CheckCircle2,
  CircleDashed,
  Gamepad2,
  Layers,
  HelpCircle,
  PlayCircle
} from "lucide-react";
import MemoryGame from "./games/MemoryGame";
import FlashCard from "./games/FlashCard";
import VideoPlayer from "./games/VideoPlayer";
import Quiz from "./games/Quiz";
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface QuestData {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  order: number;
  type?: 'game' | 'card' | 'quiz' | 'video';
  videoUrl?: string;
}

interface ActivityProps {
  subject: string | null;
  planetTitle?: string;
  onBack: () => void;
}

const ActivityZone: React.FC<ActivityProps> = ({ subject, planetTitle, onBack }) => {
  const { userData, currentUser } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<QuestData | null>(null);
  const [quests, setQuests] = useState<QuestData[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate animated stars
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${Math.random() * 3 + 2}s`
      };
      stars.push(
        <div 
          key={i} 
          className="absolute bg-white rounded-full animate-twinkle"
          style={style}
        />
      );
    }
    return stars;
  };

  // Fetch quests from Firebase if the subject is a planet from the Astronaut interest
  useEffect(() => {
    const fetchQuests = async () => {
      if (!userData || !subject || userData.interest !== "Astronaut") return;

      try {
        setLoading(true);
        const ageCategory = userData.ageCategory || "Adults";
        
        // Path to quests for this planet: astronaut/{ageCategory}/planets/{planetId}/quests
        const questsRef = collection(db, "astronaut", ageCategory, "planets", subject, "quests");
        const snapshot = await getDocs(questsRef);
        
        let questData: QuestData[] = [];
        snapshot.forEach(doc => {
          questData.push({
            id: doc.id,
            ...doc.data() as Omit<QuestData, 'id'>
          });
        });
        
        // Sort quests by order field
        questData.sort((a, b) => a.order - b.order);
        
        // If no quests found, create default quests for testing
        if (questData.length === 0) {
          console.log(`No quests found for planet ${subject}, using default data`);
          questData = [
            {
              id: "quest1",
              title: "Introduction",
              description: "Learn the basics",
              isCompleted: true,
              order: 1,
              type: "video",
              videoUrl: "https://firebasestorage.googleapis.com/v0/b/bloom-6170d.firebasestorage.app/o/astronaut%2FKids%2FVideo%204%20What%20if%20you%20went%20to%20space%20without%20spacesuit.mp4?alt=media&token=27983d57-08bf-423f-be0d-42c93436ed17"
            },
            {
              id: "quest2",
              title: "Basic Training",
              description: "Master the fundamentals",
              isCompleted: true,
              order: 2,
              type: "game"
            },
            {
              id: "quest3",
              title: "Advanced Skills",
              description: "Develop expert skills",
              isCompleted: false,
              order: 3,
              type: "card"
            },
            {
              id: "quest4",
              title: "Final Mission",
              description: "Complete your training",
              isCompleted: false,
              order: 4,
              type: "quiz"
            }
          ];
        }
        
        setQuests(questData);
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuests();
  }, [subject, userData]);

  if (!subject) {
    return (
      <Card className="h-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 border-none shadow-sm rounded-xl">
        <div className="absolute inset-0">
          {generateStars()}
        </div>
        <div className="text-center p-8 z-10">
          <h2 className="text-2xl font-bold mb-4 text-white">Welcome to the Galaxy of Knowledge!</h2>
          <p className="text-lg mb-6 text-blue-100">Select a planet from the galaxy map to start your learning journey!</p>
          <div className="flex justify-center space-x-4">
            <div className="planet-icon bg-blue-500 p-3 rounded-full animate-pulse">
              <FileSpreadsheet className="text-white" size={36} />
            </div>
            <div className="planet-icon bg-purple-500 p-3 rounded-full animate-pulse delay-100">
              <BookOpen className="text-white" size={36} />
            </div>
            <div className="planet-icon bg-orange-500 p-3 rounded-full animate-pulse delay-200">
              <User className="text-white" size={36} />
            </div>
            <div className="planet-icon bg-pink-500 p-3 rounded-full animate-pulse delay-300">
              <Heart className="text-white" size={36} />
            </div>
            <div className="planet-icon bg-indigo-500 p-3 rounded-full animate-pulse delay-400">
              <Brain className="text-white" size={36} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Function to get the appropriate icon based on quest type
  const getQuestTypeIcon = (type?: string) => {
    switch (type) {
      case 'game':
        return <Gamepad2 className="text-white" size={28} />;
      case 'card':
        return <Layers className="text-white" size={28} />;
      case 'quiz':
        return <HelpCircle className="text-white" size={28} />;
      case 'video':
        return <PlayCircle className="text-white" size={28} />;
      default:
        return <CircleDashed className="text-white" size={28} />;
    }
  };

  // Handle back from activity to subject selection
  const handleBackFromActivity = () => {
    console.log("Handling back from activity");
    setSelectedActivity(null);
    setSelectedQuest(null);
  };

  // Function to handle quest click
  const handleQuestClick = (quest: QuestData) => {
    console.log(`Selected quest: ${quest.title}, Type: ${quest.type || 'unknown'}, quest object:`, quest);
    
    // Explicitly check for quest type with fallback for undefined
    const questType = (quest.type || 'unknown').toLowerCase();
    
    if (questType === "card") {
      // For card type quests, set the selected quest
      console.log("Setting selected quest for card type activity");
      setSelectedQuest(quest);
    } else if (questType === "video") {
      // For video type quests, set the selected quest
      console.log("Setting selected quest for video type activity");
      setSelectedQuest(quest);
    } else if (questType === "quiz") {
      // For quiz type quests, set the selected quest
      console.log("Setting selected quest for quiz type activity");
      setSelectedQuest(quest);
    } else {
      // For other types, just set the activity ID
      console.log("Setting selected activity for non-card type:", questType);
      setSelectedActivity(quest.id);
    }
  };

  // If a card type quest is selected, show the FlashCard component
  if (selectedQuest) {
    console.log("Selected quest exists:", selectedQuest);
    if ((selectedQuest.type || '').toLowerCase() === "card") {
      console.log("Selected quest is card type - showing FlashCard");
      return (
        <FlashCard
          questId={selectedQuest.id}
          planetId={subject || ""}
          ageCategory={userData?.ageCategory || "Adults"}
          onBack={handleBackFromActivity}
          onComplete={async () => {
            // Mark quest as completed in the state
            const updatedQuests = quests.map(q => 
              q.id === selectedQuest.id ? { ...q, isCompleted: true } : q
            );
            setQuests(updatedQuests);

            // Update quest completion status in Firebase if user is logged in
            if (currentUser && userData) {
              try {
                const questRef = doc(
                  db, 
                  userData?.ageCategory ? "astronaut" : "",
                  userData?.ageCategory || "Adults", 
                  "planets", 
                  subject || "", 
                  "quests", 
                  selectedQuest.id
                );
                await updateDoc(questRef, { isCompleted: true });
                console.log(`Quest ${selectedQuest.id} marked as completed in Firestore`);
              } catch (error) {
                console.error("Error updating quest completion status:", error);
              }
            }
            
            setSelectedQuest(null);
          }}
        />
      );
    } else if ((selectedQuest.type || '').toLowerCase() === "video") {
      console.log("Selected quest is video type - showing VideoPlayer");
      
      return (
        <VideoPlayer
          videoUrl={selectedQuest.videoUrl || ""}
          title={selectedQuest.title}
          onBack={async () => {
            // Mark quest as completed in the state
            const updatedQuests = quests.map(q => 
              q.id === selectedQuest.id ? { ...q, isCompleted: true } : q
            );
            setQuests(updatedQuests);

            // Update quest completion status in Firebase if user is logged in
            if (currentUser && userData) {
              try {
                const questRef = doc(
                  db, 
                  userData?.ageCategory ? "astronaut" : "",
                  userData?.ageCategory || "Adults", 
                  "planets", 
                  subject || "", 
                  "quests", 
                  selectedQuest.id
                );
                await updateDoc(questRef, { isCompleted: true });
                console.log(`Quest ${selectedQuest.id} marked as completed in Firestore`);
              } catch (error) {
                console.error("Error updating quest completion status:", error);
              }
            }
            
            setSelectedQuest(null);
          }}
        />
      );
    } else if ((selectedQuest.type || '').toLowerCase() === "quiz") {
      console.log("Selected quest is quiz type - showing Quiz");
      
      return (
        <Quiz
          questId={selectedQuest.id}
          planetId={subject || ""}
          ageCategory={userData?.ageCategory || "Adults"}
          onBack={handleBackFromActivity}
          onComplete={async () => {
            // Firebase update is handled within the Quiz component
            // Just update the local state here
            const updatedQuests = quests.map(q => 
              q.id === selectedQuest.id ? { ...q, isCompleted: true } : q
            );
            setQuests(updatedQuests);
            
            setSelectedQuest(null);
          }}
        />
      );
    } else {
      // Handle other quest types
      console.log("Selected quest is not card type, showing placeholder");
      return (
        <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 border-none shadow-sm rounded-xl">
          <div className="absolute inset-0">
            {generateStars()}
          </div>
          <div className="p-6 flex-1 z-10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackFromActivity}
              className="mb-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
            >
              ← Back to Quests
            </Button>
            
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center mr-3">
                {getQuestTypeIcon(selectedQuest.type)}
              </div>
              <h1 className="text-3xl font-bold text-white">{selectedQuest.title}</h1>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-xl text-white mb-6">{selectedQuest.description}</p>
              <p className="text-white/70 mb-8">This quest type ({selectedQuest.type || "unknown"}) is coming soon!</p>
              <Button 
                onClick={handleBackFromActivity}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go Back to Quests
              </Button>
            </div>
          </div>
        </Card>
      );
    }
  }

  // If a standard activity is selected, show that activity
  if (selectedActivity === "memory-sequence") {
    return <MemoryGame onBack={handleBackFromActivity} />;
  }

  const activities: { [key: string]: { title: string; icon: React.ReactNode; color: string; options: Array<{name: string, id: string}> } } = {
    math: {
      title: "Math Activities",
      icon: <Atom size={24} />,
      color: "from-blue-500 to-blue-700",
      options: [
        { name: "Counting", id: "counting" },
        { name: "Shapes", id: "shapes" },
        { name: "Number Line", id: "number-line" }
      ]
    },
    english: {
      title: "English Activities",
      icon: <BookOpen size={24} />,
      color: "from-purple-500 to-purple-700",
      options: [
        { name: "Story Builder", id: "story-builder" },
        { name: "Rhyming", id: "rhyming" },
        { name: "Picture Labeling", id: "picture-labeling" }
      ]
    },
    "life-skills": {
      title: "Life Skills",
      icon: <Users size={24} />,
      color: "from-orange-500 to-orange-700",
      options: [
        { name: "Brushing Teeth", id: "brushing-teeth" },
        { name: "Packing Backpack", id: "packing-backpack" },
        { name: "Dressing Up", id: "dressing-up" }
      ]
    },
    emotions: {
      title: "Emotions Learning",
      icon: <Heart size={24} />,
      color: "from-pink-500 to-pink-700",
      options: [
        { name: "Identify Emotions", id: "identify-emotions" },
        { name: "Express Feelings", id: "express-feelings" },
        { name: "Calm Down Techniques", id: "calm-down" }
      ]
    },
    memory: {
      title: "Memory Games",
      icon: <Brain size={24} />,
      color: "from-indigo-500 to-indigo-700",
      options: [
        { name: "Memory Sequence", id: "memory-sequence" },
        { name: "Match Cards", id: "match-cards" },
        { name: "Find the Difference", id: "find-difference" }
      ]
    },
    science: {
      title: "Science Exploration",
      icon: <Rocket size={24} />,
      color: "from-green-500 to-green-700",
      options: [
        { name: "Space Discovery", id: "space-discovery" },
        { name: "Plant Growth", id: "plant-growth" },
        { name: "Animal Habitats", id: "animal-habitats" }
      ]
    },
    art: {
      title: "Art Studio",
      icon: <Paintbrush size={24} />,
      color: "from-rose-500 to-rose-700",
      options: [
        { name: "Coloring", id: "coloring" },
        { name: "Drawing", id: "drawing" },
        { name: "Crafts", id: "crafts" }
      ]
    },
    music: {
      title: "Music Lab",
      icon: <Music size={24} />,
      color: "from-cyan-500 to-cyan-700",
      options: [
        { name: "Instruments", id: "instruments" },
        { name: "Singing", id: "singing" },
        { name: "Rhythm Games", id: "rhythm-games" }
      ]
    },
    coding: {
      title: "Coding Adventures",
      icon: <Code size={24} />,
      color: "from-emerald-500 to-emerald-700",
      options: [
        { name: "Block Coding", id: "block-coding" },
        { name: "Pattern Matching", id: "pattern-matching" },
        { name: "Logic Puzzles", id: "logic-puzzles" }
      ]
    }
  };

  // Check if this is an astronaut planet or a standard activity
  const isAstronautPlanet = userData?.interest === "Astronaut" && !activities[subject];
  
  // Get activity info based on subject
  const currentActivity = activities[subject] || { 
    title: planetTitle || "Astronaut Activity", 
    icon: <Rocket size={24} />, 
    color: "from-blue-500 to-blue-700",
    options: [] 
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 border-none shadow-sm rounded-xl">
      <div className="absolute inset-0">
        {generateStars()}
      </div>
      <div className="p-6 flex-1 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mb-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
        >
          ← Back to Galaxy Map
        </Button>
        
        <div className="flex items-center justify-center mb-8">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentActivity.color} flex items-center justify-center mr-3`}>
            {currentActivity.icon}
          </div>
          <h1 className="text-3xl font-bold text-white">{currentActivity.title}</h1>
        </div>
        
        {/* Show quest progression for astronaut planets */}
        {isAstronautPlanet && quests.length > 0 ? (
          <div className="flex flex-col items-center mb-8">
            <div className="text-white text-lg mb-4">Complete all quests to master this skill</div>
            
            {/* Quest progression display */}
            <div className="w-full max-w-3xl">
              <div className="relative flex items-center justify-between">
                {/* Connecting line */}
                <div className="absolute h-1 bg-white/20 left-0 right-0 top-1/2 transform -translate-y-1/2 z-0"></div>
                
                {/* Quest nodes */}
                {quests.map((quest, index) => (
                  <div key={quest.id} className="relative z-10 flex flex-col items-center">
                    {/* Circle with icon */}
                    <button
                      onClick={() => handleQuestClick(quest)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        quest.isCompleted 
                          ? 'bg-green-500 hover:bg-green-400' 
                          : 'bg-slate-700 hover:bg-slate-600'
                      } shadow-lg border-2 border-white/20`}
                    >
                      {quest.isCompleted ? (
                        <CheckCircle2 className="text-white" size={28} />
                      ) : (
                        getQuestTypeIcon(quest.type)
                      )}
                    </button>
                    
                    {/* Quest number */}
                    <div className="mt-2 font-bold text-white">Level {index + 1}</div>
                    
                    {/* Quest title */}
                    <div className="mt-1 text-center text-white/80 text-sm max-w-[100px]">{quest.title}</div>
                    
                    {/* Quest type badge */}
                    <div className="mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/90">
                      {quest.type || "Activity"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quest details */}
            <div className="mt-10 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests.map((quest) => (
                  <Button
                    key={quest.id}
                    onClick={() => handleQuestClick(quest)}
                    className={`h-auto py-4 px-4 text-left flex flex-col items-start rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
                      quest.isCompleted 
                        ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700' 
                        : 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800'
                    }`}
                  >
                    <div className="flex w-full items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        quest.isCompleted ? 'bg-green-500' : 'bg-slate-600'
                      }`}>
                        {quest.isCompleted ? (
                          <CheckCircle2 className="text-white" size={16} />
                        ) : (
                          getQuestTypeIcon(quest.type)
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                      
                      {/* Show quest type */}
                      {quest.type && (
                        <span className="ml-auto px-2 py-1 rounded-full text-xs bg-white/10 text-white/80">
                          {quest.type}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-white/80 text-sm">{quest.description}</p>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Show standard activity options for non-astronaut subjects
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentActivity.options.map((option, index) => (
              <Button
                key={index}
                className={`h-24 text-lg bg-gradient-to-r ${currentActivity.color} hover:brightness-110 text-white rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-glow`}
                onClick={() => setSelectedActivity(option.id)}
              >
                {option.name}
              </Button>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityZone;
