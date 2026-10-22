export type AuthMode = 'login' | 'register';
export type Session = { email: string };

const registeredEmails = new Set<string>();

function cancellationError() {
  const error = new Error('Authentication cancelled.');
  error.name = 'AbortError';
  return error;
}

function waitForResponse(signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) { reject(cancellationError()); return; }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', cancel);
      resolve();
    }, 700);

    function cancel() {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
      reject(cancellationError());
    }

    signal?.addEventListener('abort', cancel, { once: true });
  });
}

export async function mockAuthenticate(email: string, mode: AuthMode, signal?: AbortSignal): Promise<Session> {
  await waitForResponse(signal);
  if (signal?.aborted) throw cancellationError();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === 'fail@example.com') {
    throw new Error('We couldn’t complete that request. Please try another demo email.');
  }
  if (mode === 'register' && registeredEmails.has(normalizedEmail)) {
    throw new Error('This demo account already exists. Switch to Log in to continue.');
  }
  if (mode === 'register') registeredEmails.add(normalizedEmail);

  return { email: normalizedEmail };
}
