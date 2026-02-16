"use client";

import React, { useState } from "react";
import Sidebar from "../dashboard/components/sidebar";
import Header from "../dashboard/components/Header";
import HomeTab from "../dashboard/components/Hometab";
import ExploreTab from "./components/ExploreTab";
import ResourcesTab from "../dashboard/components/ResourcesTab";
import SettingsTab from "../dashboard/components/SettingsTab";
import VideoPlayer from "../dashboard/components/VideoPlayer";

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

  const handleNavigateFromVideo = (tab: string) => {
    setCurrentTab(tab);
    setSelectedCourse(null);
  };

  const renderTab = () => {
    switch (currentTab) {
      case "home":
        return <HomeTab onNavigate={setCurrentTab} onCourseSelect={handleCourseSelect} />;
      case "explore":
        return <ExploreTab />;
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
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 lg:ml-24 flex flex-col min-w-0">
        {/* Only show Header when not in video player mode */}
        {!selectedCourse && (
          <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onCourseSelect={handleCourseSelect}
          />
        )}
        
        <main className={`${selectedCourse ? '' : 'p-8 sm:p-12 max-w-[1400px] mx-auto'} w-full`}>
          {/* Show VideoPlayer if course selected, otherwise show tabs */}
          {selectedCourse ? (
            <VideoPlayer 
              courseId={selectedCourse} 
              onBack={handleBackFromVideo}
              onNavigate={handleNavigateFromVideo}
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