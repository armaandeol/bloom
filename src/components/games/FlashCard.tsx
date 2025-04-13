import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashCardProps {
  questId: string;
  planetId: string;
  ageCategory: string;
  onBack: () => void;
  onComplete: () => void;
}

interface CardData {
  id: string;
  title: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  img: string;
}

const FlashCard: React.FC<FlashCardProps> = ({ questId, planetId, ageCategory, onBack, onComplete }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());

  console.log("FlashCard component rendered with:", { questId, planetId, ageCategory });

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

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        
        // Path: astronaut/{ageCategory}/planets/{planetId}/quests/{questId}/cards
        const cardsRef = collection(db, "astronaut", ageCategory, "planets", planetId, "quests", questId, "cards");
        const snapshot = await getDocs(cardsRef);
        
        const fetchedCards: CardData[] = [];
        snapshot.forEach(doc => {
          fetchedCards.push({
            id: doc.id,
            ...doc.data() as Omit<CardData, 'id'>
          });
        });
        
        // Sort cards by ID if needed
        fetchedCards.sort((a, b) => a.id.localeCompare(b.id));
        
        if (fetchedCards.length > 0) {
          setCards(fetchedCards);
          console.log(`Found ${fetchedCards.length} cards for quest ${questId}`);
        } else {
          // For testing purposes, create default cards if none found
          console.log("No cards found, using default data");
          setCards([
            {
              id: "card1",
              title: "Gloves",
              q1: "What are they?",
              a1: "Special gloves that cover astronauts' hands.",
              q2: "Why are they important?",
              a2: "They keep astronauts' hands warm and safe from sharp rocks and let them grab tools and objects in space.",
              img: "https://firebasestorage.googleapis.com/v0/b/bloom-6170d.firebasestorage.app/o/astronaut%2FKids%2Fimages%2FAstronaut%20Gloves%2C%20Javier%20Benver.jpg?alt=media&token=2d238c7c-5abd-4217-aee5-1d2fa2291d98"
            },
            {
              id: "card2",
              title: "Helmet",
              q1: "What is it?",
              a1: "A protective covering for an astronaut's head.",
              q2: "Why is it important?",
              a2: "It provides oxygen to breathe and protects from space radiation and debris.",
              img: "https://images.unsplash.com/photo-1634757439914-23b02f69e688?q=80&w=1000&auto=format&fit=crop"
            },
            {
              id: "card3",
              title: "Space Boots",
              q1: "What are they?",
              a1: "Special footwear designed for walking in space or on other planets.",
              q2: "Why are they important?",
              a2: "They protect astronauts' feet from extreme temperatures and provide grip on different surfaces.",
              img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop"
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError("Failed to load card content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, [questId, planetId, ageCategory]);

  // Reset answers when changing cards
  useEffect(() => {
    setShowAnswer1(false);
    setShowAnswer2(false);
  }, [currentCardIndex]);

  // Mark current card as viewed when both answers are shown
  useEffect(() => {
    if (showAnswer1 && showAnswer2) {
      setViewedCards(prev => {
        const updated = new Set(prev);
        updated.add(currentCardIndex);
        return updated;
      });
    }
  }, [showAnswer1, showAnswer2, currentCardIndex]);

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    // Wait for the completion animation to finish
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  // Check if all cards have been viewed
  const allCardsViewed = viewedCards.size === cards.length && cards.length > 0;

  // Get current card
  const currentCard = cards[currentCardIndex];

  return (
    <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 border-none shadow-sm rounded-xl">
      <div className="absolute inset-0">
        {generateStars()}
      </div>
      <div className="p-6 flex-1 z-10 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="self-start bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
          >
            ← Back to Quests
          </Button>

          {cards.length > 0 && (
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              <span>Card {currentCardIndex + 1} of {cards.length}</span>
            </div>
          )}
        </div>
        
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        
        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
              <Button 
                variant="outline" 
                onClick={onBack} 
                className="mt-4"
              >
                Go Back
              </Button>
            </div>
          </div>
        )}
        
        {currentCard && !loading && !error && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white">{currentCard.title}</h1>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image section */}
              <div className="flex flex-col">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-4 h-64 md:h-80">
                  <img 
                    key={`card-image-${currentCardIndex}`}
                    src={currentCard.img} 
                    alt={currentCard.title} 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                    }}
                  />
                </div>

                {/* Card navigation buttons */}
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className={`${
                      currentCardIndex === 0 
                        ? 'bg-slate-600 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-2 rounded-lg flex items-center`}
                  >
                    <ChevronLeft className="mr-1" size={18} />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={handleNextCard}
                    disabled={currentCardIndex === cards.length - 1}
                    className={`${
                      currentCardIndex === cards.length - 1 
                        ? 'bg-slate-600 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-2 rounded-lg flex items-center`}
                  >
                    Next
                    <ChevronRight className="ml-1" size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Q&A section */}
              <div className="flex flex-col space-y-6">
                {/* Question 1 */}
                <div className="bg-blue-900/40 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <h3 className="font-bold text-lg text-blue-200 mb-2">{currentCard.q1}</h3>
                  {showAnswer1 ? (
                    <p className="text-white">{currentCard.a1}</p>
                  ) : (
                    <Button 
                      onClick={() => setShowAnswer1(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Show Answer
                    </Button>
                  )}
                </div>
                
                {/* Question 2 */}
                <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <h3 className="font-bold text-lg text-purple-200 mb-2">{currentCard.q2}</h3>
                  {showAnswer2 ? (
                    <p className="text-white">{currentCard.a2}</p>
                  ) : (
                    <Button 
                      onClick={() => setShowAnswer2(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Show Answer
                    </Button>
                  )}
                </div>
                
                {/* Next Card button - appears after viewing both answers */}
                {showAnswer1 && showAnswer2 && currentCardIndex < cards.length - 1 && (
                  <div className="bg-blue-600/40 backdrop-blur-sm rounded-xl p-4 shadow-md border border-blue-400/30 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg text-white mb-1">Ready for the next card?</h3>
                        <p className="text-blue-200 text-sm">Card {currentCardIndex + 2} is waiting for you!</p>
                      </div>
                      <Button 
                        onClick={handleNextCard}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-bold flex items-center"
                      >
                        Next Card
                        <ChevronRight className="ml-2" size={20} />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Progress indicator */}
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <h3 className="font-bold text-lg text-white mb-2">Your Progress</h3>
                  <div className="flex space-x-2 mb-3">
                    {cards.map((_, index) => (
                      <div 
                        key={index} 
                        className={`h-2 flex-1 rounded-full ${
                          viewedCards.has(index) ? 'bg-green-500' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm">
                    {viewedCards.size} of {cards.length} cards viewed
                  </p>
                </div>
                
                {/* Mark as complete */}
                {allCardsViewed && (
                  <Button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`mt-auto ${
                      completed 
                        ? 'bg-green-600 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white font-bold py-3 rounded-xl transition-all duration-300`}
                  >
                    {completed ? (
                      <span className="flex items-center">
                        <CheckCircle2 className="mr-2" size={20} />
                        Completed!
                      </span>
                    ) : (
                      "I've Learned All Cards!"
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Completion animation */}
            {completed && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="inline-block rounded-full p-4 bg-green-500 animate-ping mb-4">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Great Job!</h3>
                  <p className="text-white/80 mt-2">You've completed all {cards.length} cards!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FlashCard; 