import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, X, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Goal, Task } from "@/shared/schema";

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiChatModal({ isOpen, onClose }: AiChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "I can help you manage your calendar and create tasks automatically! Ask me to 'Create a weekly workout plan' or 'Schedule my morning routine' and I'll add actual events to your calendar. I can also answer questions about productivity and time management.",
      isAi: true,
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
    enabled: isOpen,
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: isOpen,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { 
        message,
        goals,
        tasks
      });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        content: data.response,
        isAi: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // If tasks were created, refresh the calendar data
      if (data.action === 'create_tasks' || data.action === 'create_goal') {
        // Invalidate queries to refresh the calendar
        import("@/lib/queryClient").then(({ queryClient }) => {
          queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
          queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isAi: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage.trim());
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "Create a weekly workout plan",
    "Schedule my morning routine for next week", 
    "Plan my study sessions for learning Spanish",
  ];

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(prompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0" aria-describedby="ai-chat-description">
        {/* Chat Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-blue-purple rounded-full flex items-center justify-center">
                <Brain className="text-white w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-gray-900 dark:text-gray-100">AI Assistant</DialogTitle>
                <p id="ai-chat-description" className="text-sm text-gray-600 dark:text-gray-400">Ready to help optimize your schedule</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-6 custom-scrollbar">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                {message.isAi && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="text-white w-4 h-4" />
                  </div>
                )}
                <div className={`flex-1 ${!message.isAi ? 'ml-11' : ''}`}>
                  <div
                    className={`rounded-2xl p-3 ${
                      message.isAi
                        ? 'bg-gray-100 dark:bg-gray-800 rounded-tl-md'
                        : 'bg-blue-600 text-white ml-8 rounded-tr-md'
                    }`}
                  >
                    <p className={`text-sm ${message.isAi ? 'text-gray-900 dark:text-gray-100' : 'text-white'}`}>{message.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="text-white w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Prompts (only show if no user messages yet) */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Suggested questions:</p>
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start text-sm h-auto p-3 bg-blue-50 hover:bg-blue-100 border-blue-100"
                    onClick={() => handleSuggestedPrompt(prompt)}
                  >
                    "{prompt}"
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your schedule..."
              className="flex-1"
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
