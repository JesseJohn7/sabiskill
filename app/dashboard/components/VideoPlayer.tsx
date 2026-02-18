"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  Lock,
  Check,
  Play,
  Clock,
  ArrowRight,
} from "lucide-react";
import Confetti from "react-confetti";

interface Video {
  id: number;
  title: string;
  videoId: string;
  timestamp: number;
  duration: string;
  completed: boolean;
  emoji?: string;
}

interface VideoPlayerProps {
  courseId: string;
  onBack: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const PLAYLIST: Video[] = [
  { id: 1,  title: "Introduction to HTML",  videoId: "HGTJBPNC-Gw", timestamp: 0,     duration: "1:56",  completed: false, emoji: "🌎" },
  { id: 2,  title: "Hyperlinks",            videoId: "HGTJBPNC-Gw", timestamp: 667,   duration: "4:08",  completed: false, emoji: "👈" },
  { id: 3,  title: "Images",                videoId: "HGTJBPNC-Gw", timestamp: 915,   duration: "6:18",  completed: false, emoji: "🖼️" },
  { id: 4,  title: "Audio",                 videoId: "HGTJBPNC-Gw", timestamp: 1293,  duration: "5:16",  completed: false, emoji: "🔊" },
  { id: 5,  title: "Video",                 videoId: "HGTJBPNC-Gw", timestamp: 1609,  duration: "4:31",  completed: false, emoji: "🎥" },
  { id: 6,  title: "Favicons",              videoId: "HGTJBPNC-Gw", timestamp: 1880,  duration: "2:59",  completed: false, emoji: "🗿" },
  { id: 7,  title: "Text Formatting",       videoId: "HGTJBPNC-Gw", timestamp: 2059,  duration: "3:51",  completed: false, emoji: "💬" },
  { id: 8,  title: "Span & Div",            videoId: "HGTJBPNC-Gw", timestamp: 2290,  duration: "4:47",  completed: false, emoji: "🏁" },
  { id: 9,  title: "Lists",                 videoId: "HGTJBPNC-Gw", timestamp: 2577,  duration: "6:34",  completed: false, emoji: "📄" },
  { id: 10, title: "Tables",                videoId: "HGTJBPNC-Gw", timestamp: 2971,  duration: "4:42",  completed: false, emoji: "📊" },
  { id: 11, title: "Buttons",               videoId: "HGTJBPNC-Gw", timestamp: 3253,  duration: "5:15",  completed: false, emoji: "🔘" },
  { id: 12, title: "Forms",                 videoId: "HGTJBPNC-Gw", timestamp: 3568,  duration: "17:54", completed: false, emoji: "📝" },
  { id: 13, title: "Headers & Footers",     videoId: "HGTJBPNC-Gw", timestamp: 4642,  duration: "5:48",  completed: false, emoji: "🤯" },
  { id: 14, title: "Introduction to CSS",   videoId: "HGTJBPNC-Gw", timestamp: 4990,  duration: "8:00",  completed: false, emoji: "🎨" },
  { id: 15, title: "Colors",                videoId: "HGTJBPNC-Gw", timestamp: 5470,  duration: "4:12",  completed: false, emoji: "🖌️" },
  { id: 16, title: "Fonts",                 videoId: "HGTJBPNC-Gw", timestamp: 5722,  duration: "7:20",  completed: false, emoji: "🔤" },
  { id: 17, title: "Borders",               videoId: "HGTJBPNC-Gw", timestamp: 6162,  duration: "4:27",  completed: false, emoji: "🖼" },
  { id: 18, title: "Shadows",               videoId: "HGTJBPNC-Gw", timestamp: 6429,  duration: "3:18",  completed: false, emoji: "👥" },
  { id: 19, title: "Margins",               videoId: "HGTJBPNC-Gw", timestamp: 6627,  duration: "5:14",  completed: false, emoji: "↔️" },
  { id: 20, title: "Float",                 videoId: "HGTJBPNC-Gw", timestamp: 6941,  duration: "4:27",  completed: false, emoji: "🎈" },
  { id: 21, title: "Overflow",              videoId: "HGTJBPNC-Gw", timestamp: 7208,  duration: "3:23",  completed: false, emoji: "🌊" },
  { id: 22, title: "Display Property",      videoId: "HGTJBPNC-Gw", timestamp: 7411,  duration: "4:12",  completed: false, emoji: "🧱" },
  { id: 23, title: "Height and Width",      videoId: "HGTJBPNC-Gw", timestamp: 7663,  duration: "6:54",  completed: false, emoji: "📏" },
  { id: 24, title: "Positions",             videoId: "HGTJBPNC-Gw", timestamp: 8077,  duration: "6:23",  completed: false, emoji: "🎯" },
  { id: 25, title: "Background Images",     videoId: "HGTJBPNC-Gw", timestamp: 8460,  duration: "3:15",  completed: false, emoji: "🏙️" },
  { id: 26, title: "Combinators",           videoId: "HGTJBPNC-Gw", timestamp: 8655,  duration: "4:57",  completed: false, emoji: "➕" },
  { id: 27, title: "Pseudo-classes",        videoId: "HGTJBPNC-Gw", timestamp: 8952,  duration: "7:38",  completed: false, emoji: "☟" },
  { id: 28, title: "Pseudo-elements",       videoId: "HGTJBPNC-Gw", timestamp: 9410,  duration: "5:56",  completed: false, emoji: "✔" },
  { id: 29, title: "Pagination",            videoId: "HGTJBPNC-Gw", timestamp: 9766,  duration: "8:58",  completed: false, emoji: "🕮" },
  { id: 30, title: "Dropdown Menus",        videoId: "HGTJBPNC-Gw", timestamp: 10304, duration: "6:35",  completed: false, emoji: "🔻" },
  { id: 31, title: "Navigation Bar",        videoId: "HGTJBPNC-Gw", timestamp: 10699, duration: "6:27",  completed: false, emoji: "🧭" },
  { id: 32, title: "Website Layout",        videoId: "HGTJBPNC-Gw", timestamp: 11086, duration: "9:27",  completed: false, emoji: "🗺️" },
  { id: 33, title: "Image Gallery",         videoId: "HGTJBPNC-Gw", timestamp: 11653, duration: "5:37",  completed: false, emoji: "📷" },
  { id: 34, title: "Icons",                 videoId: "HGTJBPNC-Gw", timestamp: 11990, duration: "8:33",  completed: false, emoji: "🐤" },
  { id: 35, title: "Flexbox",               videoId: "HGTJBPNC-Gw", timestamp: 12503, duration: "10:00", completed: false, emoji: "💪" },
  { id: 36, title: "Transformations",       videoId: "HGTJBPNC-Gw", timestamp: 13103, duration: "9:00",  completed: false, emoji: "🔄" },
  { id: 37, title: "Animations",            videoId: "HGTJBPNC-Gw", timestamp: 13643, duration: "8:37",  completed: false, emoji: "🎬" },
];

const VideoPlayer: React.FC<VideoPlayerProps> = ({ courseId, onBack }) => {
  const [playlist, setPlaylist] = useState<Video[]>(PLAYLIST);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const playerRef = useRef<any>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ytApiLoaded = useRef(false);

  const currentVideo = playlist[currentVideoIndex];
  const completedCount = playlist.filter((v) => v.completed).length;
  const progressPercentage = Math.round((completedCount / playlist.length) * 100);
  const allCompleted = playlist.every((v) => v.completed);

  // ─── Core: figure out which lesson index the current playback time maps to ──
  // A lesson is "active" from its timestamp until the next lesson's timestamp.
  const getLessonIndexForTime = (currentTime: number): number => {
    let activeIndex = 0;
    for (let i = 0; i < PLAYLIST.length; i++) {
      if (currentTime >= PLAYLIST[i].timestamp) {
        activeIndex = i;
      } else {
        break;
      }
    }
    return activeIndex;
  };

  // ─── Poll every second; update active lesson + auto-complete previous ones ──
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== "function") return;

