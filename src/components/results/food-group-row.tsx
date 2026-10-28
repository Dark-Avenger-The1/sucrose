import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { ListRow } from '@/components/ui/list-row';
import { space, touchTarget } from '@/constant/theme';
import type { FoodVariant } from '@/types/food.types';
import { formatNetCarbs } from '@/utils/format';
import { usePalette } from '@/hooks/use-theme';

/** Specific foods shown before "Show all". */
const INITIAL_VISIBLE = 8;

export interface FoodGroupRowProps {
  title: string;
  subtitle?: string;
  value?: string;
  leading?: ReactNode;
  /** The specific foods in this group that fit the user's level. None → a plain row. */
  variants?: readonly FoodVariant[];
  last?: boolean;
}

/**
 * A food group that opens to show the specific foods inside it (Fresh fruit → Banana, Apple…).
 * Used by both the Foods list and the meal plan, so the same group behaves the same everywhere.
 */
export function FoodGroupRow({ title, subtitle, value, leading, variants, last }: FoodGroupRowProps) {
  const [open, setOpen] = useState(false);

  if (!variants || variants.length === 0) {
    return <ListRow title={title} subtitle={subtitle} value={value} leading={leading} last={last} />;
  }

  return (
    <View>
      <ListRow
        title={title}
        subtitle={subtitle}
        value={value}
        leading={leading}
        onPress={() => setOpen((v) => !v)}
        expanded={open}
        accessibilityHint={`Shows the ${variants.length} specific foods in this group`}
        last={last && !open}
      />
      {open ? <VariantList variants={variants} last={last} /> : null}
    </View>
  );
}

function VariantList({ variants, last }: { variants: readonly FoodVariant[]; last?: boolean }) {
  const palette = usePalette();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? variants : variants.slice(0, INITIAL_VISIBLE);
  const hidden = variants.length - INITIAL_VISIBLE;

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(120)}
      style={[
        styles.list,
        { backgroundColor: palette.surfacePressed },
        !last && { borderBottomColor: palette.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      {visible.map((variant) => (
        <View
          key={variant.code}
          style={styles.variant}
          accessible
          accessibilityLabel={`${variant.name}, ${formatNetCarbs(variant.netCarbsPer100g)} net carbs per 100 grams`}
        >
          <AppText variant="callout" style={styles.variantName}>
            {variant.name}
          </AppText>
          <AppText variant="footnote" tone="secondary" style={styles.variantValue}>
            {formatNetCarbs(variant.netCarbsPer100g)}
          </AppText>
        </View>
      ))}
      {hidden > 0 ? (
        <Pressable
          onPress={() => setShowAll((v) => !v)}
          accessibilityRole="button"
          style={styles.more}
          hitSlop={{ top: 4, bottom: 4 }}
        >
          <AppText variant="callout" tone="accent" style={styles.moreLabel}>
            {showAll ? 'Show fewer' : `Show all ${variants.length}`}
          </AppText>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingLeft: space.xl + space.sm,
    paddingRight: space.lg,
    paddingVertical: space.xs,
  },
  variant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm,
  },
  variantName: { flex: 1 },
  variantValue: { fontVariant: ['tabular-nums'], textAlign: 'right' },
  more: {
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  moreLabel: { fontWeight: '600' },
});
