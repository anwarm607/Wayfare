export type Coordinates = { latitude: number; longitude: number };
export type TripLocation = {
  id: string;
  title: string;
  address: string;
  coordinates: Coordinates;
  kind: 'saved' | 'recent' | 'current';
};
export type LocationField = 'origin' | 'destination';
export type TripState = Record<LocationField, TripLocation | null>;
export type TripAction =
  | { type: 'select'; field: LocationField; location: TripLocation | null }
  | { type: 'swap' }
  | { type: 'reset' };

export const initialTrip: TripState = { origin: null, destination: null };

export function areSameLocation(a: TripLocation | null, b: TripLocation | null) {
  if (!a || !b) return false;
  return a.id === b.id || (
    Math.abs(a.coordinates.latitude - b.coordinates.latitude) < 0.00001 &&
    Math.abs(a.coordinates.longitude - b.coordinates.longitude) < 0.00001
  );
}

export function validateTrip(trip: TripState): string | null {
  if (!trip.origin || !trip.destination) return 'Select both a pickup and a drop-off location.';
  if (areSameLocation(trip.origin, trip.destination)) return 'Pickup and drop-off must be different locations.';
  return null;
}

export function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'select': {
      // Editing an uncommitted search must not broadcast a new shared trip.
      if (state[action.field] === action.location) return state;
      const other = action.field === 'origin' ? state.destination : state.origin;
      // Keep shared state valid even when a caller bypasses screen validation.
      if (areSameLocation(action.location, other)) return state;
      return { ...state, [action.field]: action.location };
    }
    case 'swap': return state.origin === state.destination ? state : { origin: state.destination, destination: state.origin };
    case 'reset': return !state.origin && !state.destination ? state : initialTrip;
  }
}

export function filterLocations(locations: readonly TripLocation[], query: string) {
  const search = query.trim().toLowerCase();
  return locations.filter((location) => `${location.title} ${location.address}`.toLowerCase().includes(search));
}
