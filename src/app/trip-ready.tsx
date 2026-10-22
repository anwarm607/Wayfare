import { Redirect, router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Screen } from '@/components/layout/Screen';
import { useSession } from '@/context/SessionContext';
import { useTrip } from '@/context/TripContext';
import { validateTrip } from '@/features/trip/model';

export default function TripReadyPlaceholder() {
  const { session } = useSession();
  const trip = useTrip();
  if (!session) return <Redirect href="/" />;
  if (validateTrip(trip)) return <Redirect href="/set-locations" />;
  return (
    <Screen edges={['top', 'left', 'right', 'bottom']} style={styles.screen}>
      <ContentContainer style={styles.content}>
        <AppText variant="screenTitle" accessibilityRole="header">Trip Ready</AppText>
        <AppText color="muted">Your locations are saved. This screen will be implemented next.</AppText>
        <AppText color="muted">Pickup: {trip.origin?.title}{'\n'}Drop-off: {trip.destination?.title}</AppText>
        <PrimaryButton label="Edit locations" onPress={() => router.canGoBack() ? router.back() : router.replace('/set-locations')} />
      </ContentContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center', padding: 24 },
  content: { gap: 24 },
});
