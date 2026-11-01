import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  PieChart,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Task, Habit, DayActivity } from '../types';
import {
  getWeeklyActivitySummary,
  calculateOverallStreak,
  formatDuration,
} from '../utils/routineLogic';

interface AnalyticsViewProps {
  tasks: Task[];
  habits: Habit[];
  selectedDate: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  habits,
  selectedDate,
}) => {
  const [chartMetric, setChartMetric] = useState<'score' | 'completion' | 'time'>('score');

  const weeklySummary = getWeeklyActivitySummary(tasks, habits, selectedDate);
  const overallStreak = calculateOverallStreak(tasks, habits, selectedDate);

  // Overall statistics
  const totalCompletedTasks = tasks.filter((t) => t.completed).length;
  const totalTrackedSeconds = tasks.reduce((acc, t) => acc + (t.timeSpentSeconds || 0), 0);
  const totalFocusHours = (totalTrackedSeconds / 3600).toFixed(1);

  const averageWeeklyScore = Math.round(
    weeklySummary.reduce((acc, d) => acc + d.productivityScore, 0) / (weeklySummary.length || 1)
  );

  // Category breakdown
  const categoryStats = ['Wellness', 'Work', 'Fitness', 'Learning', 'Personal'].map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat);
    const completed = catTasks.filter((t) => t.completed).length;
    const totalMinutes = catTasks.reduce(
      (acc, t) => acc + (t.completed ? t.durationMinutes : Math.floor((t.timeSpentSeconds || 0) / 60)),
      0
    );
    return {
      category: cat,
      total: catTasks.length,
      completed,
      rate: catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0,
      totalMinutes,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Productivity Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Productivity Score</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white mono-number">
              {weeklySummary[weeklySummary.length - 1]?.productivityScore || 0}%
            </span>
            <span className="text-xs text-teal-400 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {averageWeeklyScore}% avg
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Weighted across tasks, metrics & habits
          </p>
        </div>

        {/* Current Active Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Unbroken Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white mono-number">
              {overallStreak}
            </span>
            <span className="text-xs text-amber-300 font-semibold">consecutive days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            At least 1 routine/habit checked daily
          </p>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white mono-number">
              {totalCompletedTasks}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              / {tasks.length} total
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {tasks.length > 0 ? Math.round((totalCompletedTasks / tasks.length) * 100) : 0}% all-time completion
          </p>
        </div>

        {/* Focused Time */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Focused Hours</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white mono-number">
              {totalFocusHours}h
            </span>
            <span className="text-xs text-cyan-400 font-medium">in flow state</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Measured via timer & scheduled duration
          </p>
        </div>
      </div>

      {/* Main Chart Section: Weekly Progress */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Weekly Activity History
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Daily Performance Matrix</h3>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setChartMetric('score')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === 'score'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Productivity Score
            </button>
            <button
              onClick={() => setChartMetric('completion')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === 'completion'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Task Completion %
            </button>
            <button
              onClick={() => setChartMetric('time')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMetric === 'time'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Minutes Spent
            </button>
          </div>
        </div>

        {/* SVG Custom Bar & Area Chart */}
        <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-800">
          {weeklySummary.map((day) => {
            let value = 0;
            let displayVal = '';

            if (chartMetric === 'score') {
              value = day.productivityScore;
              displayVal = `${value}%`;
            } else if (chartMetric === 'completion') {
              value = day.completionRate;
              displayVal = `${value}%`;
            } else {
              value = Math.min(100, Math.round((day.totalMinutes / 180) * 100));
              displayVal = `${day.totalMinutes}m`;
            }

            const barHeightPct = Math.max(8, value);

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity mb-2 mono-number">
                  {displayVal}
                </span>

                <div className="w-full max-w-[48px] bg-slate-950 rounded-xl p-1 flex items-end h-48 border border-slate-800/80 group-hover:border-teal-500/50 transition-colors">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      day.isToday
                        ? 'bg-gradient-to-t from-teal-500 to-cyan-400 shadow-lg shadow-teal-500/30'
                        : 'bg-gradient-to-t from-slate-700 to-teal-500/70 group-hover:from-teal-600 group-hover:to-cyan-400'
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>

                <div className="mt-3 text-center">
                  <p
                    className={`text-xs font-bold ${
                      day.isToday ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {day.dayLabel}
                  </p>
                  <p className="text-[10px] text-slate-500 mono-number">{day.dayNumber}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-4 pt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>Today ({weeklySummary[weeklySummary.length - 1]?.dayLabel})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span>Past Days</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Hover columns to view exact metrics
          </span>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Productivity Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-lg text-white">Category Time & Completion</h3>
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{item.category}</span>
                    <span className="text-slate-500">({item.total} tasks)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-medium">{formatDuration(item.totalMinutes)}</span>
                    <span className="font-bold text-teal-300 mono-number">{item.rate}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Formula Breakdown */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/20 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-lg text-white">How Score is Calculated</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            The AuraRoutine algorithm balances task execution, quantitative work targets, and daily recurring habits.
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">1. Task Completion (50%)</p>
                <p className="text-[11px] text-slate-400">Ratio of daily routine tasks checked off</p>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-md border border-teal-500/20">
                Max 50 pts
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">2. Metric Quantity Targets (25%)</p>
                <p className="text-[11px] text-slate-400">Pages read, km run, glasses logged against goals</p>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
                Max 25 pts
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">3. Recurring Habit Adherence (25%)</p>
                <p className="text-[11px] text-slate-400">Maintaining daily streaks and consistency</p>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                Max 25 pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
