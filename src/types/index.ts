export type TaskCategory = 'Work' | 'Wellness' | 'Fitness' | 'Learning' | 'Personal';

export interface TaskMetric {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  durationMinutes: number;
  completed: boolean;
  completedAt?: string;
  metric?: TaskMetric;
  timeSpentSeconds: number;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: TaskCategory;
  targetDaysPerWeek: number;
  color: string;
  completedDates: string[]; // YYYY-MM-DD
  metricUnit?: string;
  metricTarget?: number;
  createdAt: string;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  totalTasks: number;
  completedTasks: number;
  completionRate: number; // 0 to 100
  totalMinutes: number;
  habitCompletionRate: number;
  productivityScore: number;
}
