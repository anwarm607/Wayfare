import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';

import { colors } from '@/theme/tokens';

type Props = SafeAreaViewProps & {
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
};

// Bottom spacing belongs to ScreenFooter for form screens. Screens without a
// footer can opt into the bottom edge through the standard `edges` prop.
export function Screen({ children, style, edges = ['top', 'left', 'right'], keyboardAvoiding = false, keyboardVerticalOffset = 0, ...props }: Props) {
  return (
    <SafeAreaView {...props} edges={edges} style={[styles.screen, style]}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
          {children}
        </KeyboardAvoidingView>
      ) : children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
});
