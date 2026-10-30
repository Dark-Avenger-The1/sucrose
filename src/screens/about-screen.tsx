import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { DISCLAIMER } from '@/constant/input-rules';
import { useEligibilityNotice } from '@/context/eligibility-notice-context';

/** What the app does and its limits. */
export function AboutScreen() {
  const notice = useEligibilityNotice();

  return (
    <ScreenScroll>
      <AppText variant="body">
        Sucrose suggests foods and a day’s meal plan from your blood sugar, age and gender, using foods that
        adults like you commonly eat and that fit your glucose level’s sugar and carb limits.
      </AppText>
      <AppText variant="body" tone="secondary">
        The suggestions come from frequent-pattern mining (ECLAT) on NHANES 2017–2018 food records from
        1,885 adults without diagnosed diabetes.
      </AppText>
      <Button
        label="Who are the suggestions for?"
        variant="secondary"
        onPress={notice.show}
        accessibilityHint="Opens a notice about who these food suggestions are designed for"
      />
      <AppText variant="footnote" tone="secondary">
        {DISCLAIMER} Talk to a doctor or dietitian before changing what you eat, especially if you take
        medication for blood sugar.
      </AppText>
    </ScreenScroll>
  );
}
