"use client";

import React, { useState } from "react";
import Sidebar from "../dashboard/components/sidebar";
import Header from "../dashboard/components/Header";
import HomeTab from "./components/HomeTab";
import ExploreTab from "./components/ExploreTab";
import ResourcesTab from "./components/ResourcesTab";
import SettingsTab from "./components/SettingsTab";

const DashboardPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (currentTab) {
      case "home":
        return <HomeTab />;
      case "explore":
        return <ExploreTab />;
      case "resources":
        return <ResourcesTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <HomeTab />;
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
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-8 sm:p-12 max-w-[1400px] mx-auto w-full">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;