import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const LoadingExperience = () => {
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const loadingSteps = [
    'Analyzing your interests...',
    'Identifying career opportunities...',
    'Gathering educational resources...',
    'Personalizing your dashboard...',
    'Crafting your unique career path...'
  ];

  useEffect(() => {
    // Start the progress animation
    const interval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // Update the current step based on progress
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return loadingSteps.length - 1;
        }
        return prev + 1;
      });
    }, 2000);
    
    // Navigate after a set time with interest check
    const timer = setTimeout(async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          // Get user data from Firestore
          const userDocRef = doc(db, "students", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const interest = userData.interest;
            
            // Redirect based on interest
            if (interest === "Scientist") {
              navigate('/scientist-portal');
            } else if (interest === "Doctor") {
              navigate('/doctor-portal');
            } else if (interest === "Astronaut" || !interest) {
              navigate('/original-app');
            } else {
              // Default fallback
              navigate('/original-app');
            }
          } else {
            // User document doesn't exist, default to astronaut
            navigate('/original-app');
          }
        } else {
          // No authenticated user, default to astronaut
          navigate('/original-app');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Default to astronaut in case of error
        navigate('/original-app');
      }
    }, 8000); // Navigate after 8 seconds
    
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [navigate, loadingSteps.length]);

  // Calculate the circumference of the circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the dash offset based on progress
  const dashOffset = circumference - (progressValue / 100) * circumference;

  return (
    <div className="min-h-screen bg-white">
      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Crafting Your Personalized Experience</h1>
          
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="rgba(100,116,139,0.2)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#4f46e5"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 70 70)"
              />
            </svg>
            
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{progressValue}%</span>
            </div>
          </div>
          
          {/* Current step */}
          <div className="mb-8 h-8">
            <p className="text-lg font-medium text-blue-600">{loadingSteps[currentStep]}</p>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-2 mb-10">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-3 rounded-full bg-purple-600"
                style={{
                  animation: `bounce 1.4s infinite ease-in-out both`,
                  animationDelay: `${i * 0.16}s`
                }}
              ></div>
            ))}
          </div>
          
          <p className="text-slate-600 text-sm">
            Please wait while we analyze your preferences and build your personalized career guidance platform.
          </p>
        </div>
        
        {/* CSS for the dots animation */}
        <style>
          {`
            @keyframes bounce {
              0%, 80%, 100% { 
                transform: scale(0);
              } 
              40% { 
                transform: scale(1.0);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LoadingExperience; 