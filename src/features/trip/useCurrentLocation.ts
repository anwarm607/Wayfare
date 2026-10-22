import { useEffect, useRef, useState } from 'react';

import { getDeviceLocation, LocationPermissionError } from './currentLocation';

type RequestState =
  | { status: 'idle' | 'loading' }
  | { status: 'error'; message: string; canOpenSettings: boolean };

const idleState: RequestState = { status: 'idle' };

export function useCurrentLocation() {
  const generation = useRef(0);
  const inFlight = useRef(false);
  const [state, setState] = useState<RequestState>(idleState);

  useEffect(() => () => { generation.current += 1; inFlight.current = false; }, []);

  // Expo's one-shot position request is not cancellable. Ignore its result if
  // the user edits a field, selects a suggestion, or leaves the screen.
  function cancel() {
    generation.current += 1;
    inFlight.current = false;
    // Reuse the idle object: focusing/typing while idle needs no status update.
    setState(idleState);
  }

  async function request() {
    if (inFlight.current) return null;
    inFlight.current = true;
    const token = ++generation.current;
    setState({ status: 'loading' });
    try {
      const location = await getDeviceLocation();
      if (token !== generation.current) return null;
      setState(idleState);
      return location;
    } catch (cause) {
      if (token === generation.current) {
        setState({
          status: 'error',
          message: cause instanceof Error ? cause.message : 'Unable to find your location. Try again or select a place manually.',
          canOpenSettings: cause instanceof LocationPermissionError && !cause.canAskAgain,
        });
      }
      return null;
    } finally {
      if (token === generation.current) inFlight.current = false;
    }
  }

  return {
    loading: state.status === 'loading',
    error: state.status === 'error' ? state.message : null,
    canOpenSettings: state.status === 'error' && state.canOpenSettings,
    request,
    cancel,
  };
}
