import * as Location from 'expo-location';

import type { TripLocation } from './model';

export class LocationPermissionError extends Error {
  constructor(public canAskAgain: boolean) {
    super('Location permission was denied. Allow location access or choose a place from the list.');
  }
}

export async function getDeviceLocation(): Promise<TripLocation> {
  let permission = await Location.getForegroundPermissionsAsync();
  if (!permission.granted && permission.canAskAgain) {
    permission = await Location.requestForegroundPermissionsAsync();
  }
  if (!permission.granted) throw new LocationPermissionError(permission.canAskAgain);
  if (!(await Location.hasServicesEnabledAsync())) {
    throw new Error('Location services are off. Turn them on, or select a location manually.');
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Finding your location took too long. Try again outdoors or select a location manually.')), 15000);
      }),
    ]);
    const { latitude, longitude } = position.coords;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error('Your device returned an unavailable position. Try again or choose a location manually.');
    }
    return {
      id: `current:${latitude.toFixed(6)},${longitude.toFixed(6)}`,
      title: 'Current location',
      address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      coordinates: { latitude, longitude },
      kind: 'current',
    };
  } finally {
    clearTimeout(timeout);
  }
}
