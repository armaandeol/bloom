import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertTriangle, CheckCircle2, PlayCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsLoading(false);
    console.error("Video error:", e);
    
    // Get more detailed error information
    const videoElement = e.currentTarget;
    const errorCode = videoElement.error?.code;
    const errorMessage = videoElement.error?.message;
    
    let errorText = "Failed to load video.";
    
    switch (errorCode) {
      case 1: // MEDIA_ERR_ABORTED
        errorText = "Video playback was aborted.";
        break;
      case 2: // MEDIA_ERR_NETWORK
        errorText = "Network error occurred while loading the video.";
        break;
      case 3: // MEDIA_ERR_DECODE
        errorText = "Video decoding failed. The format may not be supported.";
        break;
      case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
        errorText = "Video format or MIME type is not supported.";
        break;
    }
    
    if (errorMessage) {
      errorText += ` Error details: ${errorMessage}`;
    }
    
    setError(errorText);
    console.error(errorText);
  };

  const handleVideoEnded = () => {
    console.log("Video playback completed");
    setVideoEnded(true);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setVideoEnded(false);
    }
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 border-none shadow-sm rounded-xl">
      <div className="p-6 flex-1 z-10 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="self-start bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
          >
            <ChevronLeft className="mr-1" size={18} />
            Back
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          {isLoading && !error && !videoEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          
          {error ? (
            <div className="p-6 bg-red-900/30 rounded-xl text-center w-full max-w-lg">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Video Error</h3>
              <p className="text-white/80 mb-4">{error}</p>
              <p className="text-white/70 text-sm break-all mb-4">URL: {videoUrl}</p>
              <Button 
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                Go Back
              </Button>
            </div>
          ) : (
            <>
              <div className="w-full h-full max-h-[50vh] rounded-xl overflow-hidden bg-black shadow-lg relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  onLoadedData={() => setIsLoading(false)}
                  onError={handleError}
                  onEnded={handleVideoEnded}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video completion overlay */}
                {videoEnded && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                    <CheckCircle2 className="text-green-400 w-16 h-16 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">Video Completed!</h3>
                    <p className="text-white/80 mb-6">Great job watching the entire video. You've completed this quest!</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                        onClick={handleReplay}
                      >
                        <PlayCircle className="mr-2" size={18} />
                        Watch Again
                      </Button>
                      
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={onBack}
                      >
                        Complete & Continue
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer; 