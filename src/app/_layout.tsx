import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider } from '@/context/SessionContext';
import { TripProvider } from '@/context/TripContext';
import { colors } from '@/theme/tokens';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NunitoSansRegular: require('../../assets/fonts/NunitoSans-Regular.ttf'),
    NunitoSansSemiBold: require('../../assets/fonts/NunitoSans-SemiBold.ttf'),
    NunitoSansBold: require('../../assets/fonts/NunitoSans-Bold.ttf'),
    NunitoSansExtraBold: require('../../assets/fonts/NunitoSans-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;
  if (error) {
    return <View style={styles.error}><Text>Unable to load the app fonts. Restart Wayfare to try again.</Text></View>;
  }

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <TripProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
        </TripProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background },
});
