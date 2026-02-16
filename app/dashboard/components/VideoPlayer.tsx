"use client";

import React, { useState } from "react";
import { ChevronLeft, Lock, Check, Play, Clock } from "lucide-react";

interface Video {
  id: number;
  title: string;
  videoId: string;
  duration: string;
  completed: boolean;
}

interface VideoPlayerProps {
  courseId: string;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ courseId, onBack }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playlist, setPlaylist] = useState<Video[]>([
    {
      id: 1,
      title: "HTML Basics - Getting Started",
      videoId: "HGTJBPNC-Gw",
      duration: "45:30",
      completed: false,
    },
    {
      id: 2,
      title: "HTML Tags & Elements",
      videoId: "kUMe1FH4CHE",
      duration: "38:15",
      completed: false,
    },
    {
      id: 3,
      title: "CSS Fundamentals",
      videoId: "OXGznpKZ_sA",
      duration: "52:40",
      completed: false,
    },
    {
      id: 4,
      title: "CSS Layouts & Flexbox",
      videoId: "phWxA89Dy94",
      duration: "41:20",
      completed: false,
    },
    {
      id: 5,
      title: "Responsive Design",
      videoId: "srvUrASNj0s",
      duration: "48:10",
      completed: false,
    },
  ]);

  const currentVideo = playlist[currentVideoIndex];
  
  const isVideoUnlocked = (index: number) => {
    if (index === 0) return true;
    return playlist[index - 1].completed;
  };

  const handleVideoSelect = (index: number) => {
    if (isVideoUnlocked(index)) {
      setCurrentVideoIndex(index);
    }
  };

  const handleMarkComplete = () => {
    const updatedPlaylist = [...playlist];
    updatedPlaylist[currentVideoIndex].completed = true;
    setPlaylist(updatedPlaylist);

    // Auto-advance to next video if available
    if (currentVideoIndex < playlist.length - 1) {
      setTimeout(() => {
        setCurrentVideoIndex(currentVideoIndex + 1);
      }, 1000);
    }
  };

  const completedCount = playlist.filter(v => v.completed).length;
  const progressPercentage = Math.round((completedCount / playlist.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-black text-base sm:text-lg text-slate-900">Complete Web Development</h1>
              <p className="text-xs text-slate-600 hidden sm:block">HTML & CSS Course</p>
            </div>
          </div>
          
          {/* Progress indicator in header */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-blue-600">{progressPercentage}%</span>
            <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo.videoId}?rel=0&modestbranding=1`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2">{currentVideo.title}</h2>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {currentVideo.duration}
                </span>
                <span>Lesson {currentVideoIndex + 1} of {playlist.length}</span>
              </div>

              {!currentVideo.completed ? (
                <button
                  onClick={handleMarkComplete}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                  <Check className="w-4 h-4" />
                  Mark as Complete
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                  <Check className="w-5 h-5" />
                  Completed ✓
                </div>
              )}
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-20">
              <div className="p-3 sm:p-4 border-b border-slate-200">
                <h3 className="font-black text-base sm:text-lg text-slate-900">Course Content</h3>
                <p className="text-xs text-slate-600 mt-1">
                  {completedCount} of {playlist.length} completed
                </p>
                
                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto">
                {playlist.map((video, index) => {
                  const isUnlocked = isVideoUnlocked(index);
                  const isCurrent = index === currentVideoIndex;

                  return (
                    <button
                      key={video.id}
                      onClick={() => handleVideoSelect(index)}
                      disabled={!isUnlocked}
                      className={`w-full p-3 sm:p-4 flex items-start gap-3 border-b border-slate-100 transition-all text-left
                        ${isCurrent ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}
                        ${isUnlocked ? 'hover:bg-slate-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                        {video.completed ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        ) : isUnlocked ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-current" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-300 flex items-center justify-center">
                            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mb-1">
                          {video.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </p>
                        {!isUnlocked && (
                          <p className="text-[10px] text-amber-600 mt-1 font-semibold">
                            Complete previous lesson to unlock
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;