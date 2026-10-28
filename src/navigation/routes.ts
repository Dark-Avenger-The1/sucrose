import type { Href } from 'expo-router';

import type { CheckInput } from '@/domain/check.types';
import type { Gender } from '@/domain/input-rules';

/**
 * Results live in both the Check and History stacks so the tab you start
 * in is the tab you stay in. Screens ask this module for hrefs instead of building paths.
 */
export type StackScope = 'check' | 'history';

export type CheckParams = { glucose: string; age: string; gender: string };

export function toParams(input: CheckInput): CheckParams {
  return { glucose: String(input.glucoseMgDl), age: String(input.age), gender: input.gender };
}

/** Route params are untrusted text (deep links); anything malformed yields `null`. */
export function fromParams(params: Partial<Record<keyof CheckParams, string | string[]>>): CheckInput | null {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const glucoseMgDl = Number(first(params.glucose));
  const age = Number(first(params.age));
  const gender = first(params.gender);
  if (!Number.isFinite(glucoseMgDl) || !Number.isInteger(age)) return null;
  if (gender !== 'female' && gender !== 'male') return null;
  return { glucoseMgDl, age, gender: gender satisfies Gender };
}

export const routes = {
  results(scope: StackScope, input: CheckInput): Href {
    const params = toParams(input);
    return scope === 'check'
      ? { pathname: '/results', params }
      : { pathname: '/history/results', params };
  },
  newCheck: '/' as Href,
};
