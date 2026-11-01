import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  X,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { Task } from '../types';
import { formatSeconds, playChime } from '../utils/routineLogic';
import { showNotification } from '../utils/notification';

interface FocusTimerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTimeSpent: (taskId: string, additionalSeconds: number) => void;
  onCompleteTask: (taskId: string) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTimeSpent,
  onCompleteTask,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const accumulatedSecondsRef = useRef(0);

  // Initialize timer whenever task changes
  useEffect(() => {
    if (task) {
      const initialSeconds = (task.durationMinutes || 25) * 60;
      setSecondsRemaining(initialSeconds);
      setTotalSeconds(initialSeconds);
      setStopwatchSeconds(0);
      setIsRunning(false);
      accumulatedSecondsRef.current = 0;
    }
  }, [task]);

  // Main timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        accumulatedSecondsRef.current += 1;

        if (mode === 'countdown') {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              // Timer finished!
              if (soundEnabled) {
                playChime('timer-alarm');
              }
              if (task) {
                showNotification(`Time's Up! Focus Complete: ${task.title}`, {
                  body: `Great focus session! Total time recorded: ${task.durationMinutes} mins.`,
                });
              }
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, soundEnabled, task]);

  // Flush accumulated seconds periodically or on close
  useEffect(() => {
    const flush = () => {
      if (task && accumulatedSecondsRef.current > 0) {
        onUpdateTimeSpent(task.id, accumulatedSecondsRef.current);
        accumulatedSecondsRef.current = 0;
      }
    };

    const flushInterval = setInterval(flush, 5000);
    return () => {
      clearInterval(flushInterval);
      flush();
    };
  }, [task, onUpdateTimeSpent]);

  if (!isOpen || !task) return null;

  const currentDisplaySeconds = mode === 'countdown' ? secondsRemaining : stopwatchSeconds;
  const progressPercent =
    mode === 'countdown'
      ? Math.max(0, Math.min(100, ((totalSeconds - secondsRemaining) / totalSeconds) * 100))
      : 100;

  const handleTogglePlay = () => {
    if (!isRunning && soundEnabled) {
      playChime('start');
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'countdown') {
      setSecondsRemaining(totalSeconds);
    } else {
      setStopwatchSeconds(0);
    }
  };

  const handleSetPresetDuration = (mins: number) => {
    setIsRunning(false);
    setMode('countdown');
    const secs = mins * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
  };

  // Minimized Floating Widget in bottom right
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3 rounded-2xl bg-slate-900/95 border border-teal-500/40 shadow-2xl shadow-teal-950/50 backdrop-blur-md animate-bounce-short">
        <div className="w-10 h-10 relative flex items-center justify-center">
          <svg className="w-10 h-10 -rotate-90 transform">
            <circle
              cx="20"
              cy="20"
              r="16"
              className="text-slate-800"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              className="text-teal-400"
              strokeWidth="3"
              strokeDasharray={100}
              strokeDashoffset={100 - progressPercent}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-teal-300 mono-number">
            {Math.floor(currentDisplaySeconds / 60)}m
          </span>
        </div>

        <div className="max-w-[140px] truncate">
          <p className="text-xs font-bold text-white truncate">{task.title}</p>
          <p className="text-[10px] text-teal-300 mono-number font-semibold">
            {formatSeconds(currentDisplaySeconds)}
          </p>
        </div>

        <button
          onClick={handleTogglePlay}
          className="p-2 rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all font-bold"
          aria-label={isRunning ? 'Pause timer' : 'Resume timer'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={() => setIsMinimized(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          aria-label="Expand timer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Full Overlay View
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0B1325] border border-teal-500/30 shadow-2xl p-6 sm:p-8 text-center">
        {/* Header actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 transition-all"
              title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
              aria-label={soundEnabled ? 'Mute timer sound' : 'Enable timer sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
              title="Minimize to floating widget"
              aria-label="Minimize timer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
              aria-label="Close timer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task badge & title */}
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
            {task.category} Focus
          </span>
          <h2 className="mt-3 text-xl font-bold text-white tracking-tight leading-snug">
            {task.title}
          </h2>
        </div>

        {/* Circular Countdown Progress Ring */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r="105"
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="105"
              className="text-teal-400 transition-all duration-500"
              strokeWidth="8"
              strokeDasharray={660}
              strokeDashoffset={660 - (660 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-extrabold text-white tracking-tight mono-number">
              {formatSeconds(currentDisplaySeconds)}
            </span>
            <span className="mt-1 text-xs text-slate-400 font-medium tracking-wider uppercase">
              {mode === 'countdown' ? (isRunning ? 'In Flow' : 'Paused') : 'Elapsed'}
            </span>
          </div>
        </div>

        {/* Mode presets */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSetPresetDuration(mins)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'countdown' && totalSeconds === mins * 60
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {mins}m
            </button>
          ))}
          <button
            onClick={() => {
              setIsRunning(false);
              setMode(mode === 'countdown' ? 'stopwatch' : 'countdown');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === 'stopwatch'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Stopwatch
          </button>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-bold text-lg shadow-xl shadow-teal-500/30 transition-all active:scale-95 flex items-center gap-2"
            aria-label={isRunning ? 'Pause focus timer' : 'Start focus timer'}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                <span>Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onCompleteTask(task.id);
              onClose();
            }}
            className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-all active:scale-95"
            title="Mark Task Complete & Close"
            aria-label="Mark task complete and finish timer"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
