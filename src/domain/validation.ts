import type { CheckErrors } from './check.types';
import { fromMgDl, toMgDl, type GlucoseUnit } from './glucose';
import type { Gender, InputRules } from './input-rules';

/** Raw form state: text exactly as typed, before parsing. */
export interface CheckDraft {
  glucose: string;
  unit: GlucoseUnit;
  age: string;
  gender: Gender | null;
}

export type ValidatedDraft =
  | { ok: true; value: { glucoseMgDl: number; age: number; gender: Gender } }
  | { ok: false; errors: CheckErrors };

function parseNumber(text: string): number | null {
  const normalised = text.trim().replace(',', '.');
  if (normalised === '') return null;
  const value = Number(normalised);
  return Number.isFinite(value) ? value : null;
}

export function formatGlucoseRange(rules: InputRules, unit: GlucoseUnit): string {
  const [min, max] = rules.glucoseRangeMgDl;
  const digits = unit === 'mg/dL' ? 0 : 1;
  return `${fromMgDl(min, unit).toFixed(digits)}–${fromMgDl(max, unit).toFixed(digits)} ${unit}`;
}

/**
 * Validates the form against the input rules for instant feedback. Messages name the problem and
 * the fix.
 */
export function validateDraft(draft: CheckDraft, rules: InputRules): ValidatedDraft {
  const errors: CheckErrors = {};

  const glucose = parseNumber(draft.glucose);
  const glucoseMgDl = glucose === null ? null : toMgDl(glucose, draft.unit);
  const [minGlucose, maxGlucose] = rules.glucoseRangeMgDl;
  if (glucoseMgDl === null) {
    errors.glucoseMgDl = 'Enter your blood sugar reading.';
  } else if (glucoseMgDl < minGlucose || glucoseMgDl > maxGlucose) {
    errors.glucoseMgDl = `Enter a reading between ${formatGlucoseRange(rules, draft.unit)}.`;
  }

  const age = parseNumber(draft.age);
  if (age === null) {
    errors.age = 'Enter your age in years.';
  } else if (!Number.isInteger(age)) {
    errors.age = 'Enter your age in whole years.';
  } else if (age < rules.minAge) {
    errors.age = `The model was trained on adults, so age must be ${rules.minAge} or older.`;
  } else if (age > rules.maxAge) {
    errors.age = `Enter an age of ${rules.maxAge} or younger.`;
  }

  if (draft.gender === null || !rules.genders.includes(draft.gender)) {
    errors.gender = 'Choose female or male.';
  }

  if (Object.keys(errors).length > 0 || glucoseMgDl === null || age === null || draft.gender === null) {
    return { ok: false, errors };
  }
  return { ok: true, value: { glucoseMgDl: Math.round(glucoseMgDl), age, gender: draft.gender } };
}
