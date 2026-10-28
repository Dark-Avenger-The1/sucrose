import { ListRow } from '@/components/ui/list-row';
import { QueryBlock } from '@/components/ui/query-block';
import { Section } from '@/components/ui/section';
import type { CheckInput } from '@/types/check.types';
import { useCombos } from '@/hooks/use-suggestions';

/** `SucroseService.getCombos`: foods that are often eaten together at this level. */
export function ComboListView({ input }: { input: CheckInput }) {
  const combos = useCombos(input);
  return (
    <QueryBlock query={combos} subject="the combos" skeletonRows={4}>
      {(items) => (
        <Section title="Often eaten together">
          {items.length === 0 ? (
            <ListRow title="No combos at this level." last />
          ) : (
            items.map((combo, index) => (
              <ListRow key={combo.foods.join('+')} title={combo.foods.join(' + ')} last={index === items.length - 1} />
            ))
          )}
        </Section>
      )}
    </QueryBlock>
  );
}
