import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, space } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';
import { ServiceError } from '@/services/sucrose/sucrose-service';

import { AppText } from './app-text';
import { Button } from './button';
import { SkeletonRows } from './skeleton-rows';

export interface QueryBlockProps<T> {
  query: UseQueryResult<T>;
  /** What failed, in the user's words: "the meal plan". */
  subject: string;
  skeletonRows?: number;
  children: (data: T) => ReactNode;
}

/** Loading, error and data for one block, with the error kept inside the block it affects. */
export function QueryBlock<T>({ query, subject, skeletonRows = 3, children }: QueryBlockProps<T>) {
  const palette = usePalette();

  if (query.isPending) return <SkeletonRows count={skeletonRows} />;

  if (query.isError) {
    return (
      <View accessibilityRole="alert" style={[styles.error, { backgroundColor: palette.surface }]}>
        <AppText variant="headline">Couldn’t load {subject}.</AppText>
        <AppText variant="callout" tone="secondary">
          {query.error instanceof ServiceError ? query.error.message : 'Something went wrong. Try again in a moment.'}
        </AppText>
        <View style={styles.retry}>
          <Button label="Try again" variant="plain" onPress={() => void query.refetch()} />
        </View>
      </View>
    );
  }

  return <>{children(query.data)}</>;
}

const styles = StyleSheet.create({
  error: { borderRadius: radius.md, padding: space.lg, gap: space.xs },
  retry: { alignItems: 'flex-start', marginLeft: -space.md, marginTop: space.xs },
});
