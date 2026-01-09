import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export const categories = {
  'system-design': {
    name: 'System Design',
    icon: '🏗️',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  'dsa': {
    name: 'DSA',
    icon: '🧮',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  'linkedin': {
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  'interviews': {
    name: 'Interviews',
    icon: '🎯',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
  'startup-hiring': {
    name: 'Startup Hiring',
    icon: '🚀',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
} as const;