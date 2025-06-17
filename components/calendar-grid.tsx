import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import TaskCard from "./task-card";
import { apiRequest } from "@/lib/queryClient";
import type { Task } from "@/shared/schema";

interface CalendarGridProps {
  currentDate: Date;
  view: "day" | "week" | "month";
  onLoading: (loading: boolean) => void;
}

export default function CalendarGrid({ currentDate, view, onLoading }: CalendarGridProps) {
  const queryClient = useQueryClient();
  
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", { date: currentDate.toISOString().split('T')[0] }],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: number; updates: Partial<Task> }) => {
      const response = await apiRequest("PUT", `/api/tasks/${taskId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Generate time slots for the day view
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return {
      hour,
      label: `${displayHour} ${ampm}`,
      time: `${hour.toString().padStart(2, '0')}:00`,
    };
  });

  // Get current time for the time indicator
  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Calculate position as percentage (each hour is 64px)
    const position = (currentHour * 64) + (currentMinute / 60 * 64);
    return position;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = parseInt(result.draggableId);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Calculate new time based on drop position
    const dropIndex = result.destination.index;
    const newStartTime = new Date(task.startTime);
    
    // Simple repositioning logic - move task to new hour slot
    const hourDiff = dropIndex;
    newStartTime.setHours(newStartTime.getHours() + hourDiff);
    
    const newEndTime = new Date(newStartTime);
    newEndTime.setMinutes(newEndTime.getMinutes() + task.duration);

    updateTaskMutation.mutate({
      taskId,
      updates: {
        startTime: newStartTime,
        endTime: newEndTime,
      },
    });
  };

  const getTaskPosition = (task: Task) => {
    const startTime = new Date(task.startTime);
    const hour = startTime.getHours();
    const minute = startTime.getMinutes();
    
    // Calculate top position (64px per hour + header)
    const top = (hour * 64) + (minute / 60 * 64) + 48; // 48px for header
    
    // Calculate height based on duration
    const height = (task.duration / 60) * 64;
    
    return { top, height };
  };

  if (view !== "day") {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Week and Month views</p>
          <p className="text-sm">Coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex">
          {/* Time Labels */}
          <div className="w-16 border-r border-gray-200">
            <div className="h-12 border-b border-gray-100"></div>
            {timeSlots.slice(6, 22).map((slot) => (
              <div key={slot.hour} className="h-16 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
                <span className="text-xs text-gray-500">{slot.label}</span>
              </div>
            ))}
          </div>

          {/* Calendar Day Column */}
          <div className="flex-1 relative">
            {/* Day Header */}
            <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-600">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {currentDate.getDate()}
                </div>
              </div>
            </div>

            {/* Time Grid */}
            <Droppable droppableId="calendar-grid">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="relative calendar-grid-lines"
                  style={{ minHeight: `${16 * 64}px` }}
                >
                  {/* Grid Lines */}
                  {timeSlots.slice(6, 22).map((_, index) => (
                    <div key={index} className="h-16 border-b border-gray-100"></div>
                  ))}

                  {/* Current Time Indicator */}
                  {currentDate.toDateString() === new Date().toDateString() && (
                    <div
                      className="absolute left-0 right-0 current-time-line z-10"
                      style={{ top: `${getCurrentTimePosition()}px` }}
                    >
                      <div className="text-xs text-red-500 absolute right-2 -top-2">
                        {new Date().toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {tasks.map((task, index) => {
                    const position = getTaskPosition(task);
                    return (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`absolute left-2 right-2 z-20 ${
                              snapshot.isDragging ? 'task-dragging' : ''
                            }`}
                            style={{
                              top: `${position.top}px`,
                              height: `${Math.max(position.height, 48)}px`,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
