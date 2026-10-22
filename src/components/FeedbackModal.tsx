import { Modal, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/tokens';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  actionLabel: string;
  onClose: () => void;
};

export function FeedbackModal({ visible, title, message, actionLabel, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.card}>
          <ScrollView contentContainerStyle={styles.content}>
            <AppText variant="dialogTitle" accessibilityRole="header">{title}</AppText>
            <AppText color="muted" style={styles.message}>{message}</AppText>
            <PrimaryButton label={actionLabel} onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, maxHeight: '100%', alignSelf: 'center', borderRadius: 24, backgroundColor: colors.surface, overflow: 'hidden' },
  content: { padding: 24 },
  message: { marginTop: 12, marginBottom: 24 },
});
