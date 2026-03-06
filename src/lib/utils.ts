import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string | Date | undefined | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMins < 60) {
    return `${Math.max(0, diffInMins)}m ago`;
  }

  if (now.toDateString() === date.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // You can extend this for older dates if needed (e.g. yesterday, or dd/mm/yyyy)
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
