import type { MenuSuggestionRequest } from '@/lib/definitions';

// This is a mock AI function to simulate generating menu suggestions.
// In a real application, this would involve calling a GenAI model.

const sampleMenus = {
  wedding: {
    appetizers: [
      'Caprese Skewers with Balsamic Glaze',
      'Smoked Salmon Blinis with Dill Cream Cheese',
      'Mushroom Vol-au-Vents',
    ],
    mains: [
      'Pan-Seared Duck Breast with Cherry Sauce',
      'Herb-Crusted Rack of Lamb',
      'Butternut Squash Risotto with Sage',
    ],
    desserts: ['Chocolate Lava Cakes', 'Lemon Tart with Meringue'],
  },
  corporate: {
    appetizers: [
      'Mini Quiches',
      'Chicken Satay with Peanut Sauce',
      'Spinach and Feta Triangles',
    ],
    mains: [
      'Grilled Chicken Caesar Sandwiches',
      'Beef Sliders with Caramelized Onions',
      'Gourmet Pasta Salad',
    ],
    desserts: ['Assorted Cookie Platter', 'Brownie Bites'],
  },
  'private-party': {
    appetizers: [
      'Spicy Shrimp Tacos',
      'Guacamole with Homemade Tortilla Chips',
      'Bacon-Wrapped Dates',
    ],
    mains: ['Pulled Pork Sliders', 'Gourmet Pizza Station', 'Macaroni and Cheese Bar'],
    desserts: ['Mini Cheesecakes', 'Fruit Tarts'],
  },
};

export async function suggestMenu(
  request: MenuSuggestionRequest
): Promise<{ menu: any; reasoning: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { eventType, diet } = request;
  const eventKey =
    eventType in sampleMenus ? eventType : 'private-party';
  let menu = JSON.parse(JSON.stringify(sampleMenus[eventKey])); // Deep copy

  let reasoning = `For a ${eventType.replace(
    '-',
    ' '
  )} event, we suggest a menu that is both elegant and appealing to a wide range of palates. `;

  if (diet?.includes('vegetarian')) {
    menu.mains.push('Mushroom & Lentil Loaf');
    reasoning += `We've included a hearty vegetarian main course, the Mushroom & Lentil Loaf, to accommodate your vegetarian guests. `;
  }
  if (diet?.includes('gluten-free')) {
    menu.desserts.push('Flourless Chocolate Cake');
    reasoning += `A delicious Flourless Chocolate Cake is added for those with gluten sensitivities. Many of our main courses can be prepared gluten-free upon request. `;
  }
  if (diet?.includes('vegan')) {
    menu.appetizers.push('Roasted Red Pepper Hummus with Veggie Sticks');
    menu.mains.push('Quinoa Salad with Roasted Vegetables and Lemon Vinaigrette');
     reasoning += `To cater to vegan guests, we've added a fresh Quinoa Salad and a classic hummus appetizer. `;
  }
  
  reasoning += 'This selection offers a balanced mix of flavors and textures, ensuring a memorable dining experience for all your guests.'

  return { menu, reasoning };
}
