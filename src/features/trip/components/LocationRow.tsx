import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { HomeIcon, RecentIcon } from '@/components/icons/LocationIcons';
import type { TripLocation } from '@/features/trip/model';
import { colors } from '@/theme/tokens';

export function LocationRow({ location, onSelect, first }: { location: TripLocation; onSelect: (location: TripLocation) => void; first: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${location.title}, ${location.address}`}
      onPress={() => onSelect(location)}
      style={({ pressed }) => [styles.row, !first && styles.separator, pressed && styles.pressed]}
    >
      <View style={styles.icon}>{location.kind === 'saved' ? <HomeIcon /> : <RecentIcon />}</View>
      <View style={styles.copy}>
        <AppText variant="label" numberOfLines={1}>{location.title}</AppText>
        <AppText variant="caption" color="muted" numberOfLines={1}>{location.address}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 73, paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  separator: { borderTopWidth: 1, borderTopColor: colors.border },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0 },
  pressed: { backgroundColor: colors.background },
});
