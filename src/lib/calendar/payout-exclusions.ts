/**
 * Google Calendar Integration for Payout Date Exclusions
 * Excludes weekends and holidays from payout processing
 */

export interface PayoutExclusion {
  date: string; // YYYY-MM-DD format
  reason: string;
  type: 'weekend' | 'holiday' | 'bank_holiday';
}

/**
 * List of Indian national holidays and bank holidays
 * Period: Jan 1, 2024 to Mar 1, 2026
 */
const INDIAN_HOLIDAYS: PayoutExclusion[] = [
  // 2024
  { date: '2024-01-26', reason: 'Republic Day', type: 'holiday' },
  { date: '2024-03-08', reason: 'Maha Shivaratri', type: 'holiday' },
  { date: '2024-03-25', reason: 'Holi', type: 'holiday' },
  { date: '2024-03-29', reason: 'Good Friday', type: 'holiday' },
  { date: '2024-04-11', reason: 'Eid ul-Fitr', type: 'holiday' },
  { date: '2024-04-17', reason: 'Ram Navami', type: 'holiday' },
  { date: '2024-04-21', reason: 'Mahavir Jayanti', type: 'holiday' },
  { date: '2024-05-23', reason: 'Buddha Purnima', type: 'holiday' },
  { date: '2024-06-17', reason: 'Eid ul-Adha', type: 'holiday' },
  { date: '2024-07-17', reason: 'Muharram', type: 'holiday' },
  { date: '2024-08-15', reason: 'Independence Day', type: 'holiday' },
  { date: '2024-08-26', reason: 'Janmashtami', type: 'holiday' },
  { date: '2024-09-16', reason: 'Milad un-Nabi', type: 'holiday' },
  { date: '2024-10-02', reason: 'Gandhi Jayanti', type: 'holiday' },
  { date: '2024-10-12', reason: 'Dussehra', type: 'holiday' },
  { date: '2024-10-31', reason: 'Diwali', type: 'holiday' },
  { date: '2024-11-01', reason: 'Diwali (Balipratipada)', type: 'holiday' },
  { date: '2024-11-15', reason: 'Guru Nanak Jayanti', type: 'holiday' },
  { date: '2024-12-25', reason: 'Christmas', type: 'holiday' },

  // 2025
  { date: '2025-01-26', reason: 'Republic Day', type: 'holiday' },
  { date: '2025-02-26', reason: 'Maha Shivaratri', type: 'holiday' },
  { date: '2025-03-14', reason: 'Holi', type: 'holiday' },
  { date: '2025-03-30', reason: 'Eid ul-Fitr', type: 'holiday' },
  { date: '2025-04-06', reason: 'Ram Navami', type: 'holiday' },
  { date: '2025-04-10', reason: 'Mahavir Jayanti', type: 'holiday' },
  { date: '2025-04-18', reason: 'Good Friday', type: 'holiday' },
  { date: '2025-05-12', reason: 'Buddha Purnima', type: 'holiday' },
  { date: '2025-06-07', reason: 'Eid ul-Adha', type: 'holiday' },
  { date: '2025-07-06', reason: 'Muharram', type: 'holiday' },
  { date: '2025-08-15', reason: 'Independence Day', type: 'holiday' },
  { date: '2025-08-16', reason: 'Janmashtami', type: 'holiday' },
  { date: '2025-09-05', reason: 'Milad un-Nabi', type: 'holiday' },
  { date: '2025-10-02', reason: 'Gandhi Jayanti', type: 'holiday' },
  { date: '2025-10-02', reason: 'Dussehra', type: 'holiday' },
  { date: '2025-10-20', reason: 'Diwali', type: 'holiday' },
  { date: '2025-10-21', reason: 'Diwali (Balipratipada)', type: 'holiday' },
  { date: '2025-11-05', reason: 'Guru Nanak Jayanti', type: 'holiday' },
  { date: '2025-12-25', reason: 'Christmas', type: 'holiday' },

  // 2026 (Jan - Mar)
  { date: '2026-01-26', reason: 'Republic Day', type: 'holiday' },
  { date: '2026-02-16', reason: 'Maha Shivaratri', type: 'holiday' },
];

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is excluded from payout processing
 */
export function isPayoutExcluded(date: Date): { excluded: boolean; reason?: string } {
  const dateStr = date.toISOString().split('T')[0];

  // Check weekends
  if (isWeekend(date)) {
    const dayName = date.getDay() === 0 ? 'Sunday' : 'Saturday';
    return { excluded: true, reason: `Weekend (${dayName})` };
  }

  // Check holidays
  const holiday = INDIAN_HOLIDAYS.find(h => h.date === dateStr);
  if (holiday) {
    return { excluded: true, reason: holiday.reason };
  }

  return { excluded: false };
}

/**
 * Get the next valid payout date (skipping weekends and holidays)
 */
export function getNextPayoutDate(startDate: Date = new Date()): Date {
  const nextDate = new Date(startDate);
  
  // Keep incrementing until we find a valid payout date
  while (true) {
    const check = isPayoutExcluded(nextDate);
    if (!check.excluded) {
      return nextDate;
    }
    // Move to next day
    nextDate.setDate(nextDate.getDate() + 1);
  }
}

/**
 * Get all excluded dates in a given range
 */
export function getExcludedDatesInRange(startDate: Date, endDate: Date): PayoutExclusion[] {
  const excluded: PayoutExclusion[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const check = isPayoutExcluded(currentDate);
    if (check.excluded) {
      const dateStr = currentDate.toISOString().split('T')[0];
      excluded.push({
        date: dateStr,
        reason: check.reason!,
        type: isWeekend(currentDate) ? 'weekend' : 'holiday'
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return excluded;
}

/**
 * Calculate payout dates for the 1st-5th of each month, skipping excluded dates
 * If all 1-5 are excluded, use the next available date
 */
export function calculateMonthlyPayoutDates(year: number, month: number): Date[] {
  const payoutDates: Date[] = [];
  
  // Try dates 1-5 of the month
  for (let day = 1; day <= 5; day++) {
    const date = new Date(year, month - 1, day);
    const check = isPayoutExcluded(date);
    
    if (!check.excluded) {
      payoutDates.push(date);
    }
  }

  // If no valid dates in 1-5, find the next available date
  if (payoutDates.length === 0) {
    const fallbackDate = getNextPayoutDate(new Date(year, month - 1, 6));
    payoutDates.push(fallbackDate);
  }

  return payoutDates;
}

/**
 * Export to Google Calendar format (ICS)
 */
export function exportToGoogleCalendar(exclusions: PayoutExclusion[]): string {
  const icsEvents = exclusions.map(ex => {
    const date = ex.date.replace(/-/g, '');
    return [
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${date}`,
      `SUMMARY:Payout Excluded - ${ex.reason}`,
      `DESCRIPTION:No payouts processed on this date due to ${ex.reason}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Brave Ecom//Payout Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Brave Ecom Payout Exclusions',
    'X-WR-TIMEZONE:Asia/Kolkata',
    icsEvents,
    'END:VCALENDAR'
  ].join('\r\n');
}