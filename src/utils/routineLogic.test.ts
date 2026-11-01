import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDuration,
  formatSeconds,
  calculateHabitStreak,
  calculateProductivityScore,
  calculateOverallStreak,
  getWeeklyActivitySummary,
} from './routineLogic';
import { Task, Habit } from '../types';

test('formatDuration formats minutes accurately', () => {
  assert.equal(formatDuration(0), '0m');
  assert.equal(formatDuration(25), '25m');
  assert.equal(formatDuration(60), '1h');
  assert.equal(formatDuration(90), '1h 30m');
  assert.equal(formatDuration(125), '2h 5m');
});

test('formatSeconds formats mm:ss and hh:mm:ss properly', () => {
  assert.equal(formatSeconds(0), '00:00');
  assert.equal(formatSeconds(65), '01:05');
  assert.equal(formatSeconds(1500), '25:00');
  assert.equal(formatSeconds(3665), '01:01:05');
});

test('calculateHabitStreak counts consecutive days properly', () => {
  const refDate = '2026-10-31';
  // Consecutive 4 days: 28, 29, 30, 31
  const dates = ['2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'];
  const streak = calculateHabitStreak(dates, refDate);
  assert.equal(streak.currentStreak, 4);
  assert.equal(streak.bestStreak, 4);

  // If today is missing but yesterday is completed
  const yesterdayOnly = ['2026-10-29', '2026-10-30'];
  const streak2 = calculateHabitStreak(yesterdayOnly, refDate);
  assert.equal(streak2.currentStreak, 2);

  // Gaps break current streak
  const withGap = ['2026-10-20', '2026-10-21', '2026-10-31'];
  const streak3 = calculateHabitStreak(withGap, refDate);
  assert.equal(streak3.currentStreak, 1);
  assert.equal(streak3.bestStreak, 2);
});

test('calculateProductivityScore accounts for tasks, metrics, and habits', () => {
  const dateStr = '2026-10-31';
  const tasks: Task[] = [
    {
      id: 't1',
      title: 'Morning Yoga',
      category: 'Wellness',
      date: dateStr,
      time: '07:00',
      durationMinutes: 30,
      completed: true,
      timeSpentSeconds: 1800,
      priority: 'high',
      metric: { label: 'Water', current: 8, target: 8, unit: 'glasses' },
    },
    {
      id: 't2',
      title: 'Code Review',
      category: 'Work',
      date: dateStr,
      time: '10:00',
      durationMinutes: 60,
      completed: false,
      timeSpentSeconds: 0,
      priority: 'high',
    },
  ];

  const habits: Habit[] = [
    {
      id: 'h1',
      name: 'Meditation',
      category: 'Wellness',
      targetDaysPerWeek: 7,
      color: '#14B8A6',
      completedDates: [dateStr],
      createdAt: '2026-10-01',
    },
    {
      id: 'h2',
      name: 'No Sugar',
      category: 'Wellness',
      targetDaysPerWeek: 7,
      color: '#0EA5E9',
      completedDates: [],
      createdAt: '2026-10-01',
    },
  ];

  // 1/2 tasks completed => 25 pts (out of 50)
  // Metric task has 8/8 => 25 pts (out of 25)
  // 1/2 habits completed => 12.5 pts (out of 25)
  // Total ~ 63 pts
  const score = calculateProductivityScore(tasks, habits, dateStr);
  assert.ok(score >= 60 && score <= 65);
});

test('getWeeklyActivitySummary produces 7 day entries', () => {
  const summary = getWeeklyActivitySummary([], [], '2026-10-31');
  assert.equal(summary.length, 7);
  assert.equal(summary[6].date, '2026-10-31');
  assert.equal(summary[6].isToday, true);
});
