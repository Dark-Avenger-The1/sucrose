import { StyleSheet, View } from 'react-native';

import { radius, space, touchTarget } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

/**
 * Loading placeholder in the final layout: flat bars at the size of the real rows, no shimmer,
 * so nothing shifts when the data lands.
 */
export function SkeletonRows({ count = 3 }: { count?: number }) {
  const palette = usePalette();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[styles.group, { backgroundColor: palette.surface }]}
    >
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={[
            styles.row,
            index < count - 1 && { borderBottomColor: palette.border, borderBottomWidth: StyleSheet.hairlineWidth },
          ]}
        >
          <View style={[styles.bar, { backgroundColor: palette.surfacePressed, width: `${55 - index * 8}%` }]} />
          <View style={[styles.bar, styles.value, { backgroundColor: palette.surfacePressed }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { borderRadius: radius.md, overflow: 'hidden' },
  row: {
    minHeight: touchTarget + 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
  },
  bar: { height: 14, borderRadius: radius.sm / 2 },
  value: { width: 44 },
});
