import type { CheckInput, GlucoseAssessment, Notice, ScaleStep } from '@/types/check.types';
import { MEAL_NAMES, type FoodCombo, type FoodItem, type MealName, type MealPlan } from '@/types/food.types';
import { inRange, toneForBandName } from '@/utils/glucose';

import { ServiceError, type SucroseService } from './sucrose-service';

/** The hosted backend. Override with EXPO_PUBLIC_API_URL in `.env.local` (e.g. your LAN IP while developing). */
export const DEFAULT_API_URL = 'https://sucrose-api.onrender.com/api';

/**
 * The model's eight glucose levels (sucrose-model-v2.json `glucose_levels`). The API does not return
 * the list yet, so it lives here. Tone is the clinical band at each level's lower bound.
 */
const SCALE: ScaleStep[] = [
  { label: 'Under 80', minMgDl: 0, maxMgDl: 80, tone: 'low' },
  { label: '80–99', minMgDl: 80, maxMgDl: 100, tone: 'normal' },
  { label: '100–119', minMgDl: 100, maxMgDl: 120, tone: 'elevated' },
  { label: '120–139', minMgDl: 120, maxMgDl: 140, tone: 'elevated' },
  { label: '140–159', minMgDl: 140, maxMgDl: 160, tone: 'high' },
  { label: '160–179', minMgDl: 160, maxMgDl: 180, tone: 'high' },
  { label: '180–199', minMgDl: 180, maxMgDl: 200, tone: 'high' },
  { label: '200+', minMgDl: 200, maxMgDl: null, tone: 'high' },
];

// What the API sends back (see the docs page of the backend).
interface ApiItem { code: number; name: string; net_carb_100g: number | null }
interface ApiFoodGroup { food: string; code: number; net_carb_100g: number | null; items: ApiItem[] }
interface ApiGlucoseCheck { clinicalBand: string | null; note: { note: string } | null }
type ApiMealPlan = Record<MealName, { combo: string[] | null; foods: ApiFoodGroup[] }>;

export function createSucroseApiService(baseUrl: string = DEFAULT_API_URL): SucroseService {
  async function get<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${baseUrl}${path}?${new URLSearchParams(params)}`, { signal });
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new ServiceError('Can’t reach the server. Check your connection and try again.', null);
    }
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) throw new ServiceError(body?.error ?? 'Something went wrong on the server.', res.status);
    return body as T;
  }

  const profile = (input: CheckInput) => ({
    glucose: String(input.glucoseMgDl),
    age: String(input.age),
    gender: input.gender,
  });

  /** food, combo and meal-plan wrap their result as `{ data, disclaimer }`. */
  const getData = async <T>(path: string, input: CheckInput, signal?: AbortSignal) =>
    (await get<{ data: T }>(path, profile(input), signal)).data;

  return {
    async checkGlucose(input, signal): Promise<GlucoseAssessment> {
      const res = await get<ApiGlucoseCheck>('/glucose-check', { glucose: String(input.glucoseMgDl) }, signal);
      const level = SCALE.find((s) => inRange(input.glucoseMgDl, s.minMgDl, s.maxMgDl)) ?? SCALE[SCALE.length - 1]!;
      const label = res.clinicalBand ?? 'Unknown';
      const notices: Notice[] = [];
      if (res.note) {
        if (input.glucoseMgDl < 70) notices.push({ tone: 'warning', message: res.note.note });
        else if (input.glucoseMgDl >= 100) notices.push({ tone: 'info', message: res.note.note });
      }
      return { band: { label, tone: toneForBandName(label) }, level, scale: SCALE, notices };
    },

    async getFoods(input, signal): Promise<FoodItem[]> {
      const groups = await getData<ApiFoodGroup[]>('/food', input, signal);
      return groups.map(toFoodItem);
    },

    async getCombos(input, signal): Promise<FoodCombo[]> {
      const pairs = await getData<{ food: string[] }[]>('/combo', input, signal);
      return pairs.map((pair) => ({ foods: pair.food }));
    },

    async getMealPlan(input, signal): Promise<MealPlan> {
      const plan = await getData<ApiMealPlan>('/meal-plan', input, signal);
      return {
        meals: MEAL_NAMES.map((name) => ({
          name,
          items: plan[name].foods.map((group) => group.food),
          combo: plan[name].combo,
        })),
      };
    },
  };
}

function toFoodItem(group: ApiFoodGroup): FoodItem {
  return {
    id: group.food,
    name: group.food,
    netCarbsPer100g: group.net_carb_100g,
    source: 'model',
    variants: group.items.length
      ? group.items.map((item) => ({ code: item.code, name: item.name, netCarbsPer100g: item.net_carb_100g }))
      : undefined,
  };
}
