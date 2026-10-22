import { useRef, useState, type ComponentRef } from 'react';
import { Controller } from 'react-hook-form';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { FeedbackModal } from '@/components/FeedbackModal';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BrandRouteIcon, EmailIcon, EyeIcon, LockIcon } from '@/components/icons/LoginIcons';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Screen } from '@/components/layout/Screen';
import { ScreenFooter } from '@/components/layout/ScreenFooter';
import { ScreenScrollView } from '@/components/layout/ScreenScrollView';
import { useLoginForm } from '@/features/auth/useLoginForm';
import { colors, layout } from '@/theme/tokens';

export default function LoginScreen() {
  const { control, errors, isSubmitting, mode, showPassword, onSubmit, switchMode, togglePassword, clearRequestError } = useLoginForm();
  const [recoveryNotice, setRecoveryNotice] = useState(false);
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);

  const primaryLabel = mode === 'login' ? 'Log in' : 'Create account';

  return (
    <Screen keyboardAvoiding>
      <ScreenScrollView>
        <View style={styles.main}>
          <ContentContainer maxWidth={layout.loginContentWidth}>
            <View style={styles.brand} accessibilityLabel="Wayfare" accessibilityRole="image"><BrandRouteIcon /></View>
            <AppText variant="hero" accessibilityRole="header">{mode === 'login' ? 'Welcome back' : 'Create an account'}</AppText>
            <AppText color="muted" style={styles.subtitle}>{mode === 'login' ? 'Log in to plan a trip and follow your route turn by turn.' : 'Create a demo account to start planning your next trip.'}</AppText>

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <FormField
                    ref={ref}
                    label="Email"
                    placeholder="you@example.com"
                    leadingIcon={<EmailIcon />}
                    value={value}
                    onChangeText={(text) => { clearRequestError(); onChange(text); }}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    editable={!isSubmitting}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <FormField
                    ref={(input) => { ref(input); passwordRef.current = input; }}
                    label="Password"
                    placeholder="Enter your password"
                    leadingIcon={<LockIcon />}
                    value={value}
                    onChangeText={(text) => { clearRequestError(); onChange(text); }}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    textContentType={mode === 'register' ? 'newPassword' : 'password'}
                    secureTextEntry={!showPassword}
                    returnKeyType="go"
                    onSubmitEditing={onSubmit}
                    editable={!isSubmitting}
                    trailingAction={
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                        accessibilityState={{ disabled: isSubmitting }}
                        disabled={isSubmitting}
                        onPress={togglePassword}
                        style={styles.eyeButton}
                      ><EyeIcon /></Pressable>
                    }
                  />
                )}
              />
            </View>

            {mode === 'login' ? (
              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={() => { Keyboard.dismiss(); setRecoveryNotice(true); }}
                style={({ pressed }) => [styles.forgot, pressed && styles.pressed]}
              ><AppText variant="link" color="primary">Forgot password?</AppText></Pressable>
            ) : <AppText variant="small" color="muted" style={styles.registrationHint}>Demo only. Use any email and a password of at least 8 characters.</AppText>}

            {errors.root?.message && <AppText variant="small" color="error" accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.requestError}>{errors.root.message}</AppText>}
          </ContentContainer>
        </View>

        <ScreenFooter inset={layout.loginInset} maxWidth={layout.loginContentWidth}>
          <PrimaryButton label={primaryLabel} onPress={onSubmit} loading={isSubmitting} />
          <View style={styles.accountRow}>
            <AppText variant="small" color="muted">{mode === 'login' ? 'New to Wayfare?' : 'Already have an account?'}</AppText>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={switchMode}
              hitSlop={10}
              style={({ pressed }) => pressed && styles.pressed}
            ><AppText variant="link">{mode === 'login' ? 'Create an account' : 'Log in'}</AppText></Pressable>
          </View>
        </ScreenFooter>
      </ScreenScrollView>
      <FeedbackModal
        visible={recoveryNotice}
        title="Demo password help"
        message="No password reset is needed for this demo. Log in with any valid email and a password of at least 8 characters. No email will be sent."
        actionLabel="Got it"
        onClose={() => setRecoveryNotice(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: { flexGrow: 1, paddingHorizontal: layout.loginInset, paddingTop: 40, paddingBottom: 32 },
  brand: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  subtitle: { marginTop: 8 },
  form: { marginTop: 28, gap: 16 },
  eyeButton: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  forgot: { alignSelf: 'flex-start', paddingVertical: 10, marginTop: 10, minHeight: 44, justifyContent: 'center' },
  registrationHint: { marginTop: 20 },
  requestError: { marginTop: 16 },
  accountRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', columnGap: 3, marginTop: 16 },
  pressed: { opacity: 0.65 },
});
