export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // total ms remaining
  isPast: boolean;
};

export function getTimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isPast: true };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours   = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days    = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, total, isPast: false };
}

export type CountdownPreset = { label: string; getDate: () => Date };

export const PRESETS: CountdownPreset[] = [
  {
    label: 'New Year 2026',
    getDate: () => new Date('2026-01-01T00:00:00'),
  },
  {
    label: 'Diwali 2025',
    getDate: () => new Date('2025-10-20T00:00:00'),
  },
  {
    label: 'Christmas 2025',
    getDate: () => new Date('2025-12-25T00:00:00'),
  },
  {
    label: 'In 1 hour',
    getDate: () => new Date(Date.now() + 3600_000),
  },
  {
    label: 'In 24 hours',
    getDate: () => new Date(Date.now() + 86400_000),
  },
  {
    label: 'In 7 days',
    getDate: () => new Date(Date.now() + 7 * 86400_000),
  },
];

export function toLocalDatetimeInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
