import { Task, Habit, DayActivity } from '../types';

/**
 * Returns formatted YYYY-MM-DD string for a given date
 */
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats minutes into concise human readable text like '45m' or '1h 30m'
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

/**
 * Formats seconds into mm:ss or hh:mm:ss
 */
export function formatSeconds(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates current streak and best streak for a habit from its completed dates.
 */
export function calculateHabitStreak(
  completedDates: string[],
  referenceDateStr?: string
): { currentStreak: number; bestStreak: number } {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Deduplicate and sort descending
  const uniqueSorted = Array.from(new Set(completedDates)).sort().reverse();
  const todayStr = referenceDateStr || formatDateKey(new Date());

  // Determine current streak
  let currentStreak = 0;
  const refDate = new Date(`${todayStr}T00:00:00`);

  // Check if today or yesterday is completed to maintain active streak
  const yesterday = new Date(refDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateKey(yesterday);

  let checkDate = refDate;
  if (!uniqueSorted.includes(todayStr) && uniqueSorted.includes(yesterdayStr)) {
    // Yesterday was completed, streak is still active
    checkDate = yesterday;
  }

  while (true) {
    const key = formatDateKey(checkDate);
    if (uniqueSorted.includes(key)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate best all-time streak
  const ascending = Array.from(new Set(completedDates)).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const dStr of ascending) {
    const currDate = new Date(`${dStr}T00:00:00`);
    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const diffMs = currDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
    lastDate = currDate;
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}

/**
 * Calculates overall productivity score for a specific date (0 to 100).
 */
export function calculateProductivityScore(
  tasks: Task[],
  habits: Habit[],
  dateStr: string
): number {
  const dayTasks = tasks.filter((t) => t.date === dateStr);
  let taskComponent = 0;
  let metricComponent = 0;

  if (dayTasks.length > 0) {
    const completedCount = dayTasks.filter((t) => t.completed).length;
    taskComponent = (completedCount / dayTasks.length) * 50; // up to 50 pts

    // Metric contribution (up to 25 pts)
    const metricTasks = dayTasks.filter((t) => t.metric && t.metric.target > 0);
    if (metricTasks.length > 0) {
      const metricSum = metricTasks.reduce((acc, t) => {
        const m = t.metric!;
        const ratio = Math.min(1, Math.max(0, m.current / m.target));
        return acc + ratio;
      }, 0);
      metricComponent = (metricSum / metricTasks.length) * 25;
    } else {
      // If no tasks have numeric metrics, assign metricComponent proportional to completed tasks
      metricComponent = (completedCount / dayTasks.length) * 25;
    }
  }

  // Habit component (up to 25 pts)
  let habitComponent = 0;
  if (habits.length > 0) {
    const habitsCompletedToday = habits.filter((h) =>
      h.completedDates.includes(dateStr)
    ).length;
    habitComponent = (habitsCompletedToday / habits.length) * 25;
  }

  // If there are no tasks and no habits configured, return 0
  if (dayTasks.length === 0 && habits.length === 0) {
    return 0;
  }

  return Math.round(taskComponent + metricComponent + habitComponent);
}

/**
 * Calculates overall user streak across all days where at least 1 task or habit was finished
 */
export function calculateOverallStreak(
  tasks: Task[],
  habits: Habit[],
  referenceDateStr?: string
): number {
  const activeDates = new Set<string>();

  tasks.forEach((t) => {
    if (t.completed && t.date) {
      activeDates.add(t.date);
    }
  });

  habits.forEach((h) => {
    h.completedDates.forEach((d) => activeDates.add(d));
  });

  const streakInfo = calculateHabitStreak(Array.from(activeDates), referenceDateStr);
  return streakInfo.currentStreak;
}

/**
 * Generates past 7 days activity breakdown for weekly analytics
 */
export function getWeeklyActivitySummary(
  tasks: Task[],
  habits: Habit[],
  referenceDateStr?: string
): DayActivity[] {
  const today = referenceDateStr ? new Date(`${referenceDateStr}T00:00:00`) : new Date();
  const days: DayActivity[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);

    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const completedTasks = dayTasks.filter((t) => t.completed).length;
    const totalTasks = dayTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalMinutes = dayTasks.reduce(
      (acc, t) => acc + (t.completed ? t.durationMinutes : Math.floor(t.timeSpentSeconds / 60)),
      0
    );

    const habitsDone = habits.filter((h) => h.completedDates.includes(dateStr)).length;
    const habitRate = habits.length > 0 ? Math.round((habitsDone / habits.length) * 100) : 0;

    const score = calculateProductivityScore(tasks, habits, dateStr);

    days.push({
      date: dateStr,
      dayLabel: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      isToday: i === 0,
      totalTasks,
      completedTasks,
      completionRate,
      totalMinutes,
      habitCompletionRate: habitRate,
      productivityScore: score,
    });
  }

  return days;
}

/**
 * Sound synthesis helper using standard Web Audio API
 * Produces crisp, calming audio feedback without external audio files
 */
export function playChime(type: 'complete' | 'timer-tick' | 'timer-alarm' | 'start') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'complete') {
      // Pleasant major chord chime (C5 -> E5 -> G5)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
      });
    } else if (type === 'timer-alarm') {
      // Calming triple chime for timer completion
      [659.25, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.15 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.75);
      });
    } else if (type === 'start') {
      // Short upward blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.16);
    }
  } catch (e) {
    // Graceful fallback for audio contexts
    console.debug('Audio chime unable to play:', e);
  }
}
