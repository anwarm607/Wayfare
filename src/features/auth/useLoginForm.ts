import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

import { useSession } from '@/context/SessionContext';
import { useTripActions } from '@/context/TripContext';
import { mockAuthenticate, type AuthMode } from '@/features/auth/mockAuth';
import { credentialsSchema, type Credentials } from '@/features/auth/validation';

export function useLoginForm() {
  const { setSession } = useSession();
  const { resetTrip } = useTripActions();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const pending = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  const { control, handleSubmit, reset, resetField, getValues, clearErrors, setError, formState: { errors, isSubmitting } } = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pending.current?.abort();
      pending.current = null;
    };
  }, []);

  async function submit({ email }: Credentials) {
    // Guard synchronously; a second tap can arrive before loading is rendered.
    if (!mounted.current || pending.current) return;
    const request = new AbortController();
    pending.current = request;
    Keyboard.dismiss();
    clearErrors('root');
    try {
      const session = await mockAuthenticate(email, mode, request.signal);
      if (request.signal.aborted) return;
      setSession(session);
      resetField('password');
      setShowPassword(false);
      resetTrip();
      router.replace('/set-locations');
    } catch (error) {
      if (!request.signal.aborted) {
        setError('root', { message: error instanceof Error ? error.message : 'Something went wrong. Please try again.' });
      }
    } finally {
      if (pending.current === request) pending.current = null;
    }
  }

  function onSubmit() {
    void handleSubmit(submit)();
  }

  function switchMode() {
    if (pending.current) return;
    Keyboard.dismiss();
    setMode((previous) => previous === 'login' ? 'register' : 'login');
    reset({ email: getValues('email'), password: '' });
    setShowPassword(false);
  }

  function togglePassword() {
    setShowPassword((previous) => !previous);
  }

  function clearRequestError() {
    clearErrors('root');
  }

  return { control, errors, isSubmitting, mode, showPassword, onSubmit, switchMode, togglePassword, clearRequestError };
}
