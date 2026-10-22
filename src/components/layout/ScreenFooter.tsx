import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContentContainer } from '@/components/layout/ContentContainer';
import { colors, layout } from '@/theme/tokens';

type Props = ViewProps & { inset?: number; maxWidth?: number };

export function ScreenFooter({ children, inset = layout.plannerInset, maxWidth = layout.contentWidth, style, ...props }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View {...props} style={[styles.footer, { paddingHorizontal: inset, paddingBottom: Math.max(insets.bottom, layout.footerBottomSpace) }, style]}>
      <ContentContainer maxWidth={maxWidth}>{children}</ContentContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
});
