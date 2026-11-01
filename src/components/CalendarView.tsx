import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { Task } from '../types';
import { formatDateKey, formatDuration } from '../utils/routineLogic';

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onOpenNewTaskModalForDate: (dateStr: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onOpenNewTaskModalForDate,
  onToggleComplete,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    return new Date(`${selectedDate}T00:00:00`);
  });

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // First day of month (0 = Sun, 1 = Mon, etc.)
  const firstDay = new Date(year, month, 1).getDay();
  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleJumpToday = () => {
    const today = new Date();
    setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(formatDateKey(today));
  };

  // Selected day's tasks
  const selectedDayTasks = tasks.filter((t) => t.date === selectedDate);
  const selectedDayDateObj = new Date(`${selectedDate}T00:00:00`);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Calendar Grid (8 cols) */}
      <div className="lg:col-span-7 xl:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-slate-400">Select any day to inspect routines</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleJumpToday}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all mr-1"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for leading padding */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-slate-950/20 border border-transparent" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const todayStr = formatDateKey(new Date());
            const isToday = dateStr === todayStr;

            const dayTasks = tasks.filter((t) => t.date === dateStr);
            const completedCount = dayTasks.filter((t) => t.completed).length;

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all group relative ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-500 shadow-md shadow-teal-500/20 ring-1 ring-teal-400'
                    : isToday
                    ? 'bg-slate-800/80 border-slate-700 hover:border-teal-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
                aria-label={`View tasks for ${dateStr}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold mono-number rounded-md px-1.5 py-0.5 ${
                      isToday
                        ? 'bg-teal-400 text-slate-950'
                        : isSelected
                        ? 'text-teal-300 font-extrabold'
                        : 'text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {completedCount}/{dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Dots indicator */}
                <div className="flex items-center gap-1 overflow-hidden">
                  {dayTasks.slice(0, 4).map((t) => (
                    <span
                      key={t.id}
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.completed ? 'bg-teal-400' : 'bg-slate-500'
                      }`}
                      title={`${t.title} (${t.completed ? 'Done' : 'Pending'})`}
                    />
                  ))}
                  {dayTasks.length > 4 && (
                    <span className="text-[9px] text-slate-500">+{dayTasks.length - 4}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Schedule Pane (4-5 cols) */}
      <div className="lg:col-span-5 xl:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                Selected Day Schedule
              </p>
              <h4 className="text-lg font-bold text-white">
                {selectedDayDateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h4>
            </div>

            <button
              onClick={() => onOpenNewTaskModalForDate(selectedDate)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              Add
            </button>
          </div>

          {selectedDayTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CalendarIcon className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
              <p className="text-sm font-medium">No routine tasks scheduled</p>
              <p className="text-xs text-slate-500 mt-1">Plan ahead or take a mindful rest day.</p>
              <button
                onClick={() => onOpenNewTaskModalForDate(selectedDate)}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Schedule Task for This Date
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {selectedDayTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    t.completed
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-75'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleComplete(t.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                        t.completed
                          ? 'bg-teal-500 border-teal-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                      aria-label={t.completed ? `Mark ${t.title} incomplete` : `Mark ${t.title} complete`}
                    >
                      {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0 truncate">
                      <p className={`text-xs font-semibold truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="mono-number">{t.time}</span>
                        <span>•</span>
                        <span>{formatDuration(t.durationMinutes)}</span>
                        <span>•</span>
                        <span>{t.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
