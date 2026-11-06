/**
 * Date manipulation utilities avoiding UTC timezone offsets.
 * We store and process business dates as ISO 'YYYY-MM-DD' strings.
 */

export function parseYMD(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

export function formatYMD(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayString(): string {
  const now = new Date();
  return formatYMD(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * Adds N days to a YYYY-MM-DD string
 */
export function addDaysString(dateStr: string, days: number): string {
  const { year, month, day } = parseYMD(dateStr);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return formatYMD(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * Checks whether two closed date intervals [start1, end1] and [start2, end2] overlap.
 * In rental business, furniture is committed from delivery date up to return date inclusive.
 */
export function rangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  return start1 <= end2 && start2 <= end1;
}

/**
 * Generates an array of all YYYY-MM-DD dates between start and end inclusive
 */
export function getDatesBetween(startDate: string, endDate: string): string[] {
  if (startDate > endDate) return [];
  const dates: string[] = [];
  let current = startDate;
  while (current <= endDate) {
    dates.push(current);
    current = addDaysString(current, 1);
    // Safety cap to avoid runaway loops in malformed input
    if (dates.length > 365) break;
  }
  return dates;
}

/**
 * Check if dateStr is strictly before today
 */
export function isBeforeToday(dateStr: string): boolean {
  return dateStr < getTodayString();
}

/**
 * Days between two YYYY-MM-DD dates (inclusive or difference)
 */
export function daysDifference(startStr: string, endStr: string): number {
  const p1 = parseYMD(startStr);
  const p2 = parseYMD(endStr);
  const d1 = new Date(p1.year, p1.month - 1, p1.day).getTime();
  const d2 = new Date(p2.year, p2.month - 1, p2.day).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

