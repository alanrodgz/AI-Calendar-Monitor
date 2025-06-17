import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Goal } from "@shared/schema";

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateTasksMutation = useMutation({
    mutationFn: async (goalId: number) => {
      const response = await apiRequest("POST", `/api/ai/generate-tasks/${goalId}`);
      return response.json();
    },
    onSuccess: (tasks) => {
      toast({
        title: "Tasks Generated",
        description: `Created ${tasks.length} tasks from your goal`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPriorityBadgeVariant = () => {
    switch (goal.priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = () => {
    switch (goal.priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  const isHighPriority = goal.priority === 'high';

  return (
    <div className={`p-4 rounded-xl ${
      isHighPriority 
        ? 'gradient-blue-purple text-white' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-medium ${isHighPriority ? 'text-white' : 'text-gray-900'}`}>
          {goal.title}
        </h3>
        <Badge 
          variant={isHighPriority ? 'secondary' : getPriorityBadgeVariant()}
          className={`text-xs ${
            isHighPriority 
              ? 'bg-white bg-opacity-20 text-white border-white border-opacity-20' 
              : ''
          }`}
        >
          {getPriorityLabel()}
        </Badge>
      </div>
      
      <p className={`text-sm mb-3 ${
        isHighPriority ? 'opacity-90' : 'text-gray-600'
      }`}>
        {goal.description}
      </p>
      
      <div className={`flex items-center justify-between text-xs mb-3 ${
        isHighPriority ? 'text-white opacity-90' : 'text-gray-500'
      }`}>
        <span>Progress: {goal.progress}%</span>
        {goal.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(goal.dueDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <Progress 
          value={goal.progress} 
          className={`h-1 ${
            isHighPriority 
              ? 'bg-white bg-opacity-20' 
              : 'bg-gray-200'
          }`}
        />
      </div>

      <Button
        onClick={() => generateTasksMutation.mutate(goal.id)}
        disabled={generateTasksMutation.isPending}
        size="sm"
        variant={isHighPriority ? "secondary" : "default"}
        className={`w-full text-xs ${
          isHighPriority 
            ? 'bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 border-white border-opacity-20' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <Sparkles className="w-3 h-3 mr-1" />
        {generateTasksMutation.isPending ? 'Generating...' : 'Generate Tasks'}
      </Button>
    </div>
  );
}
