'use server';

import { z } from 'zod';
import { suggestMenu } from '@/ai/flows/menuSuggestions';
import type { MenuSuggestionRequest } from '@/lib/definitions';

const suggestionSchema = z.object({
  eventType: z.string(),
  guestCount: z.coerce.number(),
  diet: z.array(z.string()).optional(),
  budget: z.coerce.number(),
});

export async function getMenuSuggestion(formData: unknown) {
  const result = suggestionSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid form data.',
    };
  }

  try {
    const suggestion = await suggestMenu(result.data as MenuSuggestionRequest);
    return {
      success: true,
      data: suggestion,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Failed to generate menu suggestions. Please try again later.',
    };
  }
}
