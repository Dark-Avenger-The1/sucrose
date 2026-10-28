import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { space } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

/**
 * Every screen's root scroll view. `contentInsetAdjustmentBehavior="automatic"` keeps content
 * clear of the iOS 26 transparent header and of the native tab bar.
 */
export function ScreenScroll({ children }: { children: ReactNode }) {
  const palette = usePalette();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets
      style={{ backgroundColor: palette.ground }}
      contentContainerStyle={styles.content}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    // iOS 26's tab bar floats over content and the nested stack's automatic inset only covers the
    // home indicator, so reserve the bar's height (~62pt) plus breathing room.
    paddingBottom: Platform.OS === 'ios' ? 96 : space.xxxl,
    gap: space.xxl,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
});
