import * as Haptics from 'expo-haptics';

/**
 * One haptic per user action, fired in the same frame as the visual change, never the only
 * feedback. Failures are swallowed: many devices have haptics off or no actuator at all.
 */
export const haptics = {
  selection: () => void Haptics.selectionAsync().catch(() => {}),
  success: () => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  error: () => void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}),
};
