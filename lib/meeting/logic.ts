/**
 * Meeting Planner logic — pure functions, no external deps.
 * Uses the browser's Intl API for timezone-aware formatting.
 */

import {
  POPULAR_TIMEZONES,
  getOffsetMinutes,
  offsetToString,
  getAbbr,
} from '@/lib/timezone/logic';

export { POPULAR_TIMEZONES };

export type MeetingZone = {
  id: number;
  tz: string;
  label: string;
};

/** A single hour slot in the meeting grid */
export type SlotInfo = {
  /** UTC hour-of-day anchor (0-23) */
  utcHour: number;
  /** Display time string in the zone's local time */
  localTime: string;
  /** Short date label (e.g. "Mon 19 May") */
  localDate: string;
  /** Timezone offset string e.g. "UTC+5:30" */
  offset: string;
  /** Abbreviation e.g. "IST" */
  abbr: string;
  /** Day offset from the reference zone: -1, 0, +1 */
  dayOffset: number;
  /** Whether this hour falls in business hours (09:00–18:00) local time */
  isBusinessHours: boolean;
  /** Whether this is a night hour (21:00–06:00) local time */
  isNight: boolean;
};

/** Per-zone row in the meeting grid */
export type ZoneRow = {
  tz: string;
  label: string;
  slots: SlotInfo[];
};

/** 24-hour range starting from 00:00 UTC on the given date */
export function buildGrid(date: Date, zones: MeetingZone[]): ZoneRow[] {
  // Anchor to midnight UTC of the selected date
  const base = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
  );

  return zones.map((zone) => {
    const slots: SlotInfo[] = Array.from({ length: 24 }, (_, h) => {
      const utcMs = base.getTime() + h * 3_600_000;
      const at    = new Date(utcMs);

      const localTime = new Intl.DateTimeFormat('en-US', {
        timeZone: zone.tz,
        hour:     '2-digit',
        minute:   '2-digit',
        hour12:   true,
      }).format(at);

      const localDate = new Intl.DateTimeFormat('en-US', {
        timeZone: zone.tz,
        weekday:  'short',
        day:      'numeric',
        month:    'short',
      }).format(at);

      // Local hour for color-coding
      const localHour = Number(
        new Intl.DateTimeFormat('en-US', {
          timeZone: zone.tz,
          hour:     '2-digit',
          hour12:   false,
        }).format(at),
      );

      // Day offset: compare local calendar date to UTC date
      const utcDay   = base.getUTCDate();
      const localDay = Number(
        new Intl.DateTimeFormat('en-US', {
          timeZone: zone.tz,
          day:      'numeric',
        }).format(new Date(base.getTime())),
      );
      // Compare the day of the slot vs the reference day in the same zone
      const slotDay = Number(
        new Intl.DateTimeFormat('en-US', {
          timeZone: zone.tz,
          day:      'numeric',
        }).format(at),
      );
      let dayOffset = 0;
      if (slotDay > localDay || (localDay >= 28 && slotDay <= 3)) dayOffset = 1;
      else if (slotDay < localDay && !(localDay <= 3 && slotDay >= 28)) dayOffset = -1;

      const isBusinessHours = localHour >= 9 && localHour < 18;
      const isNight         = localHour >= 21 || localHour < 6;

      return {
        utcHour:        h,
        localTime,
        localDate,
        offset:         offsetToString(getOffsetMinutes(zone.tz, at)),
        abbr:           getAbbr(zone.tz, at),
        dayOffset,
        isBusinessHours,
        isNight,
      };
    });

    return {
      tz:    zone.tz,
      label: zone.label,
      slots,
    };
  });
}

/** Find hours where ALL zones are in business hours */
export function getBestSlots(grid: ZoneRow[]): number[] {
  if (grid.length === 0) return [];
  return grid[0].slots
    .map((_, h) => h)
    .filter((h) => grid.every((row) => row.slots[h].isBusinessHours));
}

/** Find hours where at least one zone is OK (not night) */
export function getAcceptableSlots(grid: ZoneRow[]): number[] {
  if (grid.length === 0) return [];
  return grid[0].slots
    .map((_, h) => h)
    .filter((h) => grid.every((row) => !row.slots[h].isNight));
}

/** Label for a friendly zone picker */
export function zoneDisplayLabel(tz: string): string {
  return (
    POPULAR_TIMEZONES.find((p) => p.tz === tz)?.label ?? tz.replace(/_/g, ' ')
  );
}

let _seq = 0;
export const mkZone = (tz: string): MeetingZone => ({
  id:    ++_seq,
  tz,
  label: zoneDisplayLabel(tz),
});

export const DEFAULT_MEETING_ZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
].map(mkZone);
