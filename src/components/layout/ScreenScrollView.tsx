import { Platform, ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';

export function ScreenScrollView({ style, contentContainerStyle, ...props }: ScrollViewProps) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      contentInsetAdjustmentBehavior="never"
      {...props}
      style={[styles.scroll, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
    />
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
});
