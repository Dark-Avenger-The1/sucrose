import { StyleSheet } from 'react-native';

import { radius, space, touchTarget } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

import { AppText } from './app-text';
import { PressableScale } from './pressable-scale';

type Variant = 'primary' | 'secondary' | 'plain';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  accessibilityHint?: string;
  destructive?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled, accessibilityHint, destructive }: ButtonProps) {
  const palette = usePalette();
  const background = {
    primary: palette.accent,
    secondary: palette.surface,
    plain: 'transparent',
  }[variant];
  const foreground = destructive
    ? palette.danger
    : { primary: palette.onAccent, secondary: palette.ink, plain: palette.accent }[variant];

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityHint={accessibilityHint}
      style={[
        styles.base,
        variant === 'plain' && styles.plain,
        { backgroundColor: background, opacity: disabled ? 0.45 : 1 },
      ]}
    >
      <AppText variant="headline" color={foreground}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: Math.max(touchTarget, 52),
    paddingHorizontal: space.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plain: {
    minHeight: touchTarget,
    paddingHorizontal: space.md,
  },
});
