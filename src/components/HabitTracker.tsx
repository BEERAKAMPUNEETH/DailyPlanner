import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Flame,
  Plus,
  Trophy,
  Trash2,
  Calendar,
  X,
  Target,
  Sparkles,
} from 'lucide-react';
import { Habit, TaskCategory } from '../types';
import {
  formatDateKey,
  calculateHabitStreak,
  playChime,
} from '../utils/routineLogic';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  onDeleteHabit: (habitId: string) => void;
  selectedDate: string;
}

const habitCategories: TaskCategory[] = ['Wellness', 'Fitness', 'Learning', 'Work', 'Personal'];
const colorOptions = [
  '#0D9488', // teal
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#10B981', // emerald
  '#8B5CF6', // purple
  '#F59E0B', // amber
  '#EC4899', // pink
];

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onToggleHabitDay,
  onAddHabit,
  onDeleteHabit,
  selectedDate,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<TaskCategory>('Wellness');
  const [targetDays, setTargetDays] = useState(7);
  const [color, setColor] = useState('#0D9488');
  const [metricUnit, setMetricUnit] = useState('');
  const [metricTarget, setMetricTarget] = useState<number | undefined>(undefined);

  // Calculate past 7 days up to selectedDate
  const refDate = new Date(`${selectedDate}T00:00:00`);
  const past7Days: { dateStr: string; dayLabel: string; isToday: boolean }[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    past7Days.push({
      dateStr,
      dayLabel: dayLabels[d.getDay()],
      isToday: i === 0,
    });
  }

  // Calculate habits completed today
  const completedToday = habits.filter((h) => h.completedDates.includes(selectedDate)).length;
  const habitRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const handleCellClick = (habit: Habit, dateStr: string, e: React.MouseEvent) => {
    const willBeDone = !habit.completedDates.includes(dateStr);
    if (willBeDone) {
      playChime('complete');
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 24,
        spread: 45,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: [habit.color, '#2DD4BF', '#F59E0B'],
        disableForReducedMotion: true,
      });
    }
    onToggleHabitDay(habit.id, dateStr);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    onAddHabit({
      name: newHabitName.trim(),
      category: newHabitCategory,
      targetDaysPerWeek: targetDays,
      color,
      completedDates: [selectedDate],
      metricUnit: metricUnit.trim() || undefined,
      metricTarget: metricTarget ? Number(metricTarget) : undefined,
    });

    setNewHabitName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Habit Stats */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Recurring Daily Routines
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">Habit Mastery Matrix</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Atomic daily consistency builds compound momentum. Check off today’s habits to maintain streaks.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Daily completion rate badge */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-xl">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" className="text-slate-800" fill="transparent" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-teal-400"
                  strokeDasharray={100}
                  strokeDashoffset={100 - habitRate}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-white mono-number">
                {habitRate}%
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Today's Habits</p>
              <p className="text-sm font-bold text-white mono-number">
                {completedToday} / {habits.length}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            aria-label="Create New Habit"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Habit Grid */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        {/* Table header for past 7 days */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-6 py-3.5 bg-slate-950/60 border-b border-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="sm:col-span-5">Habit & Frequency</div>
          <div className="sm:col-span-2 text-center">Streaks</div>
          <div className="sm:col-span-5 grid grid-cols-7 gap-1.5 text-center">
            {past7Days.map((d) => (
              <div
                key={d.dateStr}
                className={`py-1 rounded-md text-[11px] ${
                  d.isToday ? 'text-teal-300 bg-teal-500/10 font-bold border border-teal-500/30' : 'text-slate-400'
                }`}
              >
                <span>{d.dayLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Rows */}
        <div className="divide-y divide-slate-800/60">
          {habits.map((habit) => {
            const streak = calculateHabitStreak(habit.completedDates, selectedDate);
            const isDoneToday = habit.completedDates.includes(selectedDate);

            return (
              <div
                key={habit.id}
                className="p-4 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-3 sm:gap-2 hover:bg-slate-850/50 transition-colors"
              >
                {/* Habit Info */}
                <div className="sm:col-span-5 flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <h4 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
                        {habit.name}
                        {isDoneToday && (
                          <span className="text-[10px] text-teal-400 font-bold bg-teal-500/15 px-1.5 py-0.5 rounded border border-teal-500/30">
                            Done
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{habit.category}</span>
                        <span>•</span>
                        <span>{habit.targetDaysPerWeek} days/wk</span>
                        {habit.metricTarget && (
                          <>
                            <span>•</span>
                            <span className="text-slate-300">
                              Goal: {habit.metricTarget} {habit.metricUnit}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Mobile delete */}
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="sm:hidden p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete habit"
                    aria-label={`Delete habit ${habit.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Streak Counters */}
                <div className="sm:col-span-2 flex items-center justify-start sm:justify-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-300 font-bold">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                    <span className="mono-number">{streak.currentStreak}d</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-medium text-[11px]" title="Best streak">
                    <Trophy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="mono-number">{streak.bestStreak}d</span>
                  </div>
                </div>

                {/* 7-Day Punch Cards */}
                <div className="sm:col-span-5 flex items-center justify-between sm:justify-end gap-2">
                  <div className="grid grid-cols-7 gap-1.5 flex-1 max-w-sm">
                    {past7Days.map((d) => {
                      const done = habit.completedDates.includes(d.dateStr);
                      return (
                        <button
                          key={d.dateStr}
                          onClick={(e) => handleCellClick(habit, d.dateStr, e)}
                          className={`h-9 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                            done
                              ? 'border-transparent text-slate-950 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                          } ${d.isToday ? 'ring-1 ring-teal-500/50' : ''}`}
                          style={{
                            backgroundColor: done ? habit.color : undefined,
                          }}
                          title={`${habit.name} on ${d.dateStr}: ${done ? 'Completed' : 'Click to toggle'}`}
                          aria-label={`Toggle ${habit.name} for ${d.dateStr}`}
                        >
                          <span className="text-[9px] font-bold sm:hidden opacity-80">{d.dayLabel}</span>
                          <Check className={`w-3.5 h-3.5 stroke-[3] ${done ? 'opacity-100 text-slate-950' : 'opacity-0'}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Desktop delete */}
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="hidden sm:block p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-2"
                    title="Delete habit"
                    aria-label={`Delete habit ${habit.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-400" />
                Create New Habit
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close habit modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 mins, Drink 2L water, Stretch"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-teal-400 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400"
                >
                  {habitCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Weekly Frequency
                </label>
                <div className="flex items-center gap-2">
                  {[3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetDays(num)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        targetDays === num
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {num}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Pick color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
