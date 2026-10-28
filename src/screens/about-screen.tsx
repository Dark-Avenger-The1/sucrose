import { AppText } from '@/components/ui/app-text';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { DISCLAIMER } from '@/domain/input-rules';

/** What the app does and its limits. */
export function AboutScreen() {
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
      <AppText variant="footnote" tone="secondary">
        {DISCLAIMER} Talk to a doctor or dietitian before changing what you eat, especially if you take
        medication for blood sugar.
      </AppText>
    </ScreenScroll>
  );
}
