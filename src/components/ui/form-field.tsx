import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/constant/theme';

import { AppText } from './app-text';

export interface FormFieldProps {
  label: string;
  /** What the field accepts; stays visible next to the field. */
  hint?: string;
  error?: string;
  children: ReactNode;
}

/** Label above, control, then the hint or (replacing it) the error that names the fix. */
export function FormField({ label, hint, error, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <AppText variant="footnote" tone="secondary" style={styles.label}>
        {label}
      </AppText>
      {children}
      {error ? (
        <AppText variant="footnote" tone="danger" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="footnote" tone="tertiary">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.sm },
  label: { fontWeight: '600' },
});
