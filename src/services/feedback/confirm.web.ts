import type { ConfirmOptions } from './confirm';

/** React Native Web has no `Alert.alert`; the browser's own dialog is the honest equivalent. */
export function confirm({ title, message }: ConfirmOptions): Promise<boolean> {
  return Promise.resolve(globalThis.confirm?.(`${title}\n\n${message}`) ?? false);
}
