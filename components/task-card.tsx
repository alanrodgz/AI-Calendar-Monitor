import { GripVertical, Brain, Users, Code, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const getIcon = () => {
    if (task.isAiGenerated) return <Brain className="w-3 h-3" />;
    if (task.title.toLowerCase().includes('meeting') || task.title.toLowerCase().includes('standup')) return <Users className="w-3 h-3" />;
    if (task.title.toLowerCase().includes('development') || task.title.toLowerCase().includes('coding')) return <Code className="w-3 h-3" />;
    if (task.title.toLowerCase().includes('spanish') || task.title.toLowerCase().includes('learning')) return <BookOpen className="w-3 h-3" />;
    return null;
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (task.isAiGenerated && task.priority === 'high') {
    return (
      <div 
        className="h-full gradient-blue-purple rounded-lg p-2 text-white shadow-sm cursor-move hover:shadow-md transition-shadow relative"
        style={{ backgroundColor: task.color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            {getIcon()}
            <span className="text-sm font-medium truncate">{task.title}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs opacity-80">{formatDuration(task.duration)}</span>
            <GripVertical className="w-3 h-3 opacity-50" />
          </div>
        </div>
        {task.description && (
          <div className="text-xs opacity-75 mt-1 truncate">
            {task.isAiGenerated ? 'AI scheduled • High focus time' : task.description}
          </div>
        )}
      </div>
    );
  }

  if (task.isAiGenerated && task.title.toLowerCase().includes('deep work')) {
    return (
      <div className="h-full gradient-purple-violet rounded-lg p-3 text-white shadow-sm cursor-move hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span className="font-medium">{task.title}</span>
          </div>
          <GripVertical className="w-4 h-4 opacity-50" />
        </div>
        <div className="text-sm opacity-90 mb-2">{task.description}</div>
        <div className="flex items-center justify-between text-xs">
          <span>AI optimized for your peak focus</span>
          <span>{formatDuration(task.duration)}</span>
        </div>
      </div>
    );
  }

  // Regular task card
  const isHighlight = task.color === '#10B981';
  
  return (
    <div 
      className={`h-full rounded-lg p-2 shadow-sm cursor-move hover:shadow-md transition-shadow ${
        isHighlight 
          ? 'text-white' 
          : 'bg-white border-l-4 text-gray-900'
      } ${getPriorityColor()}`}
      style={{ 
        backgroundColor: isHighlight ? task.color : undefined,
        borderLeftColor: !isHighlight ? task.color : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0">
          {getIcon()}
          <span className="text-sm font-medium truncate">{task.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${isHighlight ? 'opacity-80' : 'text-gray-500'}`}>
            {formatTime(task.startTime)}
          </span>
          <GripVertical className={`w-3 h-3 ${isHighlight ? 'opacity-50' : 'text-gray-400'}`} />
        </div>
      </div>
      
      {task.description && (
        <div className={`text-xs mt-1 truncate ${isHighlight ? 'opacity-75' : 'text-gray-500'}`}>
          {task.description}
        </div>
      )}
      
      <div className={`flex items-center justify-between text-xs mt-1 ${isHighlight ? 'opacity-80' : 'text-gray-500'}`}>
        <span>{formatDuration(task.duration)}</span>
        {task.isAiGenerated && (
          <Badge variant="secondary" className="h-4 text-xs">
            AI
          </Badge>
        )}
      </div>
    </div>
  );
}
