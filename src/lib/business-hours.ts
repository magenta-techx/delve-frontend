export interface BusinessHour {
  day: number;
  day_label: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

export interface GroupedBusinessHour {
  days: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

export function formatBusinessTime(
  time: string | null
): { hour: string; period: string } | null {
  if (!time) return null;

  // Handle "HH:MM:SS" or "HH:MM" format
  const parts = time.split(':');
  if (parts.length < 2) return null;

  let hour = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  const timeStr = minutes > 0 ? `${hour}:${parts[1]}` : `${hour}`;

  return {
    hour: timeStr,
    period: period,
  };
}

export function groupBusinessHours(
  hours: BusinessHour[]
): GroupedBusinessHour[] {
  if (!hours || hours.length === 0) return [];

  const sortedHours = [...hours].sort((a, b) => a.day - b.day);
  const grouped: GroupedBusinessHour[] = [];

  const startDay = sortedHours[0];
  if (!startDay) return [];

  let start = startDay;
  let end = startDay;

  for (let i = 1; i < sortedHours.length; i++) {
    const current = sortedHours[i];
    if (!current) continue;

    const currentOpen = current.open_time?.split(':').slice(0, 2).join(':');
    const startOpen = start.open_time?.split(':').slice(0, 2).join(':');
    const currentClose = current.close_time?.split(':').slice(0, 2).join(':');
    const startClose = start.close_time?.split(':').slice(0, 2).join(':');

    const sameStatus = current.is_open === start.is_open;
    const sameTimes = currentOpen === startOpen && currentClose === startClose;
    const isConsecutive = current.day === end.day + 1;

    if (sameStatus && sameTimes && isConsecutive) {
      end = current;
    } else {
      grouped.push(createGroup(start, end));
      start = current;
      end = current;
    }
  }

  grouped.push(createGroup(start, end));
  return grouped;
}

function createGroup(
  start: BusinessHour,
  end: BusinessHour
): GroupedBusinessHour {
  let days: string;
  const startDayShort = getShortDay(start.day_label);
  const endDayShort = getShortDay(end.day_label);

  if (start.day === end.day) {
    days = startDayShort;
  } else {
    days = `${startDayShort} - ${endDayShort}`;
  }

  return {
    days,
    is_open: start.is_open,
    open_time: start.open_time,
    close_time: start.close_time,
  };
}

function getShortDay(label: string): string {
  const mapping: Record<string, string> = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
  };
  return mapping[label] || label;
}