      const currentTime: number = playerRef.current.getCurrentTime();
      const activeIndex = getLessonIndexForTime(currentTime);

      // Update highlighted lesson in sidebar
      setCurrentVideoIndex(activeIndex);

      // Mark every lesson whose timestamp has been passed as completed
      setPlaylist((prev) => {
        let changed = false;
        const updated = prev.map((video, i) => {
          // A lesson is complete once the video has moved past it (i.e. the NEXT
          // lesson's timestamp has been reached, meaning i < activeIndex)
          if (i < activeIndex && !video.completed) {
            changed = true;
            return { ...video, completed: true };
          }
          return video;
        });

        if (changed) {
          const allDone = updated.every((v) => v.completed);
          if (allDone) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }

        return changed ? updated : prev;
      });
    }, 1000);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // ─── Bootstrap YouTube IFrame API ───────────────────────────────────────────
  useEffect(() => {
    if (ytApiLoaded.current) return;
    ytApiLoaded.current = true;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId: PLAYLIST[0].videoId,
        playerVars: { start: 0, autoplay: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => startPolling(),
          onStateChange: (event: any) => {
            // 1 = playing, 3 = buffering → keep polling; 2 = paused, 0 = ended → stop
            if (event.data === 1 || event.data === 3) {
              startPolling();
            } else {
              stopPolling();
            }
          },
        },
      });
    };

    return () => {
      stopPolling();
      playerRef.current?.destroy();
    };
  }, [startPolling, stopPolling]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  // Clicking a lesson in the sidebar seeks the video to that timestamp
  const handleVideoSelect = (index: number) => {
    const isUnlocked = index === 0 || playlist[index - 1].completed;
    if (!isUnlocked) return;
    playerRef.current?.seekTo(PLAYLIST[index].timestamp, true);
    setCurrentVideoIndex(index);
  };

  // Manual "Mark Complete" — marks current lesson and seeks to the next one
  const handleMarkComplete = () => {
    setPlaylist((prev) => {
      const updated = [...prev];
      updated[currentVideoIndex] = { ...updated[currentVideoIndex], completed: true };
      const allDone = updated.every((v) => v.completed);
      if (allDone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      return updated;
    });

    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < PLAYLIST.length) {
      playerRef.current?.seekTo(PLAYLIST[nextIndex].timestamp, true);
      setCurrentVideoIndex(nextIndex);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      const i = currentVideoIndex - 1;
      playerRef.current?.seekTo(PLAYLIST[i].timestamp, true);
      setCurrentVideoIndex(i);
    }
  };

  const handleNextVideo = () => {
    const i = currentVideoIndex + 1;
    if (i < PLAYLIST.length && currentVideo.completed) {
      playerRef.current?.seekTo(PLAYLIST[i].timestamp, true);
      setCurrentVideoIndex(i);
    }
  };

  const isVideoUnlocked = (index: number) =>
    index === 0 || playlist[index - 1].completed;



  return (
    <div className="bg-slate-50">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-slate-800 truncate">Complete Web Development</h1>
          <p className="text-xs text-slate-500">HTML & CSS Full Course</p>
        </div>
        <div className="flex items-center gap-2">
          {allCompleted && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              🎉 Completed!
            </span>
          )}
          <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
        </div>
      </div>



      <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0">

          {/* YouTube Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
            <div id="yt-player" className="w-full h-full" />
          </div>

          {/* Video Info */}
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {currentVideo.emoji && <span>{currentVideo.emoji}</span>}
                  {currentVideo.title}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {currentVideo.duration}
                  </span>
                  <span>Lesson {currentVideoIndex + 1} of {playlist.length}</span>
                </div>
              </div>

              {!currentVideo.completed ? (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shrink-0"
                >
                  <Check className="w-4 h-4" />
                  Mark Complete
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm shrink-0">
                  <Check className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>

            {/* Info strip */}
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
              <Play className="w-3 h-3 text-blue-400 shrink-0" />
              <span>
                Lessons auto-complete as you watch — once the video reaches the next lesson's
                timestamp, the previous lesson is marked done automatically
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handlePreviousVideo}
                disabled={currentVideoIndex === 0}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNextVideo}
                disabled={currentVideoIndex === playlist.length - 1 || !currentVideo.completed}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors ml-auto"
              >
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Completion Card */}
          {allCompleted && (
            <div className="mt-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center shadow-lg">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
              <p className="text-blue-100 mb-4">
                You've completed the Complete Web Development course with {playlist.length} lessons!
              </p>
              <button
                onClick={onBack}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Back to Courses
              </button>
            </div>
          )}
        </div>

        {/* Playlist Sidebar */}
        <div className="w-full lg:w-80 xl:w-96">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Course Content</h3>
              <p className="text-xs text-slate-500 mt-1">
                {completedCount} of {playlist.length} lessons completed
              </p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] lg:max-h-[70vh]">
              {playlist.map((video, index) => {
                const isUnlocked = isVideoUnlocked(index);
                const isCurrent = index === currentVideoIndex;

                return (
                  <button
                    key={video.id}
                    onClick={() => handleVideoSelect(index)}
                    disabled={!isUnlocked}
                    className={`w-full p-3 sm:p-4 flex items-start gap-3 border-b border-slate-100 transition-all text-left
                      ${isCurrent ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}
                      ${isUnlocked ? "hover:bg-slate-50 cursor-pointer" : "opacity-50 cursor-not-allowed"}
                    `}
                  >
                    <div className="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                      {video.completed ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : isUnlocked ? (
                        <div className="w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center">
                          <Play className="w-3 h-3 text-blue-400 ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? "text-blue-700" : "text-slate-700"}`}>
                        {video.emoji && <span className="mr-1">{video.emoji}</span>}
                        {video.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </p>
                      {!isUnlocked && (
                        <p className="text-xs text-slate-400 mt-0.5">🔒 Complete previous lesson</p>
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
  );
};

export default VideoPlayer;