import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { radius, space } from '@/constant/theme';
import type { ScaleStep } from '@/types/check.types';
import { usePalette } from '@/hooks/use-theme';

export interface GlucoseLadderProps {
  scale: readonly ScaleStep[];
  /** The reading's step; matched to `scale` by label. */
  active: ScaleStep;
  glucoseMgDl: number;
}

/** Where inside its segment the reading falls; an open-ended top step uses a 100 mg/dL span. */
function positionInStep(step: ScaleStep, glucose: number): number {
  const span = (step.maxMgDl ?? step.minMgDl + 100) - step.minMgDl;
  return Math.min(0.92, Math.max(0.08, (glucose - step.minMgDl) / span));
}

function describeStep(step: ScaleStep): string {
  if (step.minMgDl === 0 && step.maxMgDl !== null) return `under ${step.maxMgDl}`;
  if (step.maxMgDl === null) return `${step.minMgDl} and above`;
  return `${step.minMgDl} to ${step.maxMgDl - 1}`;
}

/**
 * The model's glucose levels as one scale, each segment tinted by its clinical band, the
 * person's level filled and their reading marked.
 */
export function GlucoseLadder({ scale, active, glucoseMgDl }: GlucoseLadderProps) {
  const palette = usePalette();
  const index = scale.findIndex((s) => s.label === active.label);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Glucose level ${describeStep(active)} milligrams per decilitre, level ${index + 1} of ${scale.length}.`}
      style={styles.wrap}
    >
      <View style={styles.bar}>
        {scale.map((step) => {
          const isActive = step.label === active.label;
          const colors = palette.band[step.tone];
          return (
            <View key={step.label} style={[styles.segment, { backgroundColor: isActive ? colors.fill : colors.tint }]}>
              {isActive ? (
                <Animated.View
                  entering={FadeIn.duration(220)}
                  style={[
                    styles.marker,
                    {
                      left: `${positionInStep(step, glucoseMgDl) * 100}%`,
                      backgroundColor: palette.ink,
                      borderColor: palette.ground,
                    },
                  ]}
                />
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.ticks}>
        {scale.map((step) => (
          <AppText
            key={step.label}
            variant="caption"
            tone={step.label === active.label ? 'primary' : 'tertiary'}
            style={[styles.tick, step.label === active.label && styles.tickActive]}
            maxFontSizeMultiplier={1.3}
          >
            {step.minMgDl === 0 ? '' : step.minMgDl}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm, paddingTop: space.sm },
  bar: { flexDirection: 'row', gap: 3, height: 12 },
  segment: { flex: 1, borderRadius: radius.sm / 2 },
  marker: {
    position: 'absolute',
    top: -7,
    width: 6,
    height: 26,
    marginLeft: -3,
    borderRadius: 3,
    borderWidth: 1.5,
  },
  ticks: { flexDirection: 'row', gap: 3 },
  tick: { flex: 1, fontVariant: ['tabular-nums'], marginLeft: -2 },
  tickActive: { fontWeight: '600' },
});
