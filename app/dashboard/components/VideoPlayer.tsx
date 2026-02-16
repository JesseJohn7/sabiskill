"use client";

import React, { useState } from "react";
import { ChevronLeft, Lock, Check, Play, Clock, ArrowRight, Home, Compass, FileText, Settings } from "lucide-react";
import Confetti from "react-confetti";

interface Video {
  id: number;
  title: string;
  videoId: string;
  timestamp: string;
  duration: string;
  completed: boolean;
  emoji?: string;
}

interface VideoPlayerProps {
  courseId: string;
  onBack: () => void;
  onNavigate?: (tab: string) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ courseId, onBack, onNavigate }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playlist, setPlaylist] = useState<Video[]>([
    { id: 1, title: "Introduction to HTML", videoId: "HGTJBPNC-Gw", timestamp: "0", duration: "1:56", completed: false, emoji: "🌎" },
    { id: 2, title: "Hyperlinks", videoId: "HGTJBPNC-Gw", timestamp: "667", duration: "4:08", completed: false, emoji: "👈" },
    { id: 3, title: "Images", videoId: "HGTJBPNC-Gw", timestamp: "915", duration: "6:18", completed: false, emoji: "🖼️" },
    { id: 4, title: "Audio", videoId: "HGTJBPNC-Gw", timestamp: "1293", duration: "5:16", completed: false, emoji: "🔊" },
    { id: 5, title: "Video", videoId: "HGTJBPNC-Gw", timestamp: "1609", duration: "4:31", completed: false, emoji: "🎥" },
    { id: 6, title: "Favicons", videoId: "HGTJBPNC-Gw", timestamp: "1880", duration: "2:59", completed: false, emoji: "🗿" },
    { id: 7, title: "Text Formatting", videoId: "HGTJBPNC-Gw", timestamp: "2059", duration: "3:51", completed: false, emoji: "💬" },
    { id: 8, title: "Span & Div", videoId: "HGTJBPNC-Gw", timestamp: "2290", duration: "4:47", completed: false, emoji: "🏁" },
    { id: 9, title: "Lists", videoId: "HGTJBPNC-Gw", timestamp: "2577", duration: "6:34", completed: false, emoji: "📄" },
    { id: 10, title: "Tables", videoId: "HGTJBPNC-Gw", timestamp: "2971", duration: "4:42", completed: false, emoji: "📊" },
    { id: 11, title: "Buttons", videoId: "HGTJBPNC-Gw", timestamp: "3253", duration: "5:15", completed: false, emoji: "🔘" },
    { id: 12, title: "Forms", videoId: "HGTJBPNC-Gw", timestamp: "3568", duration: "17:54", completed: false, emoji: "📝" },
    { id: 13, title: "Headers & Footers", videoId: "HGTJBPNC-Gw", timestamp: "4642", duration: "5:48", completed: false, emoji: "🤯" },
    { id: 14, title: "Introduction to CSS", videoId: "HGTJBPNC-Gw", timestamp: "4990", duration: "8:00", completed: false, emoji: "🎨" },
    { id: 15, title: "Colors", videoId: "HGTJBPNC-Gw", timestamp: "5470", duration: "4:12", completed: false, emoji: "🖌️" },
    { id: 16, title: "Fonts", videoId: "HGTJBPNC-Gw", timestamp: "5722", duration: "7:20", completed: false, emoji: "🔤" },
    { id: 17, title: "Borders", videoId: "HGTJBPNC-Gw", timestamp: "6162", duration: "4:27", completed: false, emoji: "🖼" },
    { id: 18, title: "Shadows", videoId: "HGTJBPNC-Gw", timestamp: "6429", duration: "3:18", completed: false, emoji: "👥" },
    { id: 19, title: "Margins", videoId: "HGTJBPNC-Gw", timestamp: "6627", duration: "5:14", completed: false, emoji: "↔️" },
    { id: 20, title: "Float", videoId: "HGTJBPNC-Gw", timestamp: "6941", duration: "4:27", completed: false, emoji: "🎈" },
    { id: 21, title: "Overflow", videoId: "HGTJBPNC-Gw", timestamp: "7208", duration: "3:23", completed: false, emoji: "🌊" },
    { id: 22, title: "Display Property", videoId: "HGTJBPNC-Gw", timestamp: "7411", duration: "4:12", completed: false, emoji: "🧱" },
    { id: 23, title: "Height and Width", videoId: "HGTJBPNC-Gw", timestamp: "7663", duration: "6:54", completed: false, emoji: "📏" },
    { id: 24, title: "Positions", videoId: "HGTJBPNC-Gw", timestamp: "8077", duration: "6:23", completed: false, emoji: "🎯" },
    { id: 25, title: "Background Images", videoId: "HGTJBPNC-Gw", timestamp: "8460", duration: "3:15", completed: false, emoji: "🏙️" },
    { id: 26, title: "Combinators", videoId: "HGTJBPNC-Gw", timestamp: "8655", duration: "4:57", completed: false, emoji: "➕" },
    { id: 27, title: "Pseudo-classes", videoId: "HGTJBPNC-Gw", timestamp: "8952", duration: "7:38", completed: false, emoji: "☟" },
    { id: 28, title: "Pseudo-elements", videoId: "HGTJBPNC-Gw", timestamp: "9410", duration: "5:56", completed: false, emoji: "✔" },
    { id: 29, title: "Pagination", videoId: "HGTJBPNC-Gw", timestamp: "9766", duration: "8:58", completed: false, emoji: "🕮" },
    { id: 30, title: "Dropdown Menus", videoId: "HGTJBPNC-Gw", timestamp: "10304", duration: "6:35", completed: false, emoji: "🔻" },
    { id: 31, title: "Navigation Bar", videoId: "HGTJBPNC-Gw", timestamp: "10699", duration: "6:27", completed: false, emoji: "🧭" },
    { id: 32, title: "Website Layout", videoId: "HGTJBPNC-Gw", timestamp: "11086", duration: "9:27", completed: false, emoji: "🗺️" },
    { id: 33, title: "Image Gallery", videoId: "HGTJBPNC-Gw", timestamp: "11653", duration: "5:37", completed: false, emoji: "📷" },
    { id: 34, title: "Icons", videoId: "HGTJBPNC-Gw", timestamp: "11990", duration: "8:33", completed: false, emoji: "🐤" },
    { id: 35, title: "Flexbox", videoId: "HGTJBPNC-Gw", timestamp: "12503", duration: "10:00", completed: false, emoji: "💪" },
    { id: 36, title: "Transformations", videoId: "HGTJBPNC-Gw", timestamp: "13103", duration: "9:00", completed: false, emoji: "🔄" },
    { id: 37, title: "Animations", videoId: "HGTJBPNC-Gw", timestamp: "13643", duration: "8:37", completed: false, emoji: "🎬" },
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

    const allCompleted = updatedPlaylist.every(v => v.completed);
    
    if (allCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      if (currentVideoIndex < playlist.length - 1) {
        setTimeout(() => {
          setCurrentVideoIndex(currentVideoIndex + 1);
        }, 1500);
      }
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < playlist.length - 1 && currentVideo.completed) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const completedCount = playlist.filter(v => v.completed).length;
  const progressPercentage = Math.round((completedCount / playlist.length) * 100);
  const allCompleted = playlist.every(v => v.completed);

  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "resources", label: "Assets", icon: FileText },
    { id: "settings", label: "Setup", icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    if (onNavigate) {
      onNavigate(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
                title="Back to courses"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div>
                <h1 className="font-black text-base sm:text-lg text-slate-900">Complete Web Development</h1>
                <p className="text-xs text-slate-600 hidden sm:block">HTML & CSS Full Course</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {allCompleted && (
                <span className="text-xs sm:text-sm font-bold text-green-600 mr-2">🎉 Completed!</span>
              )}
              <span className="text-xs sm:text-sm font-bold text-blue-600">{progressPercentage}%</span>
              <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-700"
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-xl relative group">
              <iframe
                key={`${currentVideo.videoId}-${currentVideo.timestamp}`}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo.videoId}?start=${currentVideo.timestamp}&rel=0&modestbranding=1&autoplay=1`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                    {currentVideo.emoji && <span className="text-2xl">{currentVideo.emoji}</span>}
                    {currentVideo.title}
                  </h2>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {currentVideo.duration}
                    </span>
                    <span>Lesson {currentVideoIndex + 1} of {playlist.length}</span>
                  </div>
                </div>

                {!currentVideo.completed ? (
                  <button
                    onClick={handleMarkComplete}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm text-xs sm:text-sm whitespace-nowrap"
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Mark Complete</span>
                    <span className="sm:hidden">Done</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 font-semibold text-xs sm:text-sm whitespace-nowrap">
                    <Check className="w-5 h-5" />
                    <span className="hidden sm:inline">Completed</span>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handlePreviousVideo}
                  disabled={currentVideoIndex === 0}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2
                    ${currentVideoIndex === 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <button
                  onClick={handleNextVideo}
                  disabled={currentVideoIndex === playlist.length - 1 || !currentVideo.completed}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2
                    ${currentVideoIndex === playlist.length - 1 || !currentVideo.completed
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  <span className="hidden sm:inline">Next Lesson</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {!currentVideo.completed && (
                <p className="text-xs text-amber-600 mt-3 text-center font-medium">
                  ⚠️ Mark this lesson as complete to unlock the next one
                </p>
              )}
            </div>

            {/* Completion Card */}
            {allCompleted && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-lg">
                <div className="text-center space-y-3">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-2xl font-black text-slate-900">Congratulations!</h3>
                  <p className="text-slate-600 font-medium">
                    You've completed the Complete Web Development course with {playlist.length} lessons!
                  </p>
                  <button
                    onClick={onBack}
                    className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    Back to Courses
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-3 sm:p-4 border-b border-slate-200">
                <h3 className="font-black text-base sm:text-lg text-slate-900">Course Content</h3>
                <p className="text-xs text-slate-600 mt-1">
                  {completedCount} of {playlist.length} lessons completed
                </p>
                
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
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                            isCurrent ? 'bg-blue-600' : 'bg-blue-500'
                          }`}>
                            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-current" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-300 flex items-center justify-center">
                            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-bold line-clamp-2 mb-1 flex items-center gap-1.5 ${
                          isCurrent ? 'text-blue-600' : 'text-slate-900'
                        }`}>
                          {video.emoji && <span>{video.emoji}</span>}
                          <span>{video.title}</span>
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </p>
                        {!isUnlocked && (
                          <p className="text-[10px] text-amber-600 mt-1 font-semibold">
                            🔒 Complete previous lesson
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