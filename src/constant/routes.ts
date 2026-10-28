import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { Gender } from '@/constant/input-rules';
import type { CheckInput } from '@/types/check.types';

/** Every screen name in the app. Use these instead of raw strings in navigate()/push(). */
export const ROUTES = {
  checkTab: 'CheckTab',
  checkHome: 'CheckHome',
  checkResults: 'CheckResults',
  historyTab: 'HistoryTab',
  historyHome: 'HistoryHome',
  historyResults: 'HistoryResults',
  aboutTab: 'AboutTab',
  aboutHome: 'AboutHome',
} as const;

/**
 * Results live in both the Check and History stacks so the tab you start in is the tab you stay in.
 * Params travel as text so they survive deep links and web URLs.
 */
export type CheckParams = { glucose: string; age: string; gender: string };

export type CheckStackParams = {
  [ROUTES.checkHome]: undefined;
  [ROUTES.checkResults]: CheckParams;
};
export type HistoryStackParams = {
  [ROUTES.historyHome]: undefined;
  [ROUTES.historyResults]: CheckParams;
};
export type AboutStackParams = {
  [ROUTES.aboutHome]: undefined;
};
export type TabParams = {
  [ROUTES.checkTab]: NavigatorScreenParams<CheckStackParams>;
  [ROUTES.historyTab]: NavigatorScreenParams<HistoryStackParams>;
  [ROUTES.aboutTab]: NavigatorScreenParams<AboutStackParams>;
};

/** Typed `useNavigation<...>()` helpers: the stack the screen sits in, plus the tab bar above it. */
export type CheckNav = CompositeNavigationProp<
  NativeStackNavigationProp<CheckStackParams>,
  BottomTabNavigationProp<TabParams>
>;
export type HistoryNav = CompositeNavigationProp<
  NativeStackNavigationProp<HistoryStackParams>,
  BottomTabNavigationProp<TabParams>
>;
export type ResultsRoute =
  | RouteProp<CheckStackParams, typeof ROUTES.checkResults>
  | RouteProp<HistoryStackParams, typeof ROUTES.historyResults>;

export function toParams(input: CheckInput): CheckParams {
  return { glucose: String(input.glucoseMgDl), age: String(input.age), gender: input.gender };
}

/** Route params are untrusted text (deep links); anything malformed yields `null`. */
export function fromParams(params: Partial<Record<keyof CheckParams, string | string[]>> | undefined): CheckInput | null {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const glucoseMgDl = Number(first(params?.glucose));
  const age = Number(first(params?.age));
  const gender = first(params?.gender);
  if (!Number.isFinite(glucoseMgDl) || !Number.isInteger(age)) return null;
  if (gender !== 'female' && gender !== 'male') return null;
  return { glucoseMgDl, age, gender: gender satisfies Gender };
}
