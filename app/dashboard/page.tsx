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
import { useCourseProgress } from "../dashboard/components/UseCourseProgress";

const DashboardPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // ── All course progress now loaded from & saved to Supabase ──
  const {
    activeCourseId,
    completedCourseIds,
    selectCourse,
    completeCourse,
    loading,
  } = useCourseProgress();

  const handleCourseSelect = async (courseId: string) => {
    await selectCourse(courseId);   // saves to Supabase
    setSelectedCourse(courseId);
  };

  const handleCourseComplete = async (courseId: string) => {
    await completeCourse(courseId); // saves to Supabase
    setSelectedCourse(null);
  };

  const handleBackFromVideo = () => {
    setSelectedCourse(null);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedCourse(null);
  };

  const handleNotificationClick = () => {
    handleTabChange("settings");
  };

  const renderTab = () => {
    switch (currentTab) {
      case "home":
        return (
          <HomeTab
            onNavigate={setCurrentTab}
            onCourseSelect={handleCourseSelect}
            activeCourseId={activeCourseId}
            completedCourseIds={completedCourseIds}
          />
        );
      case "explore":
        return (
          <ExploreTab
            onNavigate={setCurrentTab}
            onCourseSelect={handleCourseSelect}
            activeCourseId={activeCourseId}
            completedCourseIds={completedCourseIds}
          />
        );
      case "community":
        return <CommunityTab />;
      case "resources":
        return <ResourcesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return (
          <HomeTab
            onNavigate={setCurrentTab}
            onCourseSelect={handleCourseSelect}
            activeCourseId={activeCourseId}
            completedCourseIds={completedCourseIds}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFC] overflow-x-hidden">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 lg:ml-24 flex flex-col min-w-0">
        {!selectedCourse && (
          <Header
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onNotificationClick={handleNotificationClick}
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
              onBack={handleBackFromVideo}
              onComplete={handleCourseComplete}
            />
          ) : loading ? (
            // Brief loading state while Supabase fetches progress
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Loading your progress...</p>
              </div>
            </div>
          ) : (
            renderTab()
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;