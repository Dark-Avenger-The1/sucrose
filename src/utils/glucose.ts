import type { BandTone } from '@/types/check.types';

export type GlucoseUnit = 'mg/dL' | 'mmol/L';

/** 1 mmol/L of glucose = 18.016 mg/dL (molar mass of glucose 180.16 g/mol). */
const MG_DL_PER_MMOL_L = 18.016;

export function toMgDl(value: number, unit: GlucoseUnit): number {
  return unit === 'mg/dL' ? value : value * MG_DL_PER_MMOL_L;
}

export function fromMgDl(mgDl: number, unit: GlucoseUnit): number {
  return unit === 'mg/dL' ? mgDl : mgDl / MG_DL_PER_MMOL_L;
}

/** Half-open range check, the convention the model uses for glucose: `min <= value < max`. */
export function inRange(value: number, min: number, max: number | null): boolean {
  return value >= min && (max === null || value < max);
}

/**
 * Maps a band name from the data source ("Low (hypoglycemia)", "Normal", "Prediabetes",
 * "Diabetes") onto the four tones the UI colours. Useful in a backend adapter.
 */
export function toneForBandName(name: string): BandTone {
  const n = name.toLowerCase();
  if (n.includes('low') || n.includes('hypo')) return 'low';
  if (n.includes('pre')) return 'elevated';
  if (n.includes('normal')) return 'normal';
  return 'high';
}
