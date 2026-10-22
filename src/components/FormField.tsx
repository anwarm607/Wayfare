import { useId, useState, type ComponentRef, type ReactNode, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, layout, typography } from '@/theme/tokens';

type Props = TextInputProps & {
  label: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingAction?: ReactNode;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

export function FormField({ label, error, leadingIcon, trailingAction, ref, onFocus, onBlur, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  const labelId = useId();

  return (
    <View>
      <AppText variant="label" nativeID={labelId} style={styles.label}>{label}</AppText>
      <View style={[styles.container, focused && styles.focused, !!error && styles.invalid]}>
        {leadingIcon && <View pointerEvents="none" style={styles.leading}>{leadingIcon}</View>}
        <TextInput
          {...input}
          ref={ref}
          accessibilityLabel={label}
          aria-labelledby={labelId}
          accessibilityHint={error}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          onFocus={(event) => { setFocused(true); onFocus?.(event); }}
          onBlur={(event) => { setFocused(false); onBlur?.(event); }}
          style={[styles.input, trailingAction ? styles.withTrailing : undefined]}
        />
        {trailingAction && <View style={styles.trailing}>{trailingAction}</View>}
      </View>
      {error && <AppText variant="small" color="error" accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { minHeight: 24, marginBottom: 8 },
  container: {
    minHeight: 54,
    borderRadius: layout.controlRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 1px 2px rgba(17, 31, 44, 0.04)',
    justifyContent: 'center',
  },
  focused: { borderColor: colors.primary },
  invalid: { borderColor: colors.error },
  input: {
    ...typography.input,
    color: colors.text,
    minHeight: 52,
    paddingVertical: 14,
    paddingLeft: 44,
    paddingRight: 16,
    borderRadius: layout.controlRadius,
    includeFontPadding: false,
  },
  withTrailing: { paddingRight: 48 },
  leading: { position: 'absolute', left: 14, width: 20, alignItems: 'center' },
  trailing: { position: 'absolute', right: 4, top: 4, bottom: 4, justifyContent: 'center' },
  error: { marginTop: 6 },
});
