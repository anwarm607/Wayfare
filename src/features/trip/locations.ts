import type { TripLocation } from './model';

// Names/addresses match Figma. Coordinates are approximate demo fixtures,
// not the result of a live place-search service.
export const suggestedLocations: readonly TripLocation[] = [
  { id: 'home', title: 'Home', address: 'Villa 12, Street 840, Zone 61 · West Bay', coordinates: { latitude: 25.3256, longitude: 51.5307 }, kind: 'saved' },
  { id: 'office', title: 'Marina Office Tower', address: 'Level 14, Al Fardan Rd · Lusail Marina', coordinates: { latitude: 25.4075, longitude: 51.5226 }, kind: 'saved' },
  { id: 'ferry', title: 'Corniche Ferry Terminal', address: 'Gate 3, Corniche Promenade', coordinates: { latitude: 25.2948, longitude: 51.5455 }, kind: 'recent' },
  { id: 'metro', title: 'Msheireb Metro Station', address: 'Al Kinana St · Msheireb Downtown', coordinates: { latitude: 25.2819, longitude: 51.5245 }, kind: 'recent' },
  { id: 'airport', title: 'Hamad International Airport', address: 'Airport terminal · Doha', coordinates: { latitude: 25.2731, longitude: 51.6081 }, kind: 'recent' },
];
