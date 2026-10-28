export type Gender = 'female' | 'male';

export interface InputRules {
  minAge: number;
  maxAge: number;
  genders: readonly Gender[];
  /** Inclusive range accepted for a reading, in mg/dL. */
  glucoseRangeMgDl: readonly [number, number];
}

/**
 * Form limits checked on the device for instant feedback. They mirror the model's `input_rules`
 * (adults only; 20–600 mg/dL); the backend validates again and its message is shown if it disagrees.
 */
export const INPUT_RULES: InputRules = {
  minAge: 18,
  maxAge: 120,
  genders: ['female', 'male'],
  glucoseRangeMgDl: [20, 600],
};

export const DISCLAIMER = 'Educational prototype, not medical advice.';
