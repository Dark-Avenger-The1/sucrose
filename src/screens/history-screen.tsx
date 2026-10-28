import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { Section } from '@/components/ui/section';
import { space } from '@/constant/theme';
import { formatDateTime, genderLabel } from '@/domain/format';
import { routes } from '@/navigation/routes';
import { useHistory } from '@/providers/services-provider';
import { confirm } from '@/services/feedback/confirm';

/** Past checks, newest first. Reopening one asks the data source again, so model updates apply to old checks. */
export function HistoryScreen() {
  const router = useRouter();
  const { entries, clear } = useHistory();

  if (entries.length === 0) {
    return (
      <ScreenScroll>
        <EmptyState
          title="No checks yet"
          message="Each reading you check is saved here on this device, so you can reopen its suggestions later."
          action={{ label: 'Start a check', onPress: () => router.navigate(routes.newCheck) }}
        />
      </ScreenScroll>
    );
  }

  async function handleClear() {
    const ok = await confirm({
      title: 'Clear history?',
      message: `This removes all ${entries.length} saved checks from this device.`,
      confirmLabel: 'Clear history',
      destructive: true,
    });
    if (ok) clear();
  }

  return (
    <ScreenScroll>
      <Section title="Recent checks" footer="Your past checks are saved only on this device.">
        {entries.map((entry, index) => (
          <ListRow
            key={entry.id}
            title={`${entry.input.glucoseMgDl} mg/dL`}
            subtitle={`${genderLabel(entry.input.gender)}, ${entry.input.age} · ${formatDateTime(entry.createdAt)}`}
            onPress={() => router.push(routes.results('history', entry.input))}
            accessibilityHint="Opens the food suggestions for this check"
            last={index === entries.length - 1}
          />
        ))}
      </Section>
      <View style={styles.clear}>
        <Button label="Clear history" variant="plain" destructive onPress={handleClear} />
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  clear: { alignItems: 'center', marginTop: -space.lg },
});
