import { auth } from "./firebase";

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

class GoogleCalendarService {
  private accessToken: string | null = null;

  async getAccessToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      // Get the Firebase ID token and exchange it for a Google access token
      const idToken = await user.getIdToken();
      
      // This would typically require backend implementation to exchange tokens
      // For now, we'll use the Firebase user's access token if available
      const credential = await user.getIdTokenResult();
      
      // In a real implementation, you'd need to set up proper OAuth scopes
      // and token exchange on the backend
      return credential.token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async createEvent(event: CalendarEvent): Promise<any> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async listEvents(timeMin?: string, timeMax?: string): Promise<any[]> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const params = new URLSearchParams({
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<any> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  // Convert our internal task format to Google Calendar event format
  taskToCalendarEvent(task: any): CalendarEvent {
    const startDate = new Date(task.startTime);
    const endDate = new Date(startDate.getTime() + task.duration * 60 * 1000);

    return {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
  }

  // Convert Google Calendar event to our internal task format
  calendarEventToTask(event: any): any {
    const startTime = new Date(event.start.dateTime || event.start.date);
    const endTime = new Date(event.end.dateTime || event.end.date);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      startTime: startTime.toISOString(),
      duration: duration,
      priority: 'medium', // Default priority for imported events
      goalId: null,
      googleEventId: event.id,
    };
  }
}

export const googleCalendar = new GoogleCalendarService();