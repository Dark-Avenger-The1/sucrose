import { ListRow } from '@/components/ui/list-row';
import { QueryBlock } from '@/components/ui/query-block';
import { Section } from '@/components/ui/section';
import type { CheckInput } from '@/domain/check.types';
import { formatNetCarbs } from '@/domain/format';
import { useFoods } from '@/hooks/use-suggestions';

import { FoodGroupRow } from './food-group-row';
import { FoodThumbnail } from './food-thumbnail';

/**
 * `SucroseService.getFoods`. A food group opens to show its specific foods; an Open Food Facts product
 * (later) adds its photo and brand. Nothing else changes between the two.
 */
export function FoodListView({ input }: { input: CheckInput }) {
  const foods = useFoods(input);
  return (
    <QueryBlock query={foods} subject="the food list" skeletonRows={8}>
      {(items) => (
        <Section title="Suggested foods" description="Net carbs per 100 g are on the right.">
          {items.length === 0 ? (
            <ListRow title="No foods passed this level’s limits." last />
          ) : (
            items.map((food, index) => (
              <FoodGroupRow
                key={food.id}
                leading={food.imageUrl ? <FoodThumbnail uri={food.imageUrl} /> : undefined}
                title={food.name}
                subtitle={food.brand}
                value={formatNetCarbs(food.netCarbsPer100g)}
                variants={food.variants}
                last={index === items.length - 1}
              />
            ))
          )}
        </Section>
      )}
    </QueryBlock>
  );
}
