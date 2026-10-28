import { StyleSheet, View } from 'react-native';

import { radius, space } from '@/constant/theme';
import type { Notice as NoticeModel } from '@/types/check.types';
import { usePalette } from '@/hooks/use-theme';

import { AppText } from './app-text';

/** Inline safety note. Warnings use the band colour for low glucose; info stays neutral. */
export function Notice({ notice }: { notice: NoticeModel }) {
  const palette = usePalette();
  const warning = notice.tone === 'warning';
  const colors = warning
    ? { background: palette.band.low.tint, ink: palette.band.low.ink }
    : { background: palette.surface, ink: palette.ink };

  return (
    <View
      accessibilityRole={warning ? 'alert' : 'summary'}
      style={[styles.box, { backgroundColor: colors.background }]}
    >
      <AppText variant="callout" color={colors.ink} style={warning && styles.strong}>
        {notice.message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  strong: { fontWeight: '600' },
});
