import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { radius, space, touchTarget } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

import { AppText } from './app-text';
import { Icon } from './icon';
import { PressableScale } from './pressable-scale';

export interface DismissibleModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Centred card over a dimmed backdrop. Closes from the X button, a tap anywhere on the screen
 * (backdrop or card), or the Android back button. Content is supplied by the caller.
 */
export function DismissibleModal({ visible, onClose, title, children }: DismissibleModalProps) {
  const palette = usePalette();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Not an accessibility element itself, so screen readers reach the card and its close button. */}
      <Pressable accessible={false} onPress={onClose} style={[styles.scrim, { backgroundColor: palette.scrim }]}>
        <View
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: palette.ground, borderColor: palette.border }]}
        >
          <View style={styles.header}>
            <AppText variant="title" accessibilityRole="header" style={styles.title}>
              {title}
            </AppText>
            <PressableScale
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={space.sm}
              style={styles.close}
            >
              <Icon name="close" size={16} color={palette.inkSecondary} />
            </PressableScale>
          </View>
          <ScrollView bounces={false} contentContainerStyle={styles.body}>
            {children}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: space.xl,
    gap: space.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
  },
  title: { flex: 1 },
  close: {
    width: touchTarget,
    height: touchTarget,
    marginTop: -space.sm,
    marginRight: -space.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { gap: space.lg },
});
