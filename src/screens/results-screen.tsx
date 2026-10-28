import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { ComboListView } from '@/components/results/combo-list-view';
import { FoodListView } from '@/components/results/food-list-view';
import { MealPlanView } from '@/components/results/meal-plan-view';
import { ReadingSummary } from '@/components/results/reading-summary';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { DISCLAIMER } from '@/constant/input-rules';
import { useCheckFromRoute } from '@/hooks/use-check-result';
import { ROUTES, type CheckNav } from '@/constant/routes';

type View = 'meals' | 'foods' | 'combos';

const VIEWS = [
  { value: 'meals', label: 'Meal plan' },
  { value: 'foods', label: 'Foods' },
  { value: 'combos', label: 'Combos' },
] as const satisfies readonly { value: View; label: string }[];

/** The reading first, then one of three answers from the data source; the meal plan leads. */
export function ResultsScreen() {
  const navigation = useNavigation<CheckNav>();
  const state = useCheckFromRoute();
  const [view, setView] = useState<View>('meals');

  if (state.status === 'error') {
    return (
      <ScreenScroll>
        <EmptyState
          title="Can’t show suggestions"
          message={state.message}
          action={{ label: 'Start a new check', onPress: () => navigation.navigate(ROUTES.checkTab, { screen: ROUTES.checkHome }) }}
        />
      </ScreenScroll>
    );
  }

  const { input } = state;

  return (
    <ScreenScroll>
      <ReadingSummary input={input} />
      <SegmentedControl accessibilityLabel="Show" options={VIEWS} value={view} onChange={setView} />
      {view === 'meals' ? <MealPlanView input={input} /> : null}
      {view === 'foods' ? <FoodListView input={input} /> : null}
      {view === 'combos' ? <ComboListView input={input} /> : null}
      <AppText variant="footnote" tone="tertiary">
        {DISCLAIMER}
      </AppText>
    </ScreenScroll>
  );
}
