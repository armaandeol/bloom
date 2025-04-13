import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface QuizProps {
  questId: string;
  planetId: string;
  ageCategory: string;
  onBack: () => void;
  onComplete: () => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
  explanation?: string;
}

interface QuizResult {
  userId: string | null;
  questId: string;
  planetId: string;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  answeredQuestions: {
    questionId: string;
    userAnswer: number;
    correct: boolean;
  }[];
  timestamp: number;
}

const Quiz: React.FC<QuizProps> = ({ questId, planetId, ageCategory, onBack, onComplete }) => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Map<string, number>>(new Map());
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showingResults, setShowingResults] = useState(false);
  const [submittingResults, setSubmittingResults] = useState(false);

  // Generate animated stars background
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

  // Fetch quiz questions from Firebase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // Path: astronaut/{ageCategory}/planets/{planetId}/quests/{questId}/questions
        const questionsRef = collection(db, "astronaut", ageCategory, "planets", planetId, "quests", questId, "questions");
        const snapshot = await getDocs(questionsRef);
        
        const fetchedQuestions: QuizQuestion[] = [];
        snapshot.forEach(doc => {
          fetchedQuestions.push({
            id: doc.id,
            ...doc.data() as Omit<QuizQuestion, 'id'>
          });
        });
        
        // Sort questions by ID if needed
        fetchedQuestions.sort((a, b) => a.id.localeCompare(b.id));
        
        if (fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          console.log(`Found ${fetchedQuestions.length} questions for quest ${questId}`);
        } else {
          // For testing purposes, create default questions if none found
          console.log("No questions found, using default data");
          setQuestions([
            {
              id: "q1",
              question: "What is the closest planet to the Sun?",
              options: ["Venus", "Mercury", "Earth", "Mars"],
              correctAnswer: 1,
              explanation: "Mercury is the closest planet to the Sun in our solar system."
            },
            {
              id: "q2",
              question: "How many moons does Mars have?",
              options: ["None", "One", "Two", "Four"],
              correctAnswer: 2,
              explanation: "Mars has two small moons named Phobos and Deimos."
            },
            {
              id: "q3",
              question: "What is the Great Red Spot on Jupiter?",
              options: ["A crater", "A volcano", "A storm", "A lake"],
              correctAnswer: 2,
              explanation: "The Great Red Spot is a giant storm that has been raging for hundreds of years."
            },
            {
              id: "q4",
              question: "Which planet is known as the 'Ringed Planet'?",
              options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
              correctAnswer: 1,
              explanation: "Saturn is known for its prominent rings made mostly of ice particles with smaller amounts of dust and rock."
            },
            {
              id: "q5",
              question: "What is the largest planet in our solar system?",
              options: ["Earth", "Saturn", "Jupiter", "Neptune"],
              correctAnswer: 2,
              explanation: "Jupiter is the largest planet in our solar system - more than twice as massive as all other planets combined."
            },
            {
              id: "q6",
              question: "Which planet rotates on its side?",
              options: ["Mars", "Venus", "Uranus", "Mercury"],
              correctAnswer: 2,
              explanation: "Uranus rotates on its side with an axial tilt of about 98 degrees."
            },
            {
              id: "q7",
              question: "What is the hottest planet in our solar system?",
              options: ["Mercury", "Venus", "Mars", "Jupiter"],
              correctAnswer: 1,
              explanation: "Venus is the hottest planet with an average surface temperature of about 864°F (462°C)."
            },
            {
              id: "q8",
              question: "Which planet is known as the 'Red Planet'?",
              options: ["Venus", "Jupiter", "Mercury", "Mars"],
              correctAnswer: 3,
              explanation: "Mars is called the Red Planet because iron minerals in its soil oxidize, or rust, causing the soil and atmosphere to look red."
            },
            {
              id: "q9",
              question: "Which planet has the longest day?",
              options: ["Earth", "Jupiter", "Venus", "Saturn"],
              correctAnswer: 2,
              explanation: "Venus has the longest day of any planet in our solar system, taking about 243 Earth days to rotate once."
            },
            {
              id: "q10",
              question: "Which is the only planet that rotates clockwise?",
              options: ["Uranus", "Venus", "Neptune", "Jupiter"],
              correctAnswer: 1,
              explanation: "Venus is the only planet that rotates clockwise, while all other planets rotate counterclockwise."
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load quiz questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [questId, planetId, ageCategory]);

  // Handle selecting an answer
  const handleAnswerSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(index);
    }
  };

  // Handle submitting an answer
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerSubmitted(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // Save the user's answer
    const updatedAnswers = new Map(userAnswers);
    updatedAnswers.set(currentQuestion.id, selectedAnswer);
    setUserAnswers(updatedAnswers);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      calculateResults();
    }
  };

  // Calculate quiz results
  const calculateResults = () => {
    const answeredQuestions: QuizResult['answeredQuestions'] = [];
    let correctCount = 0;
    
    questions.forEach(question => {
      const userAnswer = userAnswers.get(question.id);
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctCount++;
      
      if (userAnswer !== undefined) {
        answeredQuestions.push({
          questionId: question.id,
          userAnswer,
          correct: isCorrect,
        });
      }
    });
    
    const passed = correctCount >= 7; // Pass if 7 or more correct answers
    
    const results: QuizResult = {
      userId: currentUser?.uid || null,
      questId,
      planetId,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      passed,
      answeredQuestions,
      timestamp: Date.now(),
    };
    
    setQuizResults(results);
    setQuizCompleted(true);
    setShowingResults(true);
    
    // Submit results to backend
    submitResults(results);
  };

  // Submit results to backend
  const submitResults = async (results: QuizResult) => {
    try {
      setSubmittingResults(true);
      
      // Send results to backend API
      const response = await fetch('http://localhost:8080/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      });
      
      if (!response.ok) {
        throw new Error(`Error submitting results: ${response.statusText}`);
      }
      
      console.log('Quiz results submitted successfully');
      
      // If passed, update quest completion status in Firebase
      if (results.passed && currentUser) {
        const questRef = doc(
          db, 
          "astronaut", 
          ageCategory, 
          "planets", 
          planetId, 
          "quests", 
          questId
        );
        
        await updateDoc(questRef, { isCompleted: true });
        console.log(`Quest ${questId} marked as completed in Firestore`);
      }
    } catch (error) {
      console.error('Error submitting quiz results:', error);
    } finally {
      setSubmittingResults(false);
    }
  };

  // Handle retrying the quiz
  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setUserAnswers(new Map());
    setQuizCompleted(false);
    setShowingResults(false);
    setQuizResults(null);
  };

  // Handle completing the quest
  const handleCompleteQuest = () => {
    if (quizResults?.passed) {
      onComplete();
    }
  };

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];
  
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
            disabled={submittingResults}
            className="self-start bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
          >
            ← Back to Quests
          </Button>

          {!showingResults && questions.length > 0 && (
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
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
        
        {!loading && !error && !showingResults && currentQuestion && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Quiz Challenge</h1>
              <p className="text-blue-200 mt-2">Answer at least 7 questions correctly to pass</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedAnswer === index
                        ? isAnswerSubmitted
                          ? index === currentQuestion.correctAnswer
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    } ${isAnswerSubmitted && index === currentQuestion.correctAnswer ? 'ring-2 ring-green-400' : ''}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                      
                      {isAnswerSubmitted && (
                        <span className="ml-auto">
                          {index === currentQuestion.correctAnswer ? (
                            <CheckCircle2 className="text-green-200" />
                          ) : selectedAnswer === index ? (
                            <XCircle className="text-red-200" />
                          ) : null}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {isAnswerSubmitted && currentQuestion.explanation && (
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-start">
                    <HelpCircle className="text-blue-300 mr-2 mt-1 flex-shrink-0" size={18} />
                    <p className="text-blue-100">{currentQuestion.explanation}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto flex justify-between">
              {!isAnswerSubmitted ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center w-full"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>Next Question <ArrowRight className="ml-2" size={18} /></>
                  ) : (
                    'Finish Quiz'
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Results Screen */}
        {showingResults && quizResults && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              quizResults.passed 
                ? 'bg-green-500 animate-pulse'
                : 'bg-red-500'
            }`}>
              {quizResults.passed ? (
                <CheckCircle2 className="text-white" size={48} />
              ) : (
                <XCircle className="text-white" size={48} />
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              {quizResults.passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h2>
            
            <p className="text-xl text-blue-200 mb-4">
              You answered {quizResults.correctAnswers} out of {quizResults.totalQuestions} questions correctly
            </p>
            
            <div className="w-full max-w-md bg-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Results Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-blue-200">Total Questions:</span>
                <span className="text-white font-medium">{quizResults.totalQuestions}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-blue-200">Correct Answers:</span>
                <span className="text-white font-medium">{quizResults.correctAnswers}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-blue-200">Passing Score:</span>
                <span className="text-white font-medium">7 or more</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Result:</span>
                <span className={`font-medium ${quizResults.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {quizResults.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
              {!quizResults.passed && (
                <Button
                  onClick={handleRetryQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex-1"
                >
                  Try Again
                </Button>
              )}
              
              <Button
                onClick={quizResults.passed ? handleCompleteQuest : onBack}
                className={`${
                  quizResults.passed 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-slate-600 hover:bg-slate-700'
                } text-white px-6 py-3 rounded-lg flex-1`}
              >
                {quizResults.passed ? 'Complete Quest' : 'Back to Quests'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Submitting Results Indicator */}
        {submittingResults && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Quiz; 