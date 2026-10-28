import type { CheckInput, GlucoseAssessment } from '@/domain/check.types';
import type { FoodCombo, FoodItem, MealPlan } from '@/domain/food.types';

/**
 * Everything the app needs from the backend. Screens depend on this interface only.
 *
 * The app ships with a mock (`createMockSucroseService`) so the UI can be built and tested without
 * a server. To connect the real backend, write a class or factory that implements this interface
 * (calling the API and mapping its responses onto these types) and pass it in
 * `src/providers/services-provider.tsx`. See `docs/BACKEND_INTEGRATION.md`.
 */
export interface SucroseService {
  /** What the reading means: clinical band, glucose level, the scale, safety notes. */
  checkGlucose(input: CheckInput, signal?: AbortSignal): Promise<GlucoseAssessment>;
  /** The recommended foods (groups), each with the specific foods inside it already filtered and ordered. */
  getFoods(input: CheckInput, signal?: AbortSignal): Promise<FoodItem[]>;
  /** Foods often eaten together. */
  getCombos(input: CheckInput, signal?: AbortSignal): Promise<FoodCombo[]>;
  /** Breakfast, lunch and dinner. May differ between calls: "New meal plan" simply calls it again. */
  getMealPlan(input: CheckInput, signal?: AbortSignal): Promise<MealPlan>;
}

/**
 * Throw this from an implementation to show a specific message to the user. `status` is the HTTP
 * status when the server answered: 4xx is not retried; 5xx and network errors (`null`) are retried once.
 * Any other error shows a generic message.
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
