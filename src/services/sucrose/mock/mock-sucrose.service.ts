import type { BandTone, CheckInput, GlucoseAssessment, Notice } from '@/domain/check.types';
import type { FoodCombo, FoodItem, MealPlan } from '@/domain/food.types';
import { inRange } from '@/domain/glucose';

import type { SucroseService } from '../sucrose-service';
import fixtures from './fixtures.json';

/**
 * MOCK, for building and testing the UI without a backend. Replace it with the real implementation
 * in `src/providers/services-provider.tsx`.
 *
 * It answers from sample responses recorded from the ECLAT model (`fixtures.json`): one scenario
 * per clinical band (low, normal, prediabetes, diabetes), whatever the age and gender. Meal plans
 * rotate between three recorded plans so "New meal plan" visibly changes.
 */
interface Scenario {
  foods: FoodItem[];
  combos: FoodCombo[];
  mealPlans: MealPlan[];
}

const data = fixtures as unknown as {
  bands: { label: string; tone: BandTone; minMgDl: number; maxMgDl: number | null }[];
  scale: GlucoseAssessment['scale'];
  notes: { low: string; high: string };
  scenarios: Record<BandTone, Scenario>;
};

export interface MockOptions {
  /** Simulated network delay, so loading states are visible. */
  latencyMs?: number;
  /** Make every call fail, to see the error states. */
  fail?: boolean;
}

export function createMockSucroseService({ latencyMs = 450, fail = false }: MockOptions = {}): SucroseService {
  let mealPlanCalls = 0;

  function respond<T>(value: () => T, signal?: AbortSignal): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (fail) reject(new Error('Mock failure'));
        else resolve(value());
      }, latencyMs);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('Aborted'));
      });
    });
  }

  const bandOf = (input: CheckInput) =>
    data.bands.find((b) => inRange(input.glucoseMgDl, b.minMgDl, b.maxMgDl)) ?? data.bands[data.bands.length - 1]!;
  const scenarioOf = (input: CheckInput) => data.scenarios[bandOf(input).tone];

  return {
    checkGlucose: (input, signal) =>
      respond(() => {
        const band = bandOf(input);
        const level =
          data.scale.find((s) => inRange(input.glucoseMgDl, s.minMgDl, s.maxMgDl)) ?? data.scale[data.scale.length - 1]!;
        const notices: Notice[] =
          band.tone === 'low'
            ? [{ tone: 'warning', message: data.notes.low }]
            : band.tone === 'normal'
              ? []
              : [{ tone: 'info', message: data.notes.high }];
        return { band: { label: band.label, tone: band.tone }, level, scale: data.scale, notices };
      }, signal),
    getFoods: (input, signal) => respond(() => scenarioOf(input).foods, signal),
    getCombos: (input, signal) => respond(() => scenarioOf(input).combos, signal),
    getMealPlan: (input, signal) =>
      respond(() => {
        const plans = scenarioOf(input).mealPlans;
        return plans[mealPlanCalls++ % plans.length]!;
      }, signal),
  };
}
