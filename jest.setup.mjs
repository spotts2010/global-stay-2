// Ensure test environment is set
process.env.NODE_ENV = 'test';

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = value.toString();
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  };
}

// Fake data matching auth.setup.ts
const fakeAccommodations = [
  {
    id: 'acc1',
    name: 'Test Villa by the Beach',
    location: 'Testville',
    price: 200,
    rating: 4.8,
  },
  {
    id: 'acc2',
    name: 'Mock Mountain Cabin',
    location: 'Faketon',
    price: 150,
    rating: 4.6,
  },
];

const fakeBookings = [
  {
    id: 'book1',
    accommodationId: 'acc1',
    dates: ['2025-09-01', '2025-09-07'],
    guests: 2,
    totalPrice: 1400,
  },
];

// Seed localStorage with mock data
localStorage.setItem('mock:accommodations', JSON.stringify(fakeAccommodations));
localStorage.setItem('mock:bookings', JSON.stringify(fakeBookings));

// Mock Firebase Auth user in localStorage
localStorage.setItem(
  `firebase:authUser:${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}:[DEFAULT]`,
  JSON.stringify({
    uid: 'mockUser123',
    email: 'mockuser@example.com',
    displayName: 'Mock User',
    stsTokenManager: {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      expirationTime: Date.now() + 3600000,
    },
    emailVerified: true,
  })
);
