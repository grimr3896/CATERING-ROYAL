'use server';

import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  eventType: z.string().min(1, 'Please select an event type.'),
  eventDate: z.date({ required_error: 'Please select a date.' }),
  guestCount: z.coerce
    .number()
    .int()
    .positive('Number of guests must be positive.'),
  venue: z.string().min(3, 'Venue must be at least 3 characters.'),
  details: z.string().optional(),
});

export async function createBooking(formData: unknown) {
  const result = bookingSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, eventDate, eventType, guestCount } = result.data;

  // In a real application, you would save this to a database (e.g., Cloud SQL)
  console.log('New Booking Request:');
  console.log({ ...result.data });

  // Simulate database operation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, we'll just return a success message.
  return {
    success: true,
    message: `Thank you, ${name}! Your booking request for a ${eventType} on ${eventDate.toLocaleDateString()} for ${guestCount} guests has been received. We will contact you shortly at ${email}.`,
  };
}
