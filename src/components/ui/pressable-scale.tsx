import { useState } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion, type CSSStyle } from 'react-native-reanimated';

import { motion } from '@/constant/theme';

const pressTransition = {
  transitionProperty: ['transform', 'opacity'],
  transitionDuration: motion.press.duration,
  transitionTimingFunction: motion.press.easing,
} satisfies CSSStyle<ViewStyle>;

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. Rows use a gentler value than buttons. */
  pressedScale?: number;
}

/**
 * Press feedback on press-in, commit on press-out. A two-state change, so it is a Reanimated
 * CSS transition on the UI thread, not a worklet. Reduced motion keeps the dim, drops the scale.
 */
export function PressableScale({ children, style, pressedScale = 0.97, disabled, ...rest }: PressableScaleProps) {
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = pressed && !disabled;

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={(event) => {
        setPressed(true);
        rest.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        rest.onPressOut?.(event);
      }}
      pressRetentionOffset={{ top: 16, bottom: 16, left: 16, right: 16 }}
    >
      {(state) => (
        <Animated.View
          style={[
            style,
            {
              opacity: active && reduceMotion ? 0.7 : 1,
              transform: [{ scale: active && !reduceMotion ? pressedScale : 1 }],
              ...pressTransition,
            } satisfies CSSStyle<ViewStyle>,
          ]}
        >
          {typeof children === 'function' ? children(state) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}
