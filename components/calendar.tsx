"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import CalendarGrid from "@/components/calendar-grid";
import AiChatModal from "@/components/ai-chat-modal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageCircle, Brain } from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("day");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()));
  };

  const formatCurrentMonth = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Calendar Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {formatCurrentMonth()}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousMonth}
                  className="w-8 h-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="w-8 h-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={currentView === "day" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("day")}
                  className="px-3 py-1 text-sm h-8"
                >
                  Day
                </Button>
                <Button
                  variant={currentView === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("week")}
                  className="px-3 py-1 text-sm h-8"
                >
                  Week
                </Button>
                <Button
                  variant={currentView === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("month")}
                  className="px-3 py-1 text-sm h-8"
                >
                  Month
                </Button>
              </div>

              {/* AI Chat Toggle */}
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid 
          currentDate={currentDate}
          view={currentView}
          onLoading={setIsLoading}
        />
      </div>

      {/* AI Chat Modal */}
      <AiChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-40 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 ai-pulse">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-medium text-gray-900">AI is optimizing your schedule...</p>
            <p className="text-sm text-gray-600 mt-1">This may take a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}