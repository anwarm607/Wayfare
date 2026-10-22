import { createContext, useContext, useReducer, type ReactNode } from 'react';

import { initialTrip, tripReducer, type LocationField, type TripLocation, type TripState } from '@/features/trip/model';

type TripActions = {
  setLocation: (field: LocationField, location: TripLocation | null) => void;
  swapLocations: () => void;
  resetTrip: () => void;
};

const TripStateContext = createContext<TripState | null>(null);
const TripActionsContext = createContext<TripActions | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, dispatch] = useReducer(tripReducer, initialTrip);
  // Keep action subscriptions separate from trip state. React Compiler handles
  // caching this object and its functions, which depend only on stable dispatch.
  const actions: TripActions = {
    setLocation: (field, location) => dispatch({ type: 'select', field, location }),
    swapLocations: () => dispatch({ type: 'swap' }),
    resetTrip: () => dispatch({ type: 'reset' }),
  };
  return (
    <TripActionsContext value={actions}>
      <TripStateContext value={trip}>{children}</TripStateContext>
    </TripActionsContext>
  );
}

export function useTrip() {
  const value = useContext(TripStateContext);
  if (!value) throw new Error('useTrip must be used inside TripProvider.');
  return value;
}

export function useTripActions() {
  const value = useContext(TripActionsContext);
  if (!value) throw new Error('useTripActions must be used inside TripProvider.');
  return value;
}
