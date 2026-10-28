import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { radius } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

const SIZE = 40;

/** Product photo for Open Food Facts items. Model food groups have none and show nothing. */
export function FoodThumbnail({ uri }: { uri: string }) {
  const palette = usePalette();
  return (
    <Image
      source={{ uri }}
      style={[styles.image, { backgroundColor: palette.surfacePressed }]}
      contentFit="cover"
      transition={120}
      accessibilityIgnoresInvertColors
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  image: { width: SIZE, height: SIZE, borderRadius: radius.sm },
});
