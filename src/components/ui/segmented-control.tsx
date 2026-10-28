import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { type CSSStyle } from 'react-native-reanimated';

import { motion, radius, space, touchTarget } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';
import { haptics } from '@/services/feedback/haptics';

import { AppText } from './app-text';

const thumbTransition = {
  transitionProperty: ['backgroundColor', 'borderColor'],
  transitionDuration: motion.state.duration,
  transitionTimingFunction: motion.state.easing,
} satisfies CSSStyle<ViewStyle>;

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  accessibilityLabel: string;
  invalid?: boolean;
}

/** Single-choice control. Exposed to assistive tech as a radio group. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  invalid,
}: SegmentedControlProps<T>) {
  const palette = usePalette();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.track,
        { backgroundColor: palette.surface, borderColor: invalid ? palette.danger : 'transparent' },
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => {
              if (selected) return;
              haptics.selection();
              onChange(option.value);
            }}
            style={styles.segment}
          >
            <Animated.View
              style={[
                styles.thumb,
                {
                  backgroundColor: selected ? palette.ground : 'transparent',
                  borderColor: selected ? palette.borderStrong : 'transparent',
                  ...thumbTransition,
                } satisfies CSSStyle<ViewStyle>,
              ]}
            >
              <AppText variant="headline" tone={selected ? 'primary' : 'secondary'}>
                {option.label}
              </AppText>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 3,
  },
  segment: {
    flex: 1,
  },
  thumb: {
    minHeight: touchTarget,
    borderRadius: radius.md - 3,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
});
