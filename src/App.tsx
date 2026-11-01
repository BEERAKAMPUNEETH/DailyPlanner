/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Sunset,
  Moon,
  Flame,
  Award,
} from 'lucide-react';
import { Task, Habit, TaskCategory } from './types';
import { getInitialSeedData } from './data/seedData';
import {
  formatDateKey,
  calculateProductivityScore,
  calculateOverallStreak,
  formatDuration,
} from './utils/routineLogic';
import {
  getNotificationPermission,
  requestNotificationPermission,
  checkUpcomingTaskReminders,
  NotificationPermissionState,
} from './utils/notification';
import { Navbar } from './components/Navbar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { FocusTimer } from './components/FocusTimer';
import { HabitTracker } from './components/HabitTracker';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { LandingHero } from './components/LandingHero';

const STORAGE_KEY_TASKS = 'auraroutine_tasks_v1';
const STORAGE_KEY_HABITS = 'auraroutine_habits_v1';

export default function App() {
  // Check URL query parameters: ?autostart=1 or ?landing=1
  const initialViewParam = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('landing') === '1'
      ? 'landing'
      : 'planner'
    : 'planner';

  const [currentView, setCurrentView] = useState<'planner' | 'habits' | 'calendar' | 'analytics' | 'landing'>(
    initialViewParam
  );

  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()));
  const [categoryFilter, setCategoryFilter] = useState<'all' | TaskCategory>('all');
  const [timeBlockFilter, setTimeBlockFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Modals & Timers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTimerTask, setActiveTimerTask] = useState<Task | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  // Notification state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermissionState>(
    getNotificationPermission()
  );

  // Tasks & Habits State with LocalStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TASKS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.debug('Failed to load tasks from localStorage', e);
    }
    return getInitialSeedData().tasks;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HABITS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.debug('Failed to load habits from localStorage', e);
    }
    return getInitialSeedData().habits;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.debug('Failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (e) {
      console.debug('Failed to save habits', e);
    }
  }, [habits]);

  // Periodic reminder checking (runs every 30 seconds)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      checkUpcomingTaskReminders(tasks);
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [tasks]);

  const handleRequestNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
  };

  // Calculations
  const todayStr = useMemo(() => formatDateKey(new Date()), []);
  const productivityScore = useMemo(
    () => calculateProductivityScore(tasks, habits, selectedDate),
    [tasks, habits, selectedDate]
  );
  const overallStreak = useMemo(
    () => calculateOverallStreak(tasks, habits, todayStr),
    [tasks, habits, todayStr]
  );

  // Filtered tasks for the selected date
  const selectedDateTasks = useMemo(() => {
    return tasks
      .filter((t) => t.date === selectedDate)
      .filter((t) => (categoryFilter === 'all' ? true : t.category === categoryFilter))
      .filter((t) => {
        if (timeBlockFilter === 'all') return true;
        const [hour] = t.time.split(':').map(Number);
        if (timeBlockFilter === 'morning') return hour < 12;
        if (timeBlockFilter === 'afternoon') return hour >= 12 && hour < 17;
        if (timeBlockFilter === 'evening') return hour >= 17;
        return true;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [tasks, selectedDate, categoryFilter, timeBlockFilter]);

  const completedCount = useMemo(
    () => selectedDateTasks.filter((t) => t.completed).length,
    [selectedDateTasks]
  );

  // Handlers
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateMetric = (taskId: string, newCurrent: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.metric) {
          return {
            ...t,
            metric: {
              ...t.metric,
              current: newCurrent,
            },
            // Auto complete if target reached
            completed: newCurrent >= t.metric.target ? true : t.completed,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTimeSpent = (taskId: string, additionalSeconds: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            timeSpentSeconds: (t.timeSpentSeconds || 0) + additionalSeconds,
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'completed' | 'timeSpentSeconds'> & { id?: string }
  ) => {
    if (taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                timeSpentSeconds: t.timeSpentSeconds,
                completed: t.completed,
              }
            : t
        )
      );
    } else {
      // Create new
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        completed: false,
        timeSpentSeconds: 0,
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTimerTask?.id === taskId) {
      setIsTimerOpen(false);
      setActiveTimerTask(null);
    }
  };

  const handleStartTimer = (task: Task) => {
    setActiveTimerTask(task);
    setIsTimerOpen(true);
  };

  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const hasDate = h.completedDates.includes(dateStr);
          return {
            ...h,
            completedDates: hasDate
              ? h.completedDates.filter((d) => d !== dateStr)
              : [...h.completedDates, dateStr],
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const handleResetToDemo = () => {
    const seed = getInitialSeedData();
    setTasks(seed.tasks);
    setHabits(seed.habits);
    setSelectedDate(formatDateKey(new Date()));
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ tasks, habits }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auraroutine-backup-${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.tasks) && Array.isArray(parsed.habits)) {
          setTasks(parsed.tasks);
          setHabits(parsed.habits);
        }
      } catch (err) {
        console.error('Failed to import JSON', err);
      }
    };
    reader.readAsText(file);
  };

  // Date Nav helpers
  const handleShiftDate = (days: number) => {
    const curr = new Date(`${selectedDate}T00:00:00`);
    curr.setDate(curr.getDate() + days);
    setSelectedDate(formatDateKey(curr));
  };

  const isTodaySelected = selectedDate === todayStr;

  return (
    <div className="min-h-screen bg-[#0B1325] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenNewTaskModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        streakCount={overallStreak}
        productivityScore={productivityScore}
        notificationPermission={notificationPermission}
        onRequestNotifications={handleRequestNotifications}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: LANDING HERO */}
        {currentView === 'landing' && (
          <LandingHero
            onStartPlanning={() => setCurrentView('planner')}
            streakCount={overallStreak}
            productivityScore={productivityScore}
          />
        )}

        {/* VIEW 2: DAILY ROUTINE PLANNER */}
        {currentView === 'planner' && (
          <div className="space-y-6">
            {/* Header: Date Navigator & Quick Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
              {/* Date Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShiftDate(-1)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
                  aria-label="Previous day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  <CalendarIcon className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-white text-sm sm:text-base">
                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {isTodaySelected && (
                    <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded-md border border-teal-500/30">
                      Today
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleShiftDate(1)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
                  aria-label="Next day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {!isTodaySelected && (
                  <button
                    onClick={() => setSelectedDate(todayStr)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 transition-all"
                  >
                    Jump to Today
                  </button>
                )}
              </div>

              {/* Day Progress Summary Bar */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">
                    <span className="font-bold text-white mono-number">{completedCount}</span> of{' '}
                    <span className="font-bold text-white mono-number">{selectedDateTasks.length}</span>{' '}
                    completed
                  </p>
                  <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          selectedDateTasks.length > 0
                            ? Math.round((completedCount / selectedDateTasks.length) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                  aria-label="Add Routine Task"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Time Blocks & Category Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Time Blocks */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setTimeBlockFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    timeBlockFilter === 'all'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Day
                </button>
                <button
                  onClick={() => setTimeBlockFilter('morning')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    timeBlockFilter === 'morning'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-400" />
                  Morning
                </button>
                <button
                  onClick={() => setTimeBlockFilter('afternoon')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    timeBlockFilter === 'afternoon'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sunset className="w-3 h-3 text-cyan-400" />
                  Afternoon
                </button>
                <button
                  onClick={() => setTimeBlockFilter('evening')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    timeBlockFilter === 'evening'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3 text-indigo-400" />
                  Evening
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] text-slate-500 uppercase font-bold flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" />
                </span>
                {(['all', 'Wellness', 'Work', 'Fitness', 'Learning', 'Personal'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? 'bg-slate-800 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Cards List */}
            {selectedDateTasks.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
                <Clock className="w-12 h-12 mx-auto text-slate-600 mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-white">No tasks scheduled for this block</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  Add your morning routines, deep work focus blocks, or hydration and fitness goals.
                </p>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add First Task</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {selectedDateTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onUpdateMetric={handleUpdateMetric}
                    onStartTimer={handleStartTimer}
                    onEditTask={(t) => {
                      setEditingTask(t);
                      setIsTaskModalOpen(true);
                    }}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            )}

            {/* Bottom Utilities Toolbar */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>Data stored locally in your browser</span>
                <span>•</span>
                <button
                  onClick={handleResetToDemo}
                  className="text-slate-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Demo Routines
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1 text-slate-400 hover:text-teal-300 transition-colors"
                  title="Export tasks & habits as JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Data
                </button>

                <label className="flex items-center gap-1 text-slate-400 hover:text-teal-300 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Data</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: HABIT TRACKER */}
        {currentView === 'habits' && (
          <HabitTracker
            habits={habits}
            onToggleHabitDay={handleToggleHabitDay}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            selectedDate={selectedDate}
          />
        )}

        {/* VIEW 4: VISUAL CALENDAR */}
        {currentView === 'calendar' && (
          <CalendarView
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={(newDate) => {
              setSelectedDate(newDate);
            }}
            onOpenNewTaskModalForDate={(dateForTask) => {
              setSelectedDate(dateForTask);
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {/* VIEW 5: DASHBOARD & ANALYTICS */}
        {currentView === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            habits={habits}
            selectedDate={selectedDate}
          />
        )}
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
        defaultDate={selectedDate}
      />

      {/* Built-in Focus Timer Overlay / Widget */}
      <FocusTimer
        task={activeTimerTask}
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onUpdateTimeSpent={handleUpdateTimeSpent}
        onCompleteTask={(taskId) => {
          handleToggleComplete(taskId);
        }}
      />
    </div>
  );
}
