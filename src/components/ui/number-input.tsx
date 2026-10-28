import { useState, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { radius, space, type } from '@/constant/theme';
import { usePalette } from '@/hooks/use-theme';

import { AppText } from './app-text';

export interface NumberInputProps
  extends Pick<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'onSubmitEditing' | 'returnKeyType' | 'placeholder'> {
  accessibilityLabel: string;
  accessibilityHint?: string;
  /** Shown inside the field, after the value: "mg/dL", "years". */
  suffix?: string;
  decimal?: boolean;
  invalid?: boolean;
  ref?: Ref<TextInputInstance>;
}

export function NumberInput({ suffix, decimal, invalid, onBlur, ref, ...rest }: NumberInputProps) {
  const palette = usePalette();
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? palette.danger : focused ? palette.accent : palette.border;

  return (
    <View style={[styles.box, { backgroundColor: palette.surface, borderColor }]}>
      <TextInput
        ref={ref}
        {...rest}
        keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
        inputMode={decimal ? 'decimal' : 'numeric'}
        autoComplete="off"
        autoCorrect={false}
        maxLength={6}
        selectionColor={palette.accent}
        placeholderTextColor={palette.inkTertiary}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[type.input, styles.input, { color: palette.ink }, !rest.value && styles.placeholder]}
      />
      {suffix ? (
        <AppText variant="callout" tone="secondary" importantForAccessibility="no" accessibilityElementsHidden>
          {suffix}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    minHeight: 64,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: space.md,
    // The box's accent border is the focus indicator; drop the browser's second ring on web.
    outlineWidth: 0,
  },
  /** An example in the body weight so it never reads as an entered value. */
  placeholder: { fontWeight: '400' },
});
