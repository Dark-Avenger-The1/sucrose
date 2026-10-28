import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { QueryBlock } from '@/components/ui/query-block';
import { Section } from '@/components/ui/section';
import { space } from '@/constant/theme';
import type { CheckInput } from '@/domain/check.types';
import type { Meal } from '@/domain/food.types';
import { formatNetCarbs, mealLabel } from '@/domain/format';
import { useFoods, useMealPlan } from '@/hooks/use-suggestions';
import { haptics } from '@/services/feedback/haptics';

import { FoodGroupRow } from './food-group-row';

function comboPartner(meal: Meal, item: string): string | undefined {
  if (!meal.combo?.includes(item)) return undefined;
  const others = meal.combo.filter((food) => food !== item);
  return others.length > 0 ? `Goes with ${others.join(', ').toLowerCase()}` : undefined;
}

/**
 * `SucroseService.getMealPlan`: breakfast, lunch and dinner. Net carbs and each group's specific foods
 * are joined by name from `getFoods`, so a meal item opens the same way as in the Foods list.
 */
export function MealPlanView({ input }: { input: CheckInput }) {
  const plan = useMealPlan(input);
  const foods = useFoods(input);
  const foodByName = useMemo(() => new Map((foods.data ?? []).map((food) => [food.name, food])), [foods.data]);

  return (
    <View style={styles.wrap}>
      <QueryBlock query={plan} subject="the meal plan" skeletonRows={9}>
        {(data) => (
          <View style={styles.meals}>
            <AppText variant="footnote" tone="secondary">
              Net carbs per 100 g are on the right.
            </AppText>
            {data.meals.map((meal) => (
              <Section key={meal.name} title={mealLabel(meal.name)}>
                {meal.items.length === 0 ? (
                  <ListRow title="No foods left for this meal." last />
                ) : (
                  meal.items.map((item, index) => (
                    <FoodGroupRow
                      key={item}
                      title={item}
                      subtitle={comboPartner(meal, item)}
                      value={foods.isSuccess ? formatNetCarbs(foodByName.get(item)?.netCarbsPer100g) : undefined}
                      variants={foodByName.get(item)?.variants}
                      last={index === meal.items.length - 1}
                    />
                  ))
                )}
              </Section>
            ))}
          </View>
        )}
      </QueryBlock>
      {plan.isSuccess ? (
        <Button
          label={plan.isFetching ? 'Making a new plan…' : 'New meal plan'}
          variant="secondary"
          disabled={plan.isFetching}
          onPress={() => {
            haptics.selection();
            void plan.refetch();
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xl },
  meals: { gap: space.xl },
});
