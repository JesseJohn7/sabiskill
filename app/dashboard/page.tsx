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

  // ── Shared course progress state (lifted so Home & Explore stay in sync) ──
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);

  // Called when user clicks "Get Started" / "Continue" on any course card
  const handleCourseSelect = (courseId: string) => {
    setActiveCourseId(courseId);
    setSelectedCourse(courseId);
  };

  // Call this to mark a course complete (wire up inside VideoPlayer if it supports it)
  const handleCourseComplete = (courseId: string) => {
    setCompletedCourseIds((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
    setActiveCourseId(null);
    setSelectedCourse(null);
  };

  const handleBackFromVideo = () => {
    setSelectedCourse(null);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedCourse(null);
  };

  // ── Navigate to settings when bell icon is clicked ──
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
            onCourseSelect={handleCourseSelect}
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