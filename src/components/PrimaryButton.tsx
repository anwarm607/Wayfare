import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, layout } from '@/theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, loading = false, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && styles.pressed]}
    >
      {loading ? <ActivityIndicator color={colors.surface} /> : <AppText variant="action" color={disabled ? 'disabled' : 'surface'} style={styles.label}>{label}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: layout.controlRadius,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { textAlign: 'center' },
  disabled: { backgroundColor: colors.border },
  pressed: { opacity: 0.8 },
});
