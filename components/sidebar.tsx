import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Brain, Lightbulb, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOutUser } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import GoalCard from "./goal-card";
import AddGoalDialog from "./add-goal-dialog";
import type { Goal, AiSuggestion } from "@/shared/schema";

export default function Sidebar() {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const { user } = useAuth();

  const handleSignOut = () => {
    signOutUser();
  };

  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const { data: suggestions = [], isLoading: suggestionsLoading } = useQuery<AiSuggestion[]>({
    queryKey: ["/api/ai-suggestions"],
  });

  const unreadSuggestions = suggestions.filter(s => !s.isRead);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="text-white w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Motion AI</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="p-2 h-8 w-8"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-3 mb-3">
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.displayName || user.email}
              </p>
            </div>
          </div>
        )}
        
        {/* AI Status */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full ai-pulse"></div>
          <span className="text-gray-600">AI is active and learning</span>
        </div>
      </div>

      {/* Goals Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Goals</h2>
            <Button
              onClick={() => setIsAddGoalOpen(true)}
              size="sm"
              className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 custom-scrollbar">
          <div className="space-y-3 pb-6">
            {goalsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No goals yet</p>
                <p className="text-gray-400 text-xs">Add your first goal to get started</p>
              </div>
            ) : (
              goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))
            )}
          </div>
        </ScrollArea>

        {/* AI Suggestions */}
        {unreadSuggestions.length > 0 && (
          <div className="p-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 text-blue-600 mr-2" />
              AI Suggestions
            </h3>
            <div className="space-y-2">
              {unreadSuggestions.slice(0, 2).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="text-sm bg-blue-50 border border-blue-100 rounded-lg p-3"
                >
                  <p className="text-gray-700">{suggestion.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddGoalDialog 
        isOpen={isAddGoalOpen} 
        onClose={() => setIsAddGoalOpen(false)} 
      />
    </div>
  );
}
