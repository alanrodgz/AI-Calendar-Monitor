import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function getTimeSlots(): Array<{ hour: number; label: string; time: string }> {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour < 12 ? 'AM' : 'PM'
    return {
      hour,
      label: `${displayHour} ${ampm}`,
      time: `${hour.toString().padStart(2, '0')}:00`,
    }
  })
}

export function calculateTaskPosition(task: { startTime: Date; duration: number }) {
  const startTime = new Date(task.startTime)
  const hour = startTime.getHours()
  const minute = startTime.getMinutes()
  
  // Calculate top position (64px per hour + header)
  const top = (hour * 64) + (minute / 60 * 64) + 48 // 48px for header
  
  // Calculate height based on duration
  const height = (task.duration / 60) * 64
  
  return { top, height }
}

export function getCurrentTimePosition(): number {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // Calculate position as percentage (each hour is 64px)
  const position = (currentHour * 64) + (currentMinute / 60 * 64)
  return position
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'hsl(0, 84%, 60%)'
    case 'medium': return 'hsl(45, 93%, 47%)'
    case 'low': return 'hsl(159, 64%, 42%)'
    default: return 'hsl(215, 13.8%, 34.1%)'
  }
}

export function getPriorityBadgeVariant(priority: string): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case 'high': return 'destructive'
    case 'medium': return 'secondary'
    case 'low': return 'outline'
    default: return 'secondary'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
