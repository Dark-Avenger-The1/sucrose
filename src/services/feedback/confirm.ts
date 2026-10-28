import { Alert } from 'react-native';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
}

/** Native alert with Cancel as the safe default. Resolves `true` only on confirm. */
export function confirm({ title, message, confirmLabel, destructive }: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
