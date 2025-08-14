// src/lib/__mocks__/firebase.ts

// ---- Sample Mock Data ----
const mockAccommodations = [
  {
    id: 'acc1',
    name: 'Test Villa by the Beach',
    location: 'Bondi Beach, Australia',
    price: 200,
  },
  {
    id: 'acc2',
    name: 'Mountain Retreat',
    location: 'Blue Mountains, Australia',
    price: 150,
  },
];

const mockBookings = [
  {
    id: 'book1',
    accommodationId: 'acc1',
    userId: 'mockUser123',
    startDate: '2025-08-20',
    endDate: '2025-08-25',
  },
];

// ---- Firebase App Mocks ----
export const app = {} as any;
export const getApps = jest.fn(() => []); // No apps initialized yet
export const getApp = jest.fn(() => app);
export const initializeApp = jest.fn(() => app);

// ---- Firebase Auth Mocks ----
export const getAuth = jest.fn(() => ({
  currentUser: {
    uid: 'mockUser123',
    email: 'mockuser@example.com',
    displayName: 'Mock User',
  },
}));
export const GoogleAuthProvider = jest.fn();

// ---- Firestore Mocks ----
export const db = {} as any;
export const getFirestore = jest.fn(() => db);

export const collection = jest.fn((_db, path) => ({ path }));

export const getDocs = jest.fn(async (colRef) => {
  if (colRef.path === 'accommodations') {
    return {
      docs: mockAccommodations.map((item) => ({
        id: item.id,
        data: () => item,
      })),
    };
  }
  if (colRef.path === 'bookings') {
    return {
      docs: mockBookings.map((item) => ({
        id: item.id,
        data: () => item,
      })),
    };
  }
  return { docs: [] };
});

export const doc = jest.fn((_db, path, id) => ({ path, id }));

export const getDoc = jest.fn(async (docRef) => {
  if (docRef.path === 'accommodations' && docRef.id === 'acc1') {
    return { exists: () => true, id: 'acc1', data: () => mockAccommodations[0] };
  }
  if (docRef.path === 'bookings' && docRef.id === 'book1') {
    return { exists: () => true, id: 'book1', data: () => mockBookings[0] };
  }
  return { exists: () => false };
});

// ---- Storage Mock ----
export const getStorage = jest.fn(() => ({}));
