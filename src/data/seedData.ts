import { Task, Habit } from '../types';
import { formatDateKey } from '../utils/routineLogic';

export function getInitialSeedData(): { tasks: Task[]; habits: Habit[] } {
  const now = new Date();
  const todayStr = formatDateKey(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateKey(yesterday);

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoStr = formatDateKey(twoDaysAgo);

  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const threeDaysAgoStr = formatDateKey(threeDaysAgo);

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDateKey(tomorrow);

  const tasks: Task[] = [
    // Today's tasks
    {
      id: 'task-1',
      title: 'Morning Mindful Stretch & Breathwork',
      category: 'Wellness',
      date: todayStr,
      time: '07:00',
      durationMinutes: 20,
      completed: true,
      timeSpentSeconds: 1200,
      priority: 'high',
      metric: {
        label: 'Mindful Minutes',
        current: 20,
        target: 20,
        unit: 'mins',
      },
      notes: 'Hydrate before beginning. 4-7-8 breathing technique.',
    },
    {
      id: 'task-2',
      title: 'High-Protein Breakfast & Daily Hydration',
      category: 'Wellness',
      date: todayStr,
      time: '07:45',
      durationMinutes: 30,
      completed: true,
      timeSpentSeconds: 1800,
      priority: 'medium',
      metric: {
        label: 'Water Intake',
        current: 5,
        target: 8,
        unit: 'glasses',
      },
    },
    {
      id: 'task-3',
      title: 'Deep Work: Core Architecture & Roadmap',
      category: 'Work',
      date: todayStr,
      time: '09:00',
      durationMinutes: 90,
      completed: false,
      timeSpentSeconds: 1540,
      priority: 'high',
      notes: 'No slack, no email. Focus on the core system pipeline.',
    },
    {
      id: 'task-4',
      title: 'Afternoon Tempo Run / Cardio Session',
      category: 'Fitness',
      date: todayStr,
      time: '16:30',
      durationMinutes: 45,
      completed: false,
      timeSpentSeconds: 0,
      priority: 'medium',
      metric: {
        label: 'Distance Target',
        current: 0,
        target: 5,
        unit: 'km',
      },
    },
    {
      id: 'task-5',
      title: 'Evening Book Reading: Atomic Habits',
      category: 'Learning',
      date: todayStr,
      time: '20:30',
      durationMinutes: 35,
      completed: false,
      timeSpentSeconds: 0,
      priority: 'medium',
      metric: {
        label: 'Pages Read',
        current: 12,
        target: 25,
        unit: 'pages',
      },
    },
    {
      id: 'task-6',
      title: 'Daily Reflection & Tomorrow Planning',
      category: 'Personal',
      date: todayStr,
      time: '21:30',
      durationMinutes: 15,
      completed: false,
      timeSpentSeconds: 0,
      priority: 'low',
    },

    // Yesterday's completed tasks (for rich history & streaks)
    {
      id: 'task-y1',
      title: 'Morning Yoga Flow',
      category: 'Wellness',
      date: yesterdayStr,
      time: '07:00',
      durationMinutes: 25,
      completed: true,
      timeSpentSeconds: 1500,
      priority: 'high',
      metric: { label: 'Water', current: 8, target: 8, unit: 'glasses' },
    },
    {
      id: 'task-y2',
      title: 'System Design Documentation',
      category: 'Work',
      date: yesterdayStr,
      time: '10:00',
      durationMinutes: 60,
      completed: true,
      timeSpentSeconds: 3600,
      priority: 'high',
    },
    {
      id: 'task-y3',
      title: 'Gym Strength Training: Upper Body',
      category: 'Fitness',
      date: yesterdayStr,
      time: '17:00',
      durationMinutes: 50,
      completed: true,
      timeSpentSeconds: 3000,
      priority: 'high',
      metric: { label: 'Sets', current: 16, target: 16, unit: 'sets' },
    },
    {
      id: 'task-y4',
      title: 'Spanish Language Practice',
      category: 'Learning',
      date: yesterdayStr,
      time: '20:00',
      durationMinutes: 30,
      completed: true,
      timeSpentSeconds: 1800,
      priority: 'medium',
      metric: { label: 'Cards', current: 30, target: 30, unit: 'cards' },
    },

    // 2 days ago
    {
      id: 'task-2d1',
      title: 'Morning Meditation',
      category: 'Wellness',
      date: twoDaysAgoStr,
      time: '07:15',
      durationMinutes: 20,
      completed: true,
      timeSpentSeconds: 1200,
      priority: 'medium',
    },
    {
      id: 'task-2d2',
      title: 'Sprint Planning & Team Sync',
      category: 'Work',
      date: twoDaysAgoStr,
      time: '11:00',
      durationMinutes: 45,
      completed: true,
      timeSpentSeconds: 2700,
      priority: 'high',
    },
    {
      id: 'task-2d3',
      title: '5km Sunset Jog',
      category: 'Fitness',
      date: twoDaysAgoStr,
      time: '18:00',
      durationMinutes: 35,
      completed: true,
      timeSpentSeconds: 2100,
      priority: 'medium',
      metric: { label: 'Distance', current: 5, target: 5, unit: 'km' },
    },

    // 3 days ago
    {
      id: 'task-3d1',
      title: 'Morning Journaling & Coffee',
      category: 'Personal',
      date: threeDaysAgoStr,
      time: '07:30',
      durationMinutes: 25,
      completed: true,
      timeSpentSeconds: 1500,
      priority: 'low',
    },
    {
      id: 'task-3d2',
      title: 'Client Proposal Review',
      category: 'Work',
      date: threeDaysAgoStr,
      time: '14:00',
      durationMinutes: 75,
      completed: true,
      timeSpentSeconds: 4500,
      priority: 'high',
    },

    // Tomorrow preview
    {
      id: 'task-tom1',
      title: 'Morning Sunrise Run',
      category: 'Fitness',
      date: tomorrowStr,
      time: '06:45',
      durationMinutes: 40,
      completed: false,
      timeSpentSeconds: 0,
      priority: 'high',
      metric: { label: 'Distance', current: 0, target: 6, unit: 'km' },
    },
    {
      id: 'task-tom2',
      title: 'Quarterly OKR Review Session',
      category: 'Work',
      date: tomorrowStr,
      time: '10:00',
      durationMinutes: 60,
      completed: false,
      timeSpentSeconds: 0,
      priority: 'high',
    },
  ];

  const habits: Habit[] = [
    {
      id: 'habit-1',
      name: 'Drink 2.5L Water',
      category: 'Wellness',
      targetDaysPerWeek: 7,
      color: '#0D9488', // teal-600
      completedDates: [threeDaysAgoStr, twoDaysAgoStr, yesterdayStr, todayStr],
      metricUnit: 'glasses',
      metricTarget: 8,
      createdAt: '2026-10-01',
    },
    {
      id: 'habit-2',
      name: 'Morning Mindfulness / Meditation',
      category: 'Wellness',
      targetDaysPerWeek: 7,
      color: '#06B6D4', // cyan-500
      completedDates: [threeDaysAgoStr, twoDaysAgoStr, yesterdayStr, todayStr],
      metricUnit: 'mins',
      metricTarget: 15,
      createdAt: '2026-10-01',
    },
    {
      id: 'habit-3',
      name: 'Read 20+ Pages of Non-Fiction',
      category: 'Learning',
      targetDaysPerWeek: 6,
      color: '#3B82F6', // blue-500
      completedDates: [threeDaysAgoStr, twoDaysAgoStr, yesterdayStr],
      metricUnit: 'pages',
      metricTarget: 20,
      createdAt: '2026-10-05',
    },
    {
      id: 'habit-4',
      name: '10,000 Steps / Physical Activity',
      category: 'Fitness',
      targetDaysPerWeek: 6,
      color: '#10B981', // emerald-500
      completedDates: [threeDaysAgoStr, twoDaysAgoStr, yesterdayStr],
      metricUnit: 'steps',
      metricTarget: 10000,
      createdAt: '2026-10-08',
    },
    {
      id: 'habit-5',
      name: 'Digital Curfew (No screens 1hr before bed)',
      category: 'Personal',
      targetDaysPerWeek: 7,
      color: '#8B5CF6', // purple-500
      completedDates: [threeDaysAgoStr, twoDaysAgoStr, yesterdayStr],
      createdAt: '2026-10-12',
    },
  ];

  return { tasks, habits };
}
