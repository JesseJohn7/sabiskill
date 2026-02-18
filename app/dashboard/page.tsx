"use client";

import React, { useState } from "react";
import Sidebar from "../dashboard/components/sidebar";
import Header from "../dashboard/components/Header";
import HomeTab from "../dashboard/components/Hometab";
import ExploreTab from "./components/ExploreTab";
import ResourcesTab from "../dashboard/components/ResourcesTab";
import SettingsTab from "../dashboard/components/SettingsTab";
import VideoPlayer from "../dashboard/components/VideoPlayer";
import CommunityTab from "../dashboard/components/CommunityTab";

const DashboardPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const handleBackFromVideo = () => {
    setSelectedCourse(null);
  };

  // When a sidebar tab is clicked while video is playing:
  // just close the video and switch tab — sidebar already calls setCurrentTab
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedCourse(null); // exit video player when navigating away
  };

  const renderTab = () => {
    switch (currentTab) {
      case "home":
        return <HomeTab onNavigate={setCurrentTab} onCourseSelect={handleCourseSelect} />;
      case "explore":
        return <ExploreTab />;
      case "community":
        return <CommunityTab />;
      case "resources":
        return <ResourcesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <HomeTab onNavigate={setCurrentTab} onCourseSelect={handleCourseSelect} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFC] overflow-x-hidden">
      {/* Sidebar is ALWAYS rendered so tabs always work, even during video */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}  // ← use handleTabChange so it also closes video
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 lg:ml-24 flex flex-col min-w-0">
        {!selectedCourse && (
          <Header
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onCourseSelect={handleCourseSelect}
          />
        )}

        <main
          className={`${
            selectedCourse ? "" : "p-8 sm:p-12 max-w-[1400px] mx-auto"
          } w-full`}
        >
          {selectedCourse ? (
            <VideoPlayer
              courseId={selectedCourse}
              onBack={handleBackFromVideo}  // ← back button just closes video, stays on current tab
            />
          ) : (
            renderTab()
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;