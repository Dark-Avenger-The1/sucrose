import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import type { CheckInput } from '@/domain/check.types';
import { INPUT_RULES } from '@/domain/input-rules';
import { validateDraft } from '@/domain/validation';
import { fromParams, type CheckParams } from '@/navigation/routes';

export type CheckRouteState = { status: 'ok'; input: CheckInput } | { status: 'error'; message: string };

/**
 * Reads the check from the route (so results survive deep links and history) and re-validates it.
 * The reading's meaning and the food data are fetched from the data source by the results screen.
 */
export function useCheckFromRoute(): CheckRouteState {
  const params = useLocalSearchParams<CheckParams>();

  return useMemo<CheckRouteState>(() => {
    const input = fromParams(params);
    if (!input) return { status: 'error', message: 'This link is missing a reading, age or gender.' };

    const check = validateDraft(
      { glucose: String(input.glucoseMgDl), unit: 'mg/dL', age: String(input.age), gender: input.gender },
      INPUT_RULES,
    );
    if (!check.ok) {
      return { status: 'error', message: Object.values(check.errors)[0] ?? 'This check is not valid.' };
    }
    return { status: 'ok', input };
  }, [params]);
}
