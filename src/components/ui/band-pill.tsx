import { StyleSheet, View } from 'react-native';

import { radius, space } from '@/constant/theme';
import type { BandTone } from '@/types/check.types';
import { usePalette } from '@/hooks/use-theme';

import { AppText } from './app-text';

/** Pale tint with dark text of the same hue; colour is a signal, never a texture. */
export function BandPill({ tone, label }: { tone: BandTone; label: string }) {
  const palette = usePalette();
  const colors = palette.band[tone];
  return (
    <View style={[styles.pill, { backgroundColor: colors.tint }]}>
      <AppText variant="footnote" color={colors.ink} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  label: { fontWeight: '600' },
});
