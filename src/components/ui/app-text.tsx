import { Text, type TextProps } from 'react-native';

import { type, type TypeRole } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger';

export interface AppTextProps extends TextProps {
  /** Type role from the theme scale. */
  variant?: TypeRole;
  tone?: Tone;
  /** Overrides the tone for data colour (a band's ink). */
  color?: string;
}

/** Every string in the app goes through here, so type roles and ink stay consistent. */
export function AppText({ variant = 'body', tone = 'primary', color, style, ...rest }: AppTextProps) {
  const palette = usePalette();
  const toneColor = {
    primary: palette.ink,
    secondary: palette.inkSecondary,
    tertiary: palette.inkTertiary,
    accent: palette.accent,
    danger: palette.danger,
  }[tone];
  return <Text {...rest} style={[type[variant], { color: color ?? toneColor }, style]} />;
}
