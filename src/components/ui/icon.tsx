import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';

import { usePalette } from '@/hooks/use-theme';

/** One icon system: SF Symbols on iOS, Material Symbols on Android and web. */
const ICONS = {
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
} satisfies Record<string, { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol }>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 14, color }: { name: IconName; size?: number; color?: string }) {
  const palette = usePalette();
  return (
    <SymbolView
      name={ICONS[name]}
      size={size}
      tintColor={color ?? palette.inkTertiary}
      weight="semibold"
      importantForAccessibility="no"
      accessibilityElementsHidden
    />
  );
}
