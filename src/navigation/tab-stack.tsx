import { Stack } from 'expo-router';

import { usePalette } from '@/hooks/use-theme';

import { stackScreenOptions, topLevelOptions } from './stack-options';

export interface TabStackProps {
  /** Large title of the tab's first screen. */
  title: string;
  /** Whether this stack hosts the results route. */
  withResults?: boolean;
}

/** Each tab owns a native stack so pushes keep the tab bar and the back gesture. */
export function TabStack({ title, withResults }: TabStackProps) {
  const palette = usePalette();
  return (
    <Stack screenOptions={stackScreenOptions(palette)}>
      <Stack.Screen name="index" options={topLevelOptions(title)} />
      {withResults ? <Stack.Screen name="results" options={{ title: 'Suggestions' }} /> : null}
    </Stack>
  );
}
