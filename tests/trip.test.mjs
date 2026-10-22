import assert from 'node:assert/strict';
import test from 'node:test';

import { suggestedLocations } from '../src/features/trip/locations.ts';
import { filterLocations, initialTrip, tripReducer, validateTrip } from '../src/features/trip/model.ts';

const [home, office] = suggestedLocations;

test('a trip is ready only after two distinct places are committed', () => {
  assert.ok(validateTrip(initialTrip));
  const pickup = tripReducer(initialTrip, { type: 'select', field: 'origin', location: home });
  assert.ok(validateTrip(pickup));
  const ready = tripReducer(pickup, { type: 'select', field: 'destination', location: office });
  assert.equal(validateTrip(ready), null);
  assert.deepEqual(initialTrip, { origin: null, destination: null });
});

test('shared state rejects duplicate IDs and near-identical coordinates', () => {
  const state = { origin: home, destination: null };
  for (const duplicate of [home, { ...home, id: 'another-provider-id' }]) {
    assert.equal(tripReducer(state, { type: 'select', field: 'destination', location: duplicate }), state);
    assert.ok(validateTrip({ ...state, destination: duplicate }));
  }
});

test('editing an empty field and other no-op actions preserve state identity', () => {
  assert.equal(tripReducer(initialTrip, { type: 'select', field: 'origin', location: null }), initialTrip);
  assert.equal(tripReducer(initialTrip, { type: 'swap' }), initialTrip);
  assert.equal(tripReducer(initialTrip, { type: 'reset' }), initialTrip);
  const state = { origin: home, destination: office };
  assert.equal(tripReducer(state, { type: 'select', field: 'origin', location: home }), state);
});

test('swap preserves selected objects and clearing invalidates the trip', () => {
  const state = { origin: home, destination: office };
  const swapped = tripReducer(state, { type: 'swap' });
  assert.equal(swapped.origin, office);
  assert.equal(swapped.destination, home);
  const edited = tripReducer(swapped, { type: 'select', field: 'destination', location: null });
  assert.equal(edited.origin, office);
  assert.ok(validateTrip(edited));
  assert.deepEqual(tripReducer(edited, { type: 'reset' }), initialTrip);
});

test('local search handles whitespace, case, addresses and empty results', () => {
  assert.deepEqual(filterLocations(suggestedLocations, '  MARINA  '), [office]);
  assert.deepEqual(filterLocations(suggestedLocations, 'zone 61'), [home]);
  assert.deepEqual(filterLocations(suggestedLocations, 'nowhere'), []);
  assert.deepEqual(filterLocations(suggestedLocations, ''), suggestedLocations);
});
