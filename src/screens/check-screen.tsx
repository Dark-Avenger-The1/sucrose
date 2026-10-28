import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { space } from '@/constant/theme';
import type { GlucoseUnit } from '@/utils/glucose';
import { DISCLAIMER, INPUT_RULES, type Gender } from '@/constant/input-rules';
import { formatGlucoseRange } from '@/utils/validation';
import { useCheckForm } from '@/hooks/use-check-form';
import { ROUTES, toParams, type CheckNav } from '@/constant/routes';
import { useHistory } from '@/context/services-context';
import { haptics } from '@/services/feedback/haptics';

const UNITS = [
  { value: 'mg/dL', label: 'mg/dL' },
  { value: 'mmol/L', label: 'mmol/L' },
] as const satisfies readonly { value: GlucoseUnit; label: string }[];

const GENDERS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
] as const satisfies readonly { value: Gender; label: string }[];

/** One question: "What should I eat at this blood sugar?" Three inputs, one action. */
export function CheckScreen() {
  const navigation = useNavigation<CheckNav>();
  const history = useHistory();
  const form = useCheckForm(INPUT_RULES);
  const ageRef = useRef<TextInputInstance>(null);

  function handleSubmit() {
    const input = form.submit();
    if (!input) {
      haptics.error();
      return;
    }
    haptics.success();
    history.add(input);
    navigation.push(ROUTES.checkResults, toParams(input));
  }

  return (
    <ScreenScroll>
      <AppText variant="body" tone="secondary">
        Enter a blood sugar reading to get a meal plan and foods suited to that level.
      </AppText>

      <View style={styles.form}>
        <FormField
          label="Blood sugar"
          hint={`Any reading from your meter, ${formatGlucoseRange(INPUT_RULES, form.draft.unit)}.`}
          error={form.errors.glucoseMgDl}
        >
          <NumberInput
            accessibilityLabel={`Blood sugar in ${form.draft.unit}`}
            value={form.draft.glucose}
            onChangeText={form.setGlucose}
            onBlur={() => form.touch('glucoseMgDl')}
            onSubmitEditing={() => ageRef.current?.focus()}
            returnKeyType="next"
            placeholder={form.draft.unit === 'mg/dL' ? 'e.g. 110' : 'e.g. 6.1'}
            suffix={form.draft.unit}
            decimal={form.draft.unit === 'mmol/L'}
            invalid={!!form.errors.glucoseMgDl}
          />
          <SegmentedControl
            accessibilityLabel="Blood sugar unit"
            options={UNITS}
            value={form.draft.unit}
            onChange={form.setUnit}
          />
        </FormField>

        <FormField label="Age" hint={`${INPUT_RULES.minAge} or older.`} error={form.errors.age}>
          <NumberInput
            ref={ageRef}
            accessibilityLabel="Age in years"
            value={form.draft.age}
            onChangeText={form.setAge}
            onBlur={() => form.touch('age')}
            returnKeyType="done"
            placeholder="e.g. 35"
            suffix="years"
            invalid={!!form.errors.age}
          />
        </FormField>

        <FormField label="Gender" error={form.errors.gender}>
          <SegmentedControl
            accessibilityLabel="Gender"
            options={GENDERS}
            value={form.draft.gender}
            onChange={form.setGender}
            invalid={!!form.errors.gender}
          />
        </FormField>
      </View>

      <View style={styles.actions}>
        <Button label="Show food suggestions" onPress={handleSubmit} />
        <AppText variant="footnote" tone="tertiary">
          {DISCLAIMER}
        </AppText>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  form: { gap: space.xl },
  actions: { gap: space.lg },
});
