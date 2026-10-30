import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { DismissibleModal } from '@/components/ui/dismissible-modal';
import { DISCLAIMER } from '@/constant/input-rules';
import { ELIGIBILITY_NOTICE } from '@/constant/eligibility-notice';
import { space } from '@/constant/theme';

export interface EligibilityNoticeModalProps {
  visible: boolean;
  onClose: () => void;
}

/** Tells people who the suggestions were built for, before they rely on them. */
export function EligibilityNoticeModal({ visible, onClose }: EligibilityNoticeModalProps) {
  return (
    <DismissibleModal visible={visible} onClose={onClose} title={ELIGIBILITY_NOTICE.title}>
      <AppText variant="body" tone="secondary">
        {ELIGIBILITY_NOTICE.intro}
      </AppText>
      <View style={styles.list}>
        {ELIGIBILITY_NOTICE.criteria.map((criterion) => (
          <View key={criterion} style={styles.item}>
            <AppText variant="body" tone="accent" importantForAccessibility="no">
              •
            </AppText>
            <AppText variant="body" style={styles.criterion}>
              {criterion}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="body" tone="secondary">
        {ELIGIBILITY_NOTICE.outro}
      </AppText>
      <AppText variant="footnote" tone="tertiary">
        {DISCLAIMER}
      </AppText>
    </DismissibleModal>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
  item: { flexDirection: 'row', gap: space.md },
  criterion: { flex: 1 },
});
