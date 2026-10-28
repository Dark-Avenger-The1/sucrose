import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion, type CSSStyle } from 'react-native-reanimated';

import { motion, space, touchTarget } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

import { AppText } from './app-text';
import { Icon } from './icon';
import { PressableScale } from './pressable-scale';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Leading content, e.g. a rank. */
  leading?: ReactNode;
  /** Trailing value, right-aligned. */
  value?: string;
  onPress?: () => void;
  accessibilityHint?: string;
  /** Hide the divider on the last row of a group. */
  last?: boolean;
  /** Makes the row a disclosure: the chevron points down while open, and assistive tech hears the state. */
  expanded?: boolean;
}

/** Chevron that turns from → to ↓ when its row opens; a two-state change, so a CSS transition. */
function DisclosureChevron({ expanded }: { expanded: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      style={{
        transform: [{ rotate: expanded ? '90deg' : '0deg' }],
        transitionProperty: 'transform',
        transitionDuration: reduceMotion ? 0 : motion.state.duration,
        transitionTimingFunction: motion.state.easing,
      } satisfies CSSStyle<ViewStyle>}
    >
      <Icon name="chevron" />
    </Animated.View>
  );
}

export function ListRow({ title, subtitle, leading, value, onPress, accessibilityHint, last, expanded }: ListRowProps) {
  const palette = usePalette();
  const isDisclosure = expanded !== undefined;
  const body = (
    <View style={styles.row}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={[styles.main, !last && { borderBottomColor: palette.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
        <View style={styles.text}>
          <AppText variant="body">{title}</AppText>
          {subtitle ? (
            <AppText variant="footnote" tone="secondary">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {value ? (
          <AppText variant="callout" tone="secondary" style={styles.value}>
            {value}
          </AppText>
        ) : null}
        {onPress ? isDisclosure ? <DisclosureChevron expanded={expanded} /> : <Icon name="chevron" /> : null}
      </View>
    </View>
  );

  if (!onPress) return body;
  return (
    <PressableScale
      onPress={onPress}
      pressedScale={0.985}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={isDisclosure ? { expanded } : undefined}
    >
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingLeft: space.lg,
  },
  leading: {
    justifyContent: 'center',
    paddingRight: space.md,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: touchTarget + 8,
    paddingVertical: space.md,
    paddingRight: space.lg,
  },
  text: { flex: 1, gap: 2 },
  value: { fontVariant: ['tabular-nums'], textAlign: 'right' },
});
