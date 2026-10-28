import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';

import type { Palette } from '@/constant/theme';

/** Shared header look for every tab's stack. Large titles on top-level screens only. */
export function stackScreenOptions(palette: Palette): NativeStackNavigationOptions {
  return {
    // iOS 26 draws a Liquid Glass header only when no background colour is set; elsewhere paint the ground.
    headerStyle: Platform.OS === 'ios' ? undefined : { backgroundColor: palette.ground },
    headerTintColor: palette.accent,
    headerTitleStyle: { color: palette.ink },
    headerLargeTitleStyle: { color: palette.ink },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: palette.ground },
    ...webHeaderInset,
  };
}

/**
 * On web, NativeTabs renders a floating pill fixed 24–64px from the top. The JS header accepts
 * `headerStatusBarHeight` (passed through by the web stack, but not in the native types), so the
 * header starts below the pill instead of under it.
 */
const webHeaderInset = (Platform.OS === 'web'
  ? { headerStatusBarHeight: 72 }
  : {}) as unknown as NativeStackNavigationOptions;

export const topLevelOptions = (title: string): NativeStackNavigationOptions => ({
  title,
  headerLargeTitleEnabled: true,
});
