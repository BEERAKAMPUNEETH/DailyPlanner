import React from 'react';
import {
  Flame,
  CheckCircle2,
  Bell,
  BellOff,
  Plus,
  Compass,
  Calendar as CalendarIcon,
  BarChart3,
  ListTodo,
  Sparkles,
} from 'lucide-react';
import { NotificationPermissionState } from '../utils/notification';

interface NavbarProps {
  currentView: 'planner' | 'habits' | 'calendar' | 'analytics' | 'landing';
  onViewChange: (view: 'planner' | 'habits' | 'calendar' | 'analytics' | 'landing') => void;
  onOpenNewTaskModal: () => void;
  streakCount: number;
  productivityScore: number;
  notificationPermission: NotificationPermissionState;
  onRequestNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenNewTaskModal,
  streakCount,
  productivityScore,
  notificationPermission,
  onRequestNotifications,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B1325]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-2.5 text-left group transition-all"
            aria-label="Go to AuraRoutine Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                Aura<span className="text-teal-400">Routine</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                Flow & Habits
              </span>
            </div>
          </button>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center ml-6 p-1 bg-slate-900/80 border border-slate-800/80 rounded-xl">
            <button
              onClick={() => onViewChange('planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'planner'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              aria-label="Daily Routine Planner View"
            >
              <ListTodo className="w-3.5 h-3.5" />
              Daily Routine
            </button>
            <button
              onClick={() => onViewChange('habits')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'habits'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              aria-label="Habit Tracker View"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Habits
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'calendar'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              aria-label="Calendar View"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'analytics'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              aria-label="Analytics & Score View"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
            <button
              onClick={() => onViewChange('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'landing'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              aria-label="Overview Landing Page"
            >
              <Compass className="w-3.5 h-3.5" />
              Overview
            </button>
          </nav>
        </div>

        {/* Right side stats & actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Streak pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
            title={`${streakCount} day streak! Keep it going!`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40 animate-pulse" />
            <span className="mono-number">{streakCount}</span>
            <span className="hidden sm:inline text-amber-200/80 font-normal">days</span>
          </div>

          {/* Productivity Score badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold"
            title="Today's Productivity Score"
          >
            <span className="text-[10px] uppercase tracking-wider text-teal-400/80 font-bold">Score</span>
            <span className="mono-number font-bold text-teal-200">{productivityScore}%</span>
          </div>

          {/* Notifications toggle */}
          <button
            onClick={onRequestNotifications}
            className={`p-2 rounded-lg border text-xs transition-all relative ${
              notificationPermission === 'granted'
                ? 'bg-slate-800/70 border-slate-700/80 text-teal-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={
              notificationPermission === 'granted'
                ? 'Browser notifications active for task alerts'
                : 'Enable browser notifications for upcoming tasks & timers'
            }
            aria-label={
              notificationPermission === 'granted'
                ? 'Browser notifications enabled'
                : 'Enable browser notifications'
            }
          >
            {notificationPermission === 'granted' ? (
              <>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              </>
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </button>

          {/* Quick Add Task button */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            aria-label="Add New Task"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 bg-[#0B1325] px-2 py-1.5 text-xs">
        <button
          onClick={() => onViewChange('planner')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg ${
            currentView === 'planner' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
          aria-label="Mobile Planner"
        >
          <ListTodo className="w-4 h-4" />
          <span>Routine</span>
        </button>
        <button
          onClick={() => onViewChange('habits')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg ${
            currentView === 'habits' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
          aria-label="Mobile Habits"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Habits</span>
        </button>
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg ${
            currentView === 'calendar' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
          aria-label="Mobile Calendar"
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Calendar</span>
        </button>
        <button
          onClick={() => onViewChange('analytics')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg ${
            currentView === 'analytics' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
          aria-label="Mobile Analytics"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => onViewChange('landing')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg ${
            currentView === 'landing' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
          aria-label="Mobile Overview"
        >
          <Compass className="w-4 h-4" />
          <span>Overview</span>
        </button>
      </div>
    </header>
  );
};
