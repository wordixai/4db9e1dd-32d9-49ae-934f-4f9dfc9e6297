export type ActivityType = 'attraction' | 'reservation' | 'transportation' | 'accommodation' | 'other';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  address?: string;
  confirmationNumber?: string;
  cost?: number;
  currency?: string;
  notes?: string;
  url?: string;
  phone?: string;
}

export interface Day {
  id: string;
  date: string;
  title?: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: Day[];
  totalBudget?: number;
  currency?: string;
  travelers?: number;
  notes?: string;
}
