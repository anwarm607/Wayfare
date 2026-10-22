import { useRef, type ComponentRef } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ClearIcon, SwapIcon } from '@/components/icons/LocationIcons';
import type { LocationField } from '@/features/trip/model';
import { colors, fonts, layout } from '@/theme/tokens';

type Props = {
  activeField: LocationField;
  values: Record<LocationField, string>;
  onFocus: (field: LocationField) => void;
  onChange: (field: LocationField, value: string) => void;
  onClear: (field: LocationField) => void;
  onSwap: () => void;
};

export function LocationPairCard({ activeField, values, onFocus, onChange, onClear, onSwap }: Props) {
  const destinationRef = useRef<ComponentRef<typeof TextInput>>(null);
  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={styles.markers}>
        <View style={styles.originDot} />
        <View style={styles.line} />
        <View style={styles.destinationDot} />
      </View>
      {(['origin', 'destination'] as const).map((field) => (
        <View key={field}>
          {field === 'destination' && <View style={styles.divider} />}
          <AppText variant="locationLabel" color={activeField === field ? 'primary' : 'disabled'}>{field === 'origin' ? 'Pickup' : 'Drop-off'}</AppText>
          <View style={styles.inputRow}>
            <TextInput
              ref={field === 'destination' ? destinationRef : undefined}
              accessibilityLabel={field === 'origin' ? 'Pickup location' : 'Drop-off location'}
              accessibilityHint="Search the suggested and recent locations, then select a result."
              value={values[field]}
              placeholder={field === 'origin' ? 'Choose a starting point' : 'Choose a destination'}
              placeholderTextColor={colors.placeholder}
              onFocus={() => onFocus(field)}
              onChangeText={(value) => onChange(field, value)}
              autoCorrect={false}
              selectTextOnFocus
              autoComplete="off"
              selectionColor={colors.primary}
              returnKeyType={field === 'origin' ? 'next' : 'done'}
              submitBehavior={field === 'origin' ? 'submit' : 'blurAndSubmit'}
              onSubmitEditing={() => field === 'origin' ? destinationRef.current?.focus() : Keyboard.dismiss()}
              underlineColorAndroid="transparent"
              style={styles.input}
            />
            {!!values[field] && (
              <Pressable accessibilityRole="button" accessibilityLabel={`Clear ${field === 'origin' ? 'pickup' : 'drop-off'}`} onPress={() => onClear(field)} style={styles.clear} hitSlop={{ left: 8, right: 8, top: 6, bottom: 6 }}>
                <ClearIcon />
              </Pressable>
            )}
          </View>
        </View>
      ))}
      <Pressable accessibilityRole="button" accessibilityLabel="Swap pickup and drop-off" onPress={onSwap} style={({ pressed }) => [styles.swap, pressed && styles.pressed]} hitSlop={2}>
        <SwapIcon />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 187, paddingLeft: 38, paddingRight: 68, paddingVertical: 26, borderRadius: layout.cardRadius, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, boxShadow: '0px 1px 2px rgba(17,31,44,0.04)' },
  markers: { position: 'absolute', left: 16, top: 38, bottom: 16, alignItems: 'center', width: 10 },
  originDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 4 },
  destinationDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.text },
  inputRow: { flexDirection: 'row', alignItems: 'center', minHeight: 32 },
  input: { flex: 1, minWidth: 0, minHeight: 32, padding: 0, fontFamily: fonts.bold, fontSize: 15, lineHeight: 22.5, color: colors.text, includeFontPadding: false },
  clear: { width: 28, height: 32, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 15 },
  swap: { position: 'absolute', right: 16, top: 38, width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  pressed: { opacity: 0.65 },
});
