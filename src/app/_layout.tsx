import { StatusBar } from 'expo-status-bar';
import { NativeTabs } from 'expo-router/native-tabs';

import { usePalette } from '@/hooks/use-theme';
import { ServicesProvider } from '@/providers/services-provider';

/** Three peers, so a tab bar: check a reading, revisit past checks, learn how it works. */
export default function RootLayout() {
  const palette = usePalette();
  return (
    <ServicesProvider>
      <StatusBar style="auto" />
      <NativeTabs
        tintColor={palette.accent}
        iconColor={{ default: palette.inkTertiary, selected: palette.accent }}
        labelStyle={{ color: palette.inkSecondary }}
        backgroundColor={palette.surface}
        indicatorColor={palette.ground}
      >
        <NativeTabs.Trigger name="(check)">
          <NativeTabs.Trigger.Icon sf={{ default: 'drop', selected: 'drop.fill' }} md="water_drop" />
          <NativeTabs.Trigger.Label>Check</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="history">
          <NativeTabs.Trigger.Icon sf="clock.arrow.circlepath" md="history" />
          <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="about">
          <NativeTabs.Trigger.Icon sf={{ default: 'info.circle', selected: 'info.circle.fill' }} md="info" />
          <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ServicesProvider>
  );
}
