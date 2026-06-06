export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category: string;
  tags: string[];
  subtasks: Subtask[];
  timeSpent: number; // in minutes
  timeEstimate?: number; // in minutes
  dependencies: string[]; // IDs of tasks this depends on
  recurring?: RecurrencePattern;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  progress: number; // 0-100
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 for weekly
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Filter {
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  status?: 'all' | 'completed' | 'pending';
  dueDate?: 'overdue' | 'today' | 'upcoming' | 'all';
  tags?: string[];
  search?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}
