import type { Gender } from '@/constant/input-rules';

/** Net carbs per 100 g, or a dash when the source does not report it. */
export function formatNetCarbs(value: number | null | undefined): string {
  return value == null ? '—' : `${value.toFixed(1)} g`;
}

export function mealLabel(meal: string): string {
  return meal.charAt(0).toUpperCase() + meal.slice(1);
}

/** "Prediabetes range" reads as a position on a scale, not a diagnosis from one reading. */
export function bandLabel(band: { label: string; tone: string }): string {
  return band.tone === 'low' ? band.label : `${band.label} range`;
}

export function genderLabel(gender: Gender): string {
  return gender === 'female' ? 'Female' : 'Male';
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}
