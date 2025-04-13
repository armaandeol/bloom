import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
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
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      valid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({ ...errors, submission: '' });
      
      try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        const user = userCredential.user;
        
        try {
          // Get user data from Firestore
          const userDocRef = doc(db, "students", user.uid);
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
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Default to astronaut in case of error
          navigate('/original-app');
        }
      } catch (error: any) {
        console.error("Error signing in:", error);
        let errorMessage = 'Failed to sign in. Please check your credentials.';
        
        // Provide more specific error messages for common authentication errors
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMessage = 'Invalid email or password';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
        }
        
        setErrors({
          ...errors,
          submission: errorMessage
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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-600">Sign in to continue your learning journey</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {errors.submission && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                {errors.submission}
              </div>
            )}
            
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
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
              py-3 rounded-xl font-semibold text-white shadow-lg 
              transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account? <button onClick={() => navigate('/create-account')} className="text-blue-600 hover:text-blue-700 font-medium">Create Account</button>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-slate-700">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 