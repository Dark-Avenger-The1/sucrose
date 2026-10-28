/**
 * What the UI renders for a food, whatever produced it. The model's food groups and Open Food
 * Facts products both map into this shape, so screens never branch on the source.
 */
export type FoodSource = 'model' | 'open-food-facts';

export interface FoodItem {
  /** Stable key: the food-group name for model items, the barcode for Open Food Facts products. */
  id: string;
  name: string;
  /** Net carbohydrate in grams per 100 g, or `null` when the source does not report it. */
  netCarbsPer100g: number | null;
  source: FoodSource;
  /** Open Food Facts extras; absent for model food groups. */
  brand?: string;
  imageUrl?: string;
  /**
   * For a model food group: the specific foods inside it (e.g. Fresh fruit → Banana, Apple…),
   * already limited to those within the user's glucose level and in display order (best first).
   */
  variants?: FoodVariant[];
}

/** One specific food inside a food group. */
export interface FoodVariant {
  /** 8-digit USDA food code. */
  code: number;
  name: string;
  netCarbsPer100g: number | null;
}

/** Foods that are often eaten together (ECLAT frequent pairs). */
export interface FoodCombo {
  foods: string[];
}

export const MEAL_NAMES = ['breakfast', 'lunch', 'dinner'] as const;
export type MealName = (typeof MEAL_NAMES)[number];

export interface Meal {
  name: MealName;
  /** Food names for this meal; the combo's foods come first when there is one. */
  items: string[];
  combo: string[] | null;
}

export interface MealPlan {
  meals: Meal[];
}
