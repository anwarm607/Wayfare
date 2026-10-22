import type { ComponentRef, Ref } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, typography, type ColorToken, type TypographyVariant } from '@/theme/tokens';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
  ref?: Ref<ComponentRef<typeof Text>>;
};

// Preserve native text props, accessibility and font scaling. Style overrides
// are last so callers can adjust spacing or an intentional design exception.
export function AppText({ variant = 'body', color = 'text', style, ...props }: AppTextProps) {
  return <Text {...props} style={[styles[variant], { color: colors[color] }, style]} />;
}

const styles = StyleSheet.create(typography);
