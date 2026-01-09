import { TimeRemaining, Countdown } from './types';

export function calculateTimeRemaining(targetDate: string, targetTime?: string): TimeRemaining {
  const now = new Date();
  
  // Combine date and time
  let target: Date;
  if (targetTime) {
    target = new Date(`${targetDate}T${targetTime}:00`);
  } else {
    target = new Date(`${targetDate}T23:59:59`);
  }
  
  const diff = target.getTime() - now.getTime();
  const isPast = diff < 0;
  
  const absDiff = Math.abs(diff);
  
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds,
    isPast,
  };
}

export function formatTimeRemaining(time: TimeRemaining): string {
  if (time.isPast) {
    return 'Past';
  }
  
  const parts: string[] = [];
  
  if (time.days > 0) {
    parts.push(`${time.days}d`);
  }
  if (time.hours > 0 || time.days > 0) {
    parts.push(`${time.hours}h`);
  }
  if (time.minutes > 0 || time.hours > 0 || time.days > 0) {
    parts.push(`${time.minutes}m`);
  }
  parts.push(`${time.seconds}s`);
  
  return parts.join(' ');
}

export function getRelativeTimeString(time: TimeRemaining): string {
  if (time.isPast) {
    return 'This date has passed';
  }
  
  if (time.days === 0 && time.hours === 0 && time.minutes === 0) {
    return 'Less than a minute!';
  }
  
  if (time.days === 0 && time.hours === 0) {
    return `${time.minutes} minute${time.minutes !== 1 ? 's' : ''} remaining`;
  }
  
  if (time.days === 0) {
    return `${time.hours} hour${time.hours !== 1 ? 's' : ''} remaining`;
  }
  
  if (time.days === 1) {
    return 'Tomorrow!';
  }
  
  if (time.days < 7) {
    return `${time.days} days remaining`;
  }
  
  const weeks = Math.floor(time.days / 7);
  if (weeks === 1) {
    return '1 week remaining';
  }
  
  if (time.days < 30) {
    return `${weeks} weeks remaining`;
  }
  
  const months = Math.floor(time.days / 30);
  if (months === 1) {
    return '1 month remaining';
  }
  
  return `${months} months remaining`;
}

export function sortCountdowns(countdowns: Countdown[]): Countdown[] {
  return [...countdowns].sort((a, b) => {
    const timeA = calculateTimeRemaining(a.targetDate, a.targetTime);
    const timeB = calculateTimeRemaining(b.targetDate, b.targetTime);
    
    // Past dates go to bottom
    if (timeA.isPast && !timeB.isPast) return 1;
    if (!timeA.isPast && timeB.isPast) return -1;
    
    // Sort by closest date first
    const targetA = new Date(`${a.targetDate}T${a.targetTime || '23:59:59'}`);
    const targetB = new Date(`${b.targetDate}T${b.targetTime || '23:59:59'}`);
    
    return targetA.getTime() - targetB.getTime();
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
