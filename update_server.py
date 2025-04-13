import base64
import requests
import io
from dotenv import load_dotenv
import os
import logging
import json
import pandas as pd
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Union, Any
import cv2
import numpy as np
from deepface import DeepFace
from collections import Counter
import time

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    logger.error("GROQ API KEY is not set in the .env file")

# Initialize FastAPI app
app = FastAPI(
    title="Career Assessment API",
    description="API for analyzing student career assessments using Groq AI",
    version="1.0.0"
)

# Add CORS middleware to allow cross-origin requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data models
class AdditionalInfo(BaseModel):
    favorite_subjects: List[str]
    hobbies: List[str]

class AssessmentResponses(BaseModel):
    space_exploration: float = Field(..., description="Interest in space, planets, and stars (1-10)")
    scientific_experiments: float = Field(..., description="Interest in science experiments (1-10)")
    helping_others: float = Field(..., description="Interest in helping people (1-10)")
    patience: float = Field(..., description="Level of patience (1-10)")
    creativity: float = Field(..., description="Level of creativity (1-10)")
    empathy: float = Field(..., description="Level of empathy (1-10)")

class CareerAssessment(BaseModel):
    responses: AssessmentResponses
    additional_info: AdditionalInfo

class CareerRecommendation(BaseModel):
    recommendation: str

class EmotionResult(BaseModel):
    emotion: str
    confidence: float
    total_detections: int

# Global variables for emotion detection
detected_emotions = []
emotion_start_time = None
EMOTION_DETECTION_DURATION = 10  # seconds

def analyze_career_path(assessment: CareerAssessment):
    """Call Groq API to analyze career path based on assessment data"""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")

    student_responses = assessment.responses.dict()
    additional_info = assessment.additional_info.dict()
    
    query = (
        f"Analyze the career assessment responses for the student with ASD. "
        f"Based on their responses (scale 1-10):\n"
        f"Space Exploration: {student_responses['space_exploration']}\n"
        f"Scientific Experiments: {student_responses['scientific_experiments']}\n"
        f"Helping Others: {student_responses['helping_others']}\n"
        f"Patience: {student_responses['patience']}\n"
        f"Creativity: {student_responses['creativity']}\n"
        f"Empathy: {student_responses['empathy']}\n"
        f"Additional Information:\n"
        f"Favorite Subjects: {', '.join(additional_info['favorite_subjects'])}\n"
        f"Hobbies: {', '.join(additional_info['hobbies'])}\n"
        f"Recommend a Career Path out of the following options:(Astronaut/Scientist/Doctor) based on their responses and ASD considerations\n"
        f"ONLY respond with the recommended career path and only one. Do not add any explanation."
    )
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": query}
            ]
        }
    ]

    try:
        # API Request
        response = requests.post(
            GROQ_API_URL,
            json={"model": "llama-3.2-90b-vision-preview", "messages": messages, "max_tokens": 4000},
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            recommendation = result["choices"][0]["message"]["content"].strip()
            return recommendation
        else:
            logger.error(f"API Error: {response.status_code} - {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Groq API error: {response.text}")

    except requests.RequestException as e:
        logger.error(f"Request error: {e}")
        raise HTTPException(status_code=500, detail=f"Error communicating with Groq API: {str(e)}")

def generate_frames():
    """Generate video frames with emotion detection"""
    global detected_emotions, emotion_start_time
    
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Could not open camera")
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Flip the frame horizontally
            frame = cv2.flip(frame, 1)
            
            # Convert frame to grayscale
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)
            
            # Detect faces
            faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
            if len(faces) > 0:
                for (x, y, w, h) in faces:
                    try:
                        face_roi = rgb_frame[y:y + h, x:x + w]
                        allowed_emotions = ['happy', 'angry', 'neutral']
                        result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                        emotion_predictions = result[0]['emotion']
                        filtered_emotions = {k: v for k, v in emotion_predictions.items() if k in allowed_emotions}
                        emotion = max(filtered_emotions, key=filtered_emotions.get)
                        
                        # Store detected emotion
                        detected_emotions.append(emotion)
                        
                        # Draw rectangle and label
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
                        cv2.putText(frame, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
                        
                        # Display detection count
                        cv2.putText(frame, f'Detections: {len(detected_emotions)}', 
                                  (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                        
                        # Display most common emotion
                        if detected_emotions:
                            emotion_counter = Counter(detected_emotions)
                            most_common = emotion_counter.most_common(1)[0]
                            cv2.putText(frame, f'Most common: {most_common[0]} ({most_common[1]})', 
                                      (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                            
                    except Exception as e:
                        logger.error(f"Error in face analysis: {str(e)}")
            else:
                cv2.putText(frame, "No face detected", (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            # Encode frame as JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
    finally:
        cap.release()

@app.get("/video_feed")
async def video_feed():
    """Stream video feed with emotion detection"""
    return StreamingResponse(
        generate_frames(),
        media_type='multipart/x-mixed-replace; boundary=frame'
    )

@app.get("/analyze_emotion", response_model=EmotionResult)
async def analyze_emotion():
    """Analyze emotions from the video feed and return the most common emotion"""
    global detected_emotions, emotion_start_time
    
    if not detected_emotions:
        # Return a default emotion if nothing is detected yet
        return EmotionResult(
            emotion="neutral",
            confidence=100.0,
            total_detections=0
        )
    
    # Calculate the most common emotion
    emotion_counter = Counter(detected_emotions)
    most_common = emotion_counter.most_common(1)[0]
    total_detections = len(detected_emotions)
    
    # Calculate confidence (percentage of most common emotion)
    confidence = (most_common[1] / total_detections) * 100
    
    # Keep only the last 20 detections to avoid old data influencing results
    if len(detected_emotions) > 20:
        detected_emotions = detected_emotions[-20:]
    
    return EmotionResult(
        emotion=most_common[0],
        confidence=confidence,
        total_detections=total_detections
    )

@app.post("/assess", response_model=CareerRecommendation)
def assess_career(assessment: CareerAssessment):
    """
    Analyze career assessment data and provide a recommendation
    
    Returns a recommended career path based on the student's responses
    """
    try:
        recommendation = analyze_career_path(assessment)
        return CareerRecommendation(recommendation=recommendation)
    except Exception as e:
        logger.error(f"Error processing assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Emotion Tracking and Career Assessment API is running"}

# Run the app using Uvicorn when executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 