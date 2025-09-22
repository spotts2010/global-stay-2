import { fetchAccommodations, fetchBookings } from '@/lib/firestore'; // Uses alias

describe('Firestore mock data in test environment', () => {
  it('should return mock accommodations', async () => {
    const accommodations = await fetchAccommodations();
    expect(accommodations).toHaveLength(2);
    expect(accommodations[0].name).toBe('Test Villa by the Beach');
  });

  it('should return mock bookings', async () => {
    const bookings = await fetchBookings('mockUser123');
    expect(bookings).toHaveLength(1);
    expect(bookings[0].accommodationId).toBe('acc1');
  });
});
