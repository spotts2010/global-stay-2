import { addDays } from 'date-fns';

export type Booking = {
  id: string;
  accommodationId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalPrice: number;
};

// Placeholder data
const placeholderBookings: Booking[] = [
  {
    id: 'booking1',
    accommodationId: '1',
    userId: 'user1',
    startDate: new Date(),
    endDate: addDays(new Date(), 5),
    guests: 2,
    totalPrice: 4250,
  },
  {
    id: 'booking2',
    accommodationId: '3',
    userId: 'user2',
    startDate: addDays(new Date(), 10),
    endDate: addDays(new Date(), 17),
    guests: 1,
    totalPrice: 4200,
  },
];

/**
 * Fetches bookings from Firestore for a specific user.
 * NOTE: This is a placeholder and returns mock data.
 * @param userId - The ID of the user whose bookings to fetch.
 * @returns A promise that resolves to an array of booking objects.
 */
export async function fetchBookings(userId: string): Promise<Booking[]> {
  console.log(`Fetching bookings for user: ${userId}`);

  // In a real application, you would query Firestore here:
  // const bookingsRef = collection(db, 'users', userId, 'bookings');
  // const q = query(bookingsRef);
  // const querySnapshot = await getDocs(q);
  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];

  // For now, returning placeholder data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(placeholderBookings);
    }, 500); // Simulate network delay
  });
}
