import assert from 'node:assert/strict';
import test from 'node:test';

import { credentialsSchema } from '../src/features/auth/validation.ts';
import { mockAuthenticate } from '../src/features/auth/mockAuth.ts';

test('login validation rejects missing, malformed and whitespace-only credentials', () => {
  for (const credentials of [
    { email: '', password: '' },
    { email: 'invalid', password: 'demo1234' },
    { email: 'demo@example.com', password: 'short' },
    { email: 'demo@example.com', password: '        ' },
  ]) {
    assert.equal(credentialsSchema.safeParse(credentials).success, false);
  }
});

test('validation normalizes email whitespace without altering password characters', () => {
  assert.deepEqual(credentialsSchema.parse({ email: '  demo@example.com  ', password: ' demo1234 ' }), {
    email: 'demo@example.com', password: ' demo1234 ',
  });
});

test('mock authentication supports success, registration conflicts and recoverable failure', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const login = mockAuthenticate(' DEMO@example.com ', 'login');
  t.mock.timers.tick(700);
  assert.deepEqual(await login, { email: 'demo@example.com' });

  const registration = mockAuthenticate('registered@example.com', 'register');
  t.mock.timers.tick(700);
  await registration;
  const duplicate = mockAuthenticate('REGISTERED@example.com', 'register');
  const duplicateCheck = assert.rejects(duplicate, /already exists/);
  t.mock.timers.tick(700);
  await duplicateCheck;

  const failure = mockAuthenticate('fail@example.com', 'login');
  const failureCheck = assert.rejects(failure, /couldn’t complete/);
  t.mock.timers.tick(700);
  await failureCheck;
});

test('cancelling pending registration stops its timer and does not create an account', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const request = new AbortController();
  const cancelled = mockAuthenticate('cancelled@example.com', 'register', request.signal);
  const cancellationCheck = assert.rejects(cancelled, { name: 'AbortError' });
  request.abort();
  await cancellationCheck;
  t.mock.timers.tick(700);

  const retry = mockAuthenticate('cancelled@example.com', 'register');
  t.mock.timers.tick(700);
  assert.deepEqual(await retry, { email: 'cancelled@example.com' });
});

test('an already-cancelled request rejects without starting authentication', async () => {
  const request = new AbortController();
  request.abort();
  await assert.rejects(mockAuthenticate('cancelled-before@example.com', 'login', request.signal), { name: 'AbortError' });
});

test('cancellation after the timer resolves still prevents registration', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const request = new AbortController();
  const cancelled = mockAuthenticate('cancelled-late@example.com', 'register', request.signal);
  const cancellationCheck = assert.rejects(cancelled, { name: 'AbortError' });
  t.mock.timers.tick(700);
  request.abort();
  await cancellationCheck;

  const retry = mockAuthenticate('cancelled-late@example.com', 'register');
  t.mock.timers.tick(700);
  await retry;
});
