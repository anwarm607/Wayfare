import { createContext, useContext, useState, type ReactNode } from 'react';

import type { Session } from '@/features/auth/mockAuth';

type SessionState = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  return <SessionContext value={{ session, setSession }}>{children}</SessionContext>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider.');
  return value;
}
