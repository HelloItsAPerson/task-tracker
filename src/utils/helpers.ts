import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import { Task, TaskStats } from '../types';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getStorageKey = (key: string): string => {
  return `taskflow_${key}`;
};

export const formatDate = (date: string | undefined): string => {
  if (!date) return 'No due date';
  return dayjs(date).format('MMM DD, YYYY');
};

export const formatDateShort = (date: string | undefined): string => {
  if (!date) return 'N/A';
  return dayjs(date).format('MMM DD');
};

export const formatRelativeDate = (date: string | undefined): string => {
  if (!date) return 'No due date';
  return dayjs(date).fromNow();
};

export const isOverdue = (dueDate: string | undefined): boolean => {
  if (!dueDate) return false;
  return dayjs(dueDate).isBefore(dayjs(), 'day') && dayjs(dueDate).isToday() === false;
};

export const isDueToday = (dueDate: string | undefined): boolean => {
  if (!dueDate) return false;
  return dayjs(dueDate).isToday();
};

export const isDueSoon = (dueDate: string | undefined): boolean => {
  if (!dueDate) return false;
  const date = dayjs(dueDate);
  return date.isBetween(dayjs(), dayjs().add(3, 'days'), null, '[]');
};

export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const calculateStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(
    (t) => !t.completed && t.dueDate && isOverdue(t.dueDate)
  ).length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 dark:text-red-400';
    case 'medium':
      return 'text-amber-600 dark:text-amber-400';
    case 'low':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-slate-600 dark:text-slate-400';
  }
};

export const getPriorityCategoryColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  }
};
