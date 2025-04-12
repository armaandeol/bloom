import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

type InterestResponse = {
  space_exploration: number;
  scientific_experiments: number;
  helping_others: number;
  patience: number;
  creativity: number;
  empathy: number;
};

type AdditionalInfo = {
  favorite_subjects: string[] | string;
  hobbies: string[] | string;
};

type FormData = {
  responses: InterestResponse;
  additional_info: AdditionalInfo;
};

const likertOptions = [
  { value: 0, label: "Not Likely" },
  { value: 2.5, label: "Somewhat Likely" },
  { value: 5, label: "Neutral" },
  { value: 7.5, label: "Likely" },
  { value: 10, label: "Very Likely" }
];

const SelectInterests = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    responses: {
      space_exploration: 5,
      scientific_experiments: 5,
      helping_others: 5,
      patience: 5,
      creativity: 5,
      empathy: 5,
    },
    additional_info: {
      favorite_subjects: '',
      hobbies: '',
    }
  });

  const [favoriteSubjects, setFavoriteSubjects] = useState<string>('');
  const [hobbies, setHobbies] = useState<string>('');

  const handleRatingChange = (category: keyof InterestResponse, value: number) => {
    setFormData({
      ...formData,
      responses: {
        ...formData.responses,
        [category]: value
      }
    });
  };

  const handleFavoriteSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFavoriteSubjects(e.target.value);
  };

  const handleHobbiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHobbies(e.target.value);
  };

  const handleBack = () => {
    navigate('/create-account');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert comma-separated strings to arrays
    const favoriteSubjectsArray = favoriteSubjects
      .split(',')
      .map(subject => subject.trim())
      .filter(subject => subject !== '');
      
    const hobbiesArray = hobbies
      .split(',')
      .map(hobby => hobby.trim())
      .filter(hobby => hobby !== '');
    
    // Create the final form data object
    const processedFormData = {
      responses: formData.responses,
      additional_info: {
        favorite_subjects: favoriteSubjectsArray,
        hobbies: hobbiesArray
      }
    };

    try {
      console.log('Sending data to server:', processedFormData);
      
      // Using the proxy configured in vite.config.ts
      const response = await fetch('/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(processedFormData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response from server:', data);
      
      // Save career recommendation to Firestore if user is logged in
      if (currentUser && data.recommendation) {
        try {
          const userDocRef = doc(db, "students", currentUser.uid);
          await updateDoc(userDocRef, {
            interest: data.recommendation
          });
          console.log('Interest saved to Firestore:', data.recommendation);
        } catch (error) {
          console.error('Error saving interest to Firestore:', error);
          // Continue to next page even if saving to Firestore fails
        }
      }
      
      // Navigate to the next page
      navigate('/loading-experience');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again later.');
    }
  };

  const renderLikertScale = (category: keyof InterestResponse, value: number) => {
    return (
      <div className="flex justify-between mt-2 mb-4">
        {likertOptions.map((option) => (
          <div key={option.value} className="flex flex-col items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={category}
                value={option.value}
                checked={value === option.value}
                onChange={() => handleRatingChange(category, option.value)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-1 text-sm text-slate-700">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Let's Get to Know You</h1>
            <p className="text-lg text-slate-600">
              Answer these questions to help us personalize your career guidance experience.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Space Exploration */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Space Exploration</h2>
                  <p className="text-slate-600 text-sm mb-1">How interested are you in learning about space, planets, and stars?</p>
                  <p className="text-slate-600 text-sm mb-2">Do you enjoy watching or reading about space missions and astronauts?</p>
                  {renderLikertScale('space_exploration', formData.responses.space_exploration)}
                </div>
                
                {/* Scientific Experiments */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Scientific Experiments</h2>
                  <p className="text-slate-600 text-sm mb-1">How much do you enjoy doing science experiments or watching them?</p>
                  <p className="text-slate-600 text-sm mb-2">Are you curious about how things work in nature?</p>
                  {renderLikertScale('scientific_experiments', formData.responses.scientific_experiments)}
                </div>
                
                {/* Helping Others */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Helping Others</h2>
                  <p className="text-slate-600 text-sm mb-1">How much do you like helping people when they're not feeling well?</p>
                  <p className="text-slate-600 text-sm mb-2">Do you enjoy taking care of others?</p>
                  {renderLikertScale('helping_others', formData.responses.helping_others)}
                </div>
                
                {/* Patience */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Patience</h2>
                  <p className="text-slate-600 text-sm mb-1">How well can you wait for results when doing something?</p>
                  <p className="text-slate-600 text-sm mb-2">Do you mind spending time on tasks that take a while?</p>
                  {renderLikertScale('patience', formData.responses.patience)}
                </div>
                
                {/* Creativity */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Creativity</h2>
                  <p className="text-slate-600 text-sm mb-1">How much do you enjoy coming up with new ideas?</p>
                  <p className="text-slate-600 text-sm mb-2">Do you like creating or designing things?</p>
                  {renderLikertScale('creativity', formData.responses.creativity)}
                </div>
                
                {/* Empathy */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Empathy</h2>
                  <p className="text-slate-600 text-sm mb-1">How well do you understand how others might be feeling?</p>
                  <p className="text-slate-600 text-sm mb-2">Do you care about how others are doing?</p>
                  {renderLikertScale('empathy', formData.responses.empathy)}
                </div>
                
                {/* Favorite Subjects */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Favorite Subjects</h2>
                  <p className="text-slate-600 text-sm mb-1">Which school subjects do you enjoy the most?</p>
                  <p className="text-slate-600 text-sm mb-4">What topics do you like learning about?</p>
                  <input
                    type="text"
                    value={favoriteSubjects}
                    onChange={handleFavoriteSubjectsChange}
                    placeholder="Enter subjects separated by commas (e.g., Science, Math, Art)"
                    className="w-full p-3 border border-slate-300 rounded-lg"
                  />
                </div>
                
                {/* Hobbies */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Hobbies</h2>
                  <p className="text-slate-600 text-sm mb-1">What activities do you enjoy doing in your free time?</p>
                  <p className="text-slate-600 text-sm mb-4">What do you like to do for fun?</p>
                  <input
                    type="text"
                    value={hobbies}
                    onChange={handleHobbiesChange}
                    placeholder="Enter hobbies separated by commas (e.g., Reading, Sports, Music)"
                    className="w-full p-3 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectInterests; 