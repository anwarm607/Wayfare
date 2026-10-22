import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Keyboard, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { FeedbackModal } from '@/components/FeedbackModal';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BackIcon, CurrentLocationIcon, MapIcon } from '@/components/icons/LocationIcons';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Screen } from '@/components/layout/Screen';
import { ScreenFooter } from '@/components/layout/ScreenFooter';
import { ScreenScrollView } from '@/components/layout/ScreenScrollView';
import { useSession } from '@/context/SessionContext';
import { useTrip, useTripActions } from '@/context/TripContext';
import { LocationPairCard } from '@/features/trip/components/LocationPairCard';
import { LocationRow } from '@/features/trip/components/LocationRow';
import { suggestedLocations } from '@/features/trip/locations';
import { areSameLocation, filterLocations, validateTrip, type LocationField, type TripLocation } from '@/features/trip/model';
import { useCurrentLocation } from '@/features/trip/useCurrentLocation';
import { colors, layout } from '@/theme/tokens';

export default function SetLocationsScreen() {
  const trip = useTrip();
  const { setLocation, swapLocations, resetTrip } = useTripActions();
  const { session, setSession } = useSession();
  const { loading: isLocating, error: locationError, canOpenSettings, request: requestLocation, cancel: cancelLocation } = useCurrentLocation();
  const [activeField, setActiveField] = useState<LocationField>(trip.origin && !trip.destination ? 'destination' : 'origin');
  const [drafts, setDrafts] = useState({ origin: '', destination: '' });
  const values = {
    origin: trip.origin?.title ?? drafts.origin,
    destination: trip.destination?.title ?? drafts.destination,
  };
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [mapNotice, setMapNotice] = useState(false);
  const search = trip[activeField] ? '' : drafts[activeField];
  const results = filterLocations(suggestedLocations, search);
  const valid = validateTrip(trip) === null;

  function focusField(field: LocationField) {
    cancelLocation();
    setSelectionError(null);
    setActiveField(field);
  }

  function editField(field: LocationField, value: string) {
    focusField(field);
    setDrafts((previous) => ({ ...previous, [field]: value }));
    setLocation(field, null);
  }

  function selectLocation(location: TripLocation) {
    cancelLocation();
    const other = activeField === 'origin' ? trip.destination : trip.origin;
    if (areSameLocation(location, other)) {
      setSelectionError('Pickup and drop-off must be different locations.');
      return;
    }
    setSelectionError(null);
    setLocation(activeField, location);
    setDrafts((previous) => ({ ...previous, [activeField]: '' }));
    if (activeField === 'origin' && !trip.destination) setActiveField('destination');
    Keyboard.dismiss();
  }

  async function handleUseCurrentLocation() {
    Keyboard.dismiss();
    setSelectionError(null);
    const location = await requestLocation();
    if (location) selectLocation(location);
  }

  function handleSwapLocations() {
    cancelLocation();
    setSelectionError(null);
    swapLocations();
    setDrafts({ origin: '', destination: '' });
    Keyboard.dismiss();
  }

  function continueTrip() {
    const error = validateTrip(trip);
    if (error) { setSelectionError(error); return; }
    cancelLocation();
    Keyboard.dismiss();
    router.push('/trip-ready');
  }

  function backToLogin() {
    cancelLocation();
    setSession(null);
    resetTrip();
    router.replace('/');
  }

  if (!session) return <Redirect href="/" />;

  return (
    <Screen keyboardAvoiding>
      <View style={styles.header}>
        <ContentContainer style={styles.headerInner}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back to login" onPress={backToLogin} hitSlop={{ left: 8, right: 8 }} style={styles.back}><BackIcon /></Pressable>
          <View style={styles.headerCopy}>
            <AppText variant="screenTitle" accessibilityRole="header">Where are you going?</AppText>
            <AppText color="muted" style={styles.subtitle}>Step 1 of 2 · Set pickup and drop-off</AppText>
          </View>
        </ContentContainer>
      </View>
      <ScreenScrollView>
        <View style={styles.body}>
          <ContentContainer>
            <LocationPairCard activeField={activeField} values={values} onFocus={focusField} onChange={editField} onClear={(field) => editField(field, '')} onSwap={handleSwapLocations} />
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" accessibilityLabel="Use Current Location" accessibilityState={{ disabled: isLocating, busy: isLocating }} disabled={isLocating} onPress={handleUseCurrentLocation} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                {isLocating ? <ActivityIndicator size="small" color={colors.primary} /> : <CurrentLocationIcon />}
                <AppText variant="link">{isLocating ? 'Locating…' : 'Use current'}</AppText>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => { cancelLocation(); Keyboard.dismiss(); setMapNotice(true); }} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                <MapIcon /><AppText variant="link">Pick on map</AppText>
              </Pressable>
            </View>

            {!!(selectionError || locationError) && (
              <View style={styles.errorBox}>
                <AppText variant="small" color="error" accessibilityRole="alert" accessibilityLiveRegion="polite">{selectionError || locationError}</AppText>
                {canOpenSettings && Platform.OS !== 'web' && (
                  <Pressable accessibilityRole="button" onPress={() => { void Linking.openSettings().catch(() => setSelectionError('Open your device settings to allow location access for Wayfare.')); }} style={styles.settingsButton}>
                    <AppText variant="link" color="primary">Open settings</AppText>
                  </Pressable>
                )}
                {Platform.OS === 'web' && !!locationError && <AppText variant="caption" color="muted" style={styles.help}>You can change location access in your browser’s site settings or select a suggested place.</AppText>}
              </View>
            )}

            <AppText variant="sectionLabel" color="disabled" style={styles.sectionLabel}>{activeField === 'origin' ? 'Set as pickup' : 'Set as drop-off'}</AppText>
            <View style={styles.list}>
              {results.length ? results.map((location, index) => <LocationRow key={location.id} location={location} first={index === 0} onSelect={selectLocation} />) : (
                <AppText variant="small" color="muted" style={styles.empty}>No saved places match that. Try a different name or address, or use your current location.</AppText>
              )}
            </View>
          </ContentContainer>
        </View>
      </ScreenScrollView>
      <ScreenFooter><PrimaryButton label="Next" disabled={!valid} onPress={continueTrip} /></ScreenFooter>
      <FeedbackModal visible={mapNotice} title="Choose a location" message="Map picking is not included in this demo yet. Search the suggested places or use your current location to set your trip." actionLabel="Back to locations" onClose={() => setMapNotice(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: layout.plannerInset, paddingVertical: 12, minHeight: 88, justifyContent: 'center' },
  headerInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  headerCopy: { flex: 1, minWidth: 0 },
  back: { width: 28, height: 44, alignItems: 'center', justifyContent: 'center' },
  subtitle: { lineHeight: 22.5, marginTop: 4 },
  body: { flexGrow: 1, paddingHorizontal: layout.plannerInset, paddingTop: 20, paddingBottom: 20 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  secondaryButton: { flex: 1, minHeight: 51, paddingVertical: 12, paddingHorizontal: 8, borderRadius: layout.controlRadius, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0px 1px 2px rgba(17,31,44,0.04)' },
  pressed: { opacity: 0.65 },
  sectionLabel: { marginTop: 28, marginBottom: 12 },
  list: { backgroundColor: colors.surface, borderRadius: layout.cardRadius, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', boxShadow: '0px 1px 2px rgba(17,31,44,0.04)' },
  empty: { textAlign: 'center', paddingVertical: 24, paddingHorizontal: 20 },
  errorBox: { marginTop: 16 },
  help: { marginTop: 6 },
  settingsButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
});
