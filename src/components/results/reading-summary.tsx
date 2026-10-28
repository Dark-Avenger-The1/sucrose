import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { BandPill } from '@/components/ui/band-pill';
import { Notice } from '@/components/ui/notice';
import { QueryBlock } from '@/components/ui/query-block';
import { space } from '@/constant/theme';
import type { CheckInput } from '@/types/check.types';
import { bandLabel } from '@/utils/format';
import { useAssessment } from '@/hooks/use-suggestions';

import { GlucoseLadder } from './glucose-ladder';

/**
 * The reading (known at once from the input), then what it means from the data source: band,
 * where it sits on the glucose scale, and the safety note when one applies.
 */
export function ReadingSummary({ input }: { input: CheckInput }) {
  const assessment = useAssessment(input);
  return (
    <View style={styles.wrap}>
      <View style={styles.figureRow} accessible accessibilityLabel={`${input.glucoseMgDl} milligrams per decilitre`}>
        <AppText variant="figure" maxFontSizeMultiplier={1.4}>
          {input.glucoseMgDl}
        </AppText>
        <AppText variant="headline" tone="secondary">
          mg/dL
        </AppText>
      </View>
      <QueryBlock query={assessment} subject="what this reading means" skeletonRows={1}>
        {({ band, level, scale, notices }) => (
          <View style={styles.wrap}>
            <BandPill tone={band.tone} label={bandLabel(band)} />
            <GlucoseLadder scale={scale} active={level} glucoseMgDl={input.glucoseMgDl} />
            {notices.map((notice) => (
              <Notice key={notice.message} notice={notice} />
            ))}
          </View>
        )}
      </QueryBlock>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  figureRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm },
});
