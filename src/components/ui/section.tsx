import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, space } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

import { AppText } from './app-text';

export interface SectionProps {
  title: string;
  /** One sentence that says what the list means, under the heading. */
  description?: string;
  children: ReactNode;
  footer?: string;
}

/** Inset grouped list: heading, a surface holding rows, optional footnote. */
export function Section({ title, description, children, footer }: SectionProps) {
  const palette = usePalette();
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="title" accessibilityRole="header">
          {title}
        </AppText>
        {description ? (
          <AppText variant="callout" tone="secondary">
            {description}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.group, { backgroundColor: palette.surface }]}>{children}</View>
      {footer ? (
        <AppText variant="footnote" tone="secondary" style={styles.footer}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.md },
  header: { gap: space.xs },
  group: { borderRadius: radius.md, overflow: 'hidden' },
  footer: { paddingHorizontal: space.xs },
});
