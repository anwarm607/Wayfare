import { StyleSheet, View, type ViewProps } from 'react-native';

import { layout } from '@/theme/tokens';

type Props = ViewProps & { maxWidth?: number };

export function ContentContainer({ maxWidth = layout.contentWidth, style, ...props }: Props) {
  return <View {...props} style={[styles.container, { maxWidth }, style]} />;
}

const styles = StyleSheet.create({
  container: { width: '100%', alignSelf: 'center' },
});
