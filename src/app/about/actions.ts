'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  subject: z.string().min(3, 'Subject must be at least 3 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function submitContactForm(formData: unknown) {
  const result = contactSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid form data. Please check your inputs.',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject } = result.data;

  // In a real application, you would send an email here
  console.log('New Contact Form Submission:');
  console.log({ ...result.data });
  
  // Simulate sending email
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: `Thank you, ${name}! Your message about "${subject}" has been received. We will get back to you at ${email} shortly.`,
  };
}
