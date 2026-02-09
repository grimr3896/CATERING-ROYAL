'use server';

/**
 * @fileOverview Provides AI-powered menu suggestions based on event type, dietary preferences, and budget.
 *
 * @function getMenuSuggestions -  Returns personalized menu suggestions.
 * @typedef {Object} MenuSuggestionInput - Input parameters for menu suggestions: event type, dietary preferences, budget.
 * @typedef {Object} MenuSuggestionOutput -  Menu suggestions based on the input.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MenuSuggestionInputSchema = z.object({
  eventType: z.string().describe('The type of event, e.g., wedding, corporate event, birthday party.'),
  dietaryPreferences: z.string().describe('Any dietary preferences or restrictions, e.g., vegetarian, vegan, gluten-free.'),
  budget: z.string().describe('The budget for the catering service, e.g., low, medium, high.'),
});

export type MenuSuggestionInput = z.infer<typeof MenuSuggestionInputSchema>;

const MenuSuggestionOutputSchema = z.object({
  menuSuggestions: z.string().describe('A list of menu suggestions based on the event type, dietary preferences, and budget.'),
});

export type MenuSuggestionOutput = z.infer<typeof MenuSuggestionOutputSchema>;

export async function getMenuSuggestions(input: MenuSuggestionInput): Promise<MenuSuggestionOutput> {
  return menuSuggestionFlow(input);
}

const menuSuggestionPrompt = ai.definePrompt({
  name: 'menuSuggestionPrompt',
  input: {schema: MenuSuggestionInputSchema},
  output: {schema: MenuSuggestionOutputSchema},
  prompt: `You are an expert catering consultant. Provide menu suggestions based on the event type, dietary preferences, and budget.

Event Type: {{{eventType}}}
Dietary Preferences: {{{dietaryPreferences}}}
Budget: {{{budget}}}

Provide a detailed list of menu suggestions that are appropriate for this event. Consider food choices, beverages, desserts and anything else that is relevant to the event.`,
});

const menuSuggestionFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: MenuSuggestionInputSchema,
    outputSchema: MenuSuggestionOutputSchema,
  },
  async input => {
    const {output} = await menuSuggestionPrompt(input);
    return output!;
  }
);
