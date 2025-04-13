import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    submission: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    // Validate DOB
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
      valid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      valid = false;
    }
    
    // Validate password
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }
    
    // Validate confirm password
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getAgeCategory = (age: number): string => {
    if (age < 10) return "Kids";
    if (age < 18) return "Teens";
    return "Adults";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({ ...errors, submission: '' });
      
      try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        const user = userCredential.user;
        
        // Calculate age from DOB
        const age = calculateAge(formData.dob);
        // Determine age category
        const ageCategory = getAgeCategory(age);
        
        // Store user data in Firestore
        await setDoc(doc(db, "students", user.uid), {
          name: formData.name,
          email: formData.email,
          age: age,
          ageCategory: ageCategory,
          dob: formData.dob,
          createdAt: new Date()
        });
        
        // Navigate to the next page
        navigate('/select-interests');
      } catch (error: any) {
        console.error("Error creating account:", error);
        setErrors({
          ...errors,
          submission: error.message || 'Failed to create account. Please try again.'
        });
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Content */}
      <div className="flex items-center justify-center h-full p-4">
        <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-2xl border border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h2>
            <p className="text-slate-600">Let's set up your profile to personalize your experience</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {errors.submission && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                {errors.submission}
              </div>
            )}
            
            <div className="space-y-2 mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div className="space-y-2 mb-4">
              <label htmlFor="dob" className="block text-sm font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.dob ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>
            
            <div className="space-y-2 mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-2 mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900`}
                placeholder="Create a password (min. 8 characters)"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div className="space-y-2 mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
              py-3 rounded-xl font-semibold text-white shadow-lg 
              transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isSubmitting ? 'Creating Account...' : 'Continue'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account? <button onClick={() => navigate('/sign-in')} className="text-blue-600 hover:text-blue-700 font-medium">Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount; 