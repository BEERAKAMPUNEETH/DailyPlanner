import { Task } from '../types';
import { playChime } from './routineLogic';

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const res = await Notification.requestPermission();
    return res as NotificationPermissionState;
  } catch (e) {
    console.debug('Notification permission error:', e);
    return 'denied';
  }
}

export function showNotification(title: string, options?: NotificationOptions) {
  playChime('start');

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (e) {
      console.debug('Failed to display native notification:', e);
    }
  }
}

const notifiedTaskIds = new Set<string>();

/**
 * Checks for tasks starting within the next 5 minutes for the current date
 */
export function checkUpcomingTaskReminders(tasks: Task[], onAlert?: (task: Task) => void) {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeTotalMins = currentHours * 60 + currentMinutes;

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  tasks.forEach((task) => {
    if (task.completed || task.date !== todayStr || !task.time) return;

    const [tHourStr, tMinStr] = task.time.split(':');
    const taskHours = parseInt(tHourStr, 10);
    const taskMins = parseInt(tMinStr, 10);
    if (isNaN(taskHours) || isNaN(taskMins)) return;

    const taskTimeTotalMins = taskHours * 60 + taskMins;
    const diffMins = taskTimeTotalMins - currentTimeTotalMins;

    // Trigger alert if task starts in 5 minutes (between 0 and 5 minutes away)
    if (diffMins >= 0 && diffMins <= 5) {
      const key = `${task.id}-${todayStr}-${task.time}`;
      if (!notifiedTaskIds.has(key)) {
        notifiedTaskIds.add(key);
        showNotification(`Upcoming Task: ${task.title}`, {
          body: `Scheduled to start at ${task.time} (${task.durationMinutes} mins)`,
        });
        if (onAlert) {
          onAlert(task);
        }
      }
    }
  });
}
