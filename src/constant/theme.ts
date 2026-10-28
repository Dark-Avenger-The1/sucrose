import { Platform, type TextStyle } from 'react-native';
import { cubicBezier } from 'react-native-reanimated';

import type { BandTone } from '@/types/check.types';

/**
 * Design tokens. Components read roles ("ink", "surface"), never raw hex, so light and dark
 * stay in step. One ground, one ink, one accent; colour on data only (the reading's band).
 */
export interface Palette {
  ground: string;
  surface: string;
  surfacePressed: string;
  ink: string;
  inkSecondary: string;
  inkTertiary: string;
  border: string;
  borderStrong: string;
  accent: string;
  onAccent: string;
  danger: string;
  band: Record<BandTone, { tint: string; ink: string; fill: string }>;
}

const light: Palette = {
  ground: '#FFFFFF',
  surface: '#F3F4F1',
  surfacePressed: '#E7E9E4',
  ink: '#121513',
  inkSecondary: '#545B56',
  inkTertiary: '#6E756F',
  border: '#E4E6E1',
  borderStrong: '#C9CDC6',
  accent: '#1E6B47',
  onAccent: '#FFFFFF',
  danger: '#B3261E',
  band: {
    low: { tint: '#E7EFFA', ink: '#1C4C86', fill: '#3D74B8' },
    normal: { tint: '#E5F2EA', ink: '#1E6B47', fill: '#2F8A5E' },
    elevated: { tint: '#FAF0DA', ink: '#7A4F00', fill: '#C98A10' },
    high: { tint: '#FAE6E3', ink: '#9F2A1F', fill: '#C8473A' },
  },
};

const dark: Palette = {
  ground: '#0B0C0B',
  surface: '#171917',
  surfacePressed: '#222522',
  ink: '#F1F3F0',
  inkSecondary: '#A9B0AA',
  inkTertiary: '#8C938D',
  border: '#252825',
  borderStrong: '#3A3E3A',
  accent: '#6FCB98',
  onAccent: '#06160D',
  danger: '#F2B8B5',
  band: {
    low: { tint: '#14223A', ink: '#A5C6F2', fill: '#6E9FDB' },
    normal: { tint: '#11261A', ink: '#93D6AF', fill: '#56B484' },
    elevated: { tint: '#2C2210', ink: '#F0C66E', fill: '#D9A43A' },
    high: { tint: '#2F1613', ink: '#F4A69C', fill: '#E06A5B' },
  },
};

export const palettes = { light, dark } as const;

/** 4pt grid. */
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

/** One soft radius, chosen once. */
export const radius = { sm: 8, md: 12, pill: 999 } as const;

/** Minimum touch target: 44pt iOS, 48dp Android. */
export const touchTarget = Platform.select({ android: 48, default: 44 });

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

/**
 * Type roles, mapped from iOS text styles. System face (SF / Roboto) carries the UI;
 * sizes scale with the user's text-size setting because `allowFontScaling` stays on.
 */
export const type = {
  figure: { fontSize: 40, lineHeight: 44, fontWeight: '600', letterSpacing: -0.8, fontVariant: tabular },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600', letterSpacing: -0.3 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24, fontWeight: '400' },
  callout: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  input: { fontSize: 28, lineHeight: 34, fontWeight: '600', fontVariant: tabular },
} satisfies Record<string, TextStyle>;

export type TypeRole = keyof typeof type;

/** Strong ease-out for UI (never ease-in). Press feedback stays under 150ms. */
const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

export const motion = {
  press: { duration: 120, easing: EASE_OUT },
  state: { duration: 180, easing: EASE_OUT },
} as const;
