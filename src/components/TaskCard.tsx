import React, { useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Clock,
  Play,
  MoreVertical,
  Plus,
  Minus,
  Sparkles,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { formatDuration, playChime } from '../utils/routineLogic';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onUpdateMetric: (taskId: string, newCurrent: number) => void;
  onStartTimer: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const categoryColors: Record<TaskCategory, { badge: string; border: string; glow: string }> = {
  Wellness: {
    badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    border: 'border-l-teal-500',
    glow: 'group-hover:border-teal-500/50',
  },
  Work: {
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    border: 'border-l-blue-500',
    glow: 'group-hover:border-blue-500/50',
  },
  Fitness: {
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    border: 'border-l-emerald-500',
    glow: 'group-hover:border-emerald-500/50',
  },
  Learning: {
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    border: 'border-l-purple-500',
    glow: 'group-hover:border-purple-500/50',
  },
  Personal: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    border: 'border-l-amber-500',
    glow: 'group-hover:border-amber-500/50',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onUpdateMetric,
  onStartTimer,
  onEditTask,
  onDeleteTask,
}) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeCompleted = !task.completed;

    if (willBeCompleted) {
      playChime('complete');
      // Confetti burst from button position
      const rect = checkboxRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 38,
          spread: 60,
          origin: { x, y },
          colors: ['#2DD4BF', '#14B8A6', '#38BDF8', '#F59E0B', '#10B981'],
          disableForReducedMotion: true,
        });
      }
    }
    onToggleComplete(task.id);
  };

  const styleTheme = categoryColors[task.category] || categoryColors.Wellness;

  return (
    <div
      className={`group relative rounded-2xl bg-slate-900/80 border transition-all duration-200 border-l-4 ${styleTheme.border} ${
        task.completed
          ? 'border-slate-800/50 bg-slate-900/40 opacity-75'
          : `border-slate-800/80 ${styleTheme.glow} hover:bg-slate-900/95 hover:shadow-lg hover:shadow-teal-950/20`
      } p-4 sm:p-5`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Satisfying Checkbox with Bounce Animation */}
        <button
          ref={checkboxRef}
          onClick={handleCheckboxClick}
          className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-200 active:scale-90 ${
            task.completed
              ? 'bg-gradient-to-tr from-teal-500 to-cyan-400 border-transparent text-slate-950 shadow-md shadow-teal-500/30'
              : 'border-slate-700 bg-slate-800/60 text-transparent hover:border-teal-400 hover:bg-teal-500/10'
          }`}
          aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
        >
          <Check className={`w-4 h-4 stroke-[3] transition-transform duration-200 ${task.completed ? 'scale-100' : 'scale-0'}`} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${styleTheme.badge}`}
            >
              {task.category}
            </span>

            {task.time && (
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="mono-number">{task.time}</span>
              </span>
            )}

            <span className="text-xs text-slate-400 font-medium">
              ({formatDuration(task.durationMinutes)})
            </span>

            {task.priority === 'high' && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                High Priority
              </span>
            )}
          </div>

          <h3
            className={`font-semibold text-base sm:text-lg leading-snug transition-all ${
              task.completed ? 'line-through text-slate-400' : 'text-slate-100'
            }`}
          >
            {task.title}
          </h3>

          {task.notes && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 flex items-start gap-1">
              <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
              <span>{task.notes}</span>
            </p>
          )}

          {/* Quantitative Metric Logger */}
          {task.metric && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  {task.metric.label}
                </span>
                <span className="mono-number font-bold text-slate-200">
                  <span className={task.metric.current >= task.metric.target ? 'text-teal-400 font-bold' : 'text-slate-200'}>
                    {task.metric.current}
                  </span>
                  <span className="text-slate-400 font-normal"> / {task.metric.target} {task.metric.unit}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((task.metric.current / task.metric.target) * 100))}%`,
                  }}
                />
              </div>

              {/* Stepper controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateMetric(task.id, Math.max(0, task.metric!.current - 1))}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all"
                    aria-label={`Decrease ${task.metric.label}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateMetric(task.id, task.metric!.current + 1)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all"
                    aria-label={`Increase ${task.metric.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 5].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => onUpdateMetric(task.id, task.metric!.current + amt)}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 active:scale-95 transition-all"
                    >
                      +{amt}
                    </button>
                  ))}
                  {task.metric.current < task.metric.target && (
                    <button
                      onClick={() => onUpdateMetric(task.id, task.metric!.target)}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-300 transition-all"
                    >
                      Fill
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1">
          {/* Start focus timer button */}
          <button
            onClick={() => onStartTimer(task)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-semibold active:scale-95 transition-all"
            title="Start Focus Timer for this task"
            aria-label={`Start Focus Timer for "${task.title}"`}
          >
            <Play className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
            <span className="hidden sm:inline">Timer</span>
          </button>

          {/* Options Dropdown menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
              aria-label={`Options for ${task.title}`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-40 w-36 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 text-xs">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditTask(task);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Task
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDeleteTask(task.id);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
