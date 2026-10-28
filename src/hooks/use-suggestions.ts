import { useQuery } from '@tanstack/react-query';

import type { CheckInput } from '@/domain/check.types';
import { useSucroseService } from '@/providers/services-provider';

const key = (resource: string, input: CheckInput) =>
  [resource, input.glucoseMgDl, input.age, input.gender] as const;

/** Band, glucose level, scale and safety notes for the reading. */
export function useAssessment(input: CheckInput) {
  const service = useSucroseService();
  return useQuery({ queryKey: key('assessment', input), queryFn: ({ signal }) => service.checkGlucose(input, signal) });
}

/** Breakfast, lunch and dinner; `refetch()` asks for a new plan. */
export function useMealPlan(input: CheckInput) {
  const service = useSucroseService();
  return useQuery({ queryKey: key('meal-plan', input), queryFn: ({ signal }) => service.getMealPlan(input, signal) });
}

/** The recommended foods, each with its specific foods. */
export function useFoods(input: CheckInput) {
  const service = useSucroseService();
  return useQuery({ queryKey: key('foods', input), queryFn: ({ signal }) => service.getFoods(input, signal) });
}

/** Foods often eaten together. */
export function useCombos(input: CheckInput) {
  const service = useSucroseService();
  return useQuery({ queryKey: key('combos', input), queryFn: ({ signal }) => service.getCombos(input, signal) });
}
