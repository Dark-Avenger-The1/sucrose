import { StyleSheet, View } from 'react-native';

import { space } from '@/constant/theme';

import { AppText } from './app-text';
import { Button } from './button';

export interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
}

/** Says what is missing and offers the one action that fixes it. */
export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      <AppText variant="body" tone="secondary">
        {message}
      </AppText>
      {action ? (
        <View style={styles.action}>
          <Button label={action.label} onPress={action.onPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm, paddingTop: space.xl },
  action: { marginTop: space.lg },
});
