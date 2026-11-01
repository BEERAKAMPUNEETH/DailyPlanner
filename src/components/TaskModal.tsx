import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Calendar, Check } from 'lucide-react';
import { Task, TaskCategory } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'completed' | 'timeSpentSeconds'> & { id?: string }) => void;
  initialTask?: Task | null;
  defaultDate: string;
}

const categories: TaskCategory[] = ['Wellness', 'Work', 'Fitness', 'Learning', 'Personal'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Wellness');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  // Quantitative Metric
  const [hasMetric, setHasMetric] = useState(false);
  const [metricLabel, setMetricLabel] = useState('Target');
  const [metricTarget, setMetricTarget] = useState(10);
  const [metricUnit, setMetricUnit] = useState('units');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCategory(initialTask.category);
      setDate(initialTask.date);
      setTime(initialTask.time);
      setDurationMinutes(initialTask.durationMinutes);
      setPriority(initialTask.priority);
      setNotes(initialTask.notes || '');
      if (initialTask.metric) {
        setHasMetric(true);
        setMetricLabel(initialTask.metric.label);
        setMetricTarget(initialTask.metric.target);
        setMetricUnit(initialTask.metric.unit);
      } else {
        setHasMetric(false);
      }
    } else {
      setTitle('');
      setCategory('Wellness');
      setDate(defaultDate);
      setTime('09:00');
      setDurationMinutes(30);
      setPriority('medium');
      setNotes('');
      setHasMetric(false);
      setMetricLabel('Target Quantity');
      setMetricTarget(10);
      setMetricUnit('units');
    }
  }, [initialTask, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: initialTask?.id,
      title: title.trim(),
      category,
      date,
      time,
      durationMinutes,
      priority,
      notes: notes.trim() || undefined,
      metric: hasMetric
        ? {
            label: metricLabel.trim() || 'Work Done',
            current: initialTask?.metric?.current || 0,
            target: Number(metricTarget) || 1,
            unit: metricUnit.trim() || 'units',
          }
        : undefined,
    });
    onClose();
  };

  const presetMetrics = [
    { label: 'Hydration', target: 8, unit: 'glasses' },
    { label: 'Reading', target: 20, unit: 'pages' },
    { label: 'Running / Walking', target: 5, unit: 'km' },
    { label: 'Deep Focus Blocks', target: 4, unit: 'pomodoros' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            {initialTask ? 'Edit Routine Task' : 'Add New Daily Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Task Title */}
          <div>
            <label htmlFor="task-title-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Task Name *
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              placeholder="e.g. 5km Morning Run, Deep Work Session, Read Non-fiction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
              autoFocus
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    category === cat
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Time, Duration & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="task-time-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Scheduled Time
              </label>
              <div className="relative">
                <input
                  id="task-time-input"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:border-teal-400 text-sm mono-number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="task-duration-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Duration (mins)
              </label>
              <select
                id="task-duration-select"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:border-teal-400 text-sm"
              >
                <option value={15}>15 mins</option>
                <option value={20}>20 mins</option>
                <option value={25}>25 mins (Pomodoro)</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1 hr)</option>
                <option value={90}>90 mins (1.5 hrs)</option>
                <option value={120}>120 mins (2 hrs)</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Priority
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:border-teal-400 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="task-date-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Date
            </label>
            <input
              id="task-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:border-teal-400 text-sm mono-number"
            />
          </div>

          {/* Quantitative Metric Logger Accordion */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                <input
                  type="checkbox"
                  checked={hasMetric}
                  onChange={(e) => setHasMetric(e.target.checked)}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400"
                />
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Track Quantity / Measure Progress (Pages, km, glasses, etc.)
              </label>
            </div>

            {hasMetric && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {presetMetrics.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setMetricLabel(p.label);
                        setMetricTarget(p.target);
                        setMetricUnit(p.unit);
                      }}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 transition-all border border-slate-700/60"
                    >
                      {p.label} ({p.target} {p.unit})
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-slate-400 mb-1">Metric Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Pages Read"
                      value={metricLabel}
                      onChange={(e) => setMetricLabel(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Target Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={metricTarget}
                      onChange={(e) => setMetricTarget(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white mono-number"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Unit of Measure</label>
                    <input
                      type="text"
                      placeholder="e.g. pages, km, reps"
                      value={metricUnit}
                      onChange={(e) => setMetricUnit(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="task-notes-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              id="task-notes-input"
              rows={2}
              placeholder="Any details, cues, or intention for this routine item..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            >
              {initialTask ? 'Save Changes' : 'Add to Routine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
