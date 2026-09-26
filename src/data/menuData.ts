export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'coffee' | 'milkshakes' | 'boba' | 'refreshers' | 'bites' | 'sweets' | 'deals';
  description: string;
  tag?: string;
  isPopular?: boolean;
  image?: string;
  options?: {
    hasToppings?: boolean;
    hasSweetness?: boolean;
    hasIce?: boolean;
  };
}

export interface DealItem {
  id: string;
  name: string;
  price: number;
  description: string;
  originalValueEstimate: number;
  savings: number;
  type: 'sweet_break' | 'boba_break' | 'melora_duo';
}

export const EXTRA_TOPPINGS = [
  { id: 'tapioca', name: 'Tapioca Pearls', price: 100 },
  { id: 'popping_boba', name: 'Popping Boba', price: 100 },
  { id: 'jelly', name: 'Jelly', price: 100 },
  { id: 'crystal_boba', name: 'Crystal Boba', price: 100 },
] as const;

export const SWEETNESS_LEVELS = [
  '100% Regular',
  '70% Less Sweet',
  '50% Half Sweet',
  '30% Gentle',
  '0% No Sugar',
] as const;

export const ICE_LEVELS = [
  'Regular Ice',
  'Less Ice',
  'No Ice',
] as const;

export const MENU_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'deals', label: '✨ Melora Deals' },
  { id: 'coffee', label: '🧊 Iced Coffee' },
  { id: 'milkshakes', label: '🥤 Milkshakes' },
  { id: 'boba', label: '🧋 Bubble Tea' },
  { id: 'refreshers', label: '🍓 Refreshers' },
  { id: 'bites', label: '🥪 Bites' },
  { id: 'sweets', label: '🍰 Sweets' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // ICED COFFEE
  {
    id: 'iced-classic',
    name: 'Classic Iced Coffee',
    price: 450,
    category: 'coffee',
    description: 'Double shot rich espresso shaken over ice and cold full-cream milk.',
    isPopular: true,
    options: { hasSweetness: true, hasIce: true },
  },
  {
    id: 'iced-vanilla',
    name: 'Iced Vanilla',
    price: 500,
    category: 'coffee',
    description: 'Smooth chilled espresso infused with Madagascar vanilla bean nectar.',
    options: { hasSweetness: true, hasIce: true },
  },
  {
    id: 'iced-caramel',
    name: 'Iced Caramel',
    price: 500,
    category: 'coffee',
    description: 'House-made golden caramel swirl with espresso and frosty milk.',
    isPopular: true,
    options: { hasSweetness: true, hasIce: true },
  },
  {
    id: 'iced-mocha',
    name: 'Iced Mocha',
    price: 550,
    category: 'coffee',
    description: 'Velvety dark chocolate melted into bold espresso and cold milk.',
    options: { hasSweetness: true, hasIce: true },
  },

  // MILKSHAKES
  {
    id: 'shake-vanilla',
    name: 'Vanilla Milkshake',
    price: 500,
    category: 'milkshakes',
    description: 'Classic creamy custard ice cream whipped with chilled whole milk.',
  },
  {
    id: 'shake-chocolate',
    name: 'Chocolate Milkshake',
    price: 550,
    category: 'milkshakes',
    description: 'Rich Belgian cocoa ice cream blend with artisan chocolate drizzle.',
    isPopular: true,
  },
  {
    id: 'shake-strawberry',
    name: 'Strawberry Milkshake',
    price: 550,
    category: 'milkshakes',
    description: 'Fresh crushed strawberry compote blended into thick velvety cream.',
  },
  {
    id: 'shake-caramel-biscuit',
    name: 'Caramel Biscuit Milkshake',
    price: 550,
    category: 'milkshakes',
    description: 'Spiced speculoos cookie butter churned with vanilla cream & biscuit dust.',
    isPopular: true,
  },
  {
    id: 'shake-oreo-crush',
    name: 'Oreo Crush Milkshake',
    price: 600,
    category: 'milkshakes',
    description: 'Double stuffed Oreo crunch pieces hand-spun into decadent cream.',
    isPopular: true,
  },

  // BUBBLE TEA
  {
    id: 'boba-classic',
    name: 'Classic Milk Tea',
    price: 500,
    category: 'boba',
    description: 'Signature robust Ceylon black tea brewed slow and shaken with rich milk.',
    isPopular: true,
    options: { hasToppings: true, hasSweetness: true, hasIce: true },
  },
  {
    id: 'boba-brown-sugar',
    name: 'Brown Sugar Boba',
    price: 550,
    category: 'boba',
    description: 'Warm molasses brown sugar syrup tiger-striped in cold creamy milk.',
    isPopular: true,
    options: { hasToppings: true, hasSweetness: true, hasIce: true },
  },
  {
    id: 'boba-taro',
    name: 'Taro Milk Tea',
    price: 550,
    category: 'boba',
    description: 'Fragrant purple taro root with sweet floral notes and silky texture.',
    options: { hasToppings: true, hasSweetness: true, hasIce: true },
  },
  {
    id: 'boba-strawberry',
    name: 'Strawberry Milk Tea',
    price: 550,
    category: 'boba',
    description: 'Delicate green tea infused with sweet strawberry puree and dairy swirl.',
    options: { hasToppings: true, hasSweetness: true, hasIce: true },
  },
  {
    id: 'boba-mango',
    name: 'Mango Milk Tea',
    price: 550,
    category: 'boba',
    description: 'Sun-kissed tropical mango nectar blended into smooth jasmine milk tea.',
    options: { hasToppings: true, hasSweetness: true, hasIce: true },
  },
  {
    id: 'boba-matcha',
    name: 'Matcha Milk Tea',
    price: 600,
    category: 'boba',
    description: 'First-harvest Japanese stone-ground green tea whisked with fresh milk.',
    isPopular: true,
    options: { hasToppings: true, hasSweetness: true, hasIce: true },
  },

  // REFRESHERS
  {
    id: 'refresher-strawberry-lemonade',
    name: 'Strawberry Lemonade',
    price: 450,
    category: 'refreshers',
    description: 'Fresh squeezed tart lemons muddled with sweet garden strawberry nectar.',
    isPopular: true,
    options: { hasSweetness: true, hasIce: true },
  },
  {
    id: 'refresher-blueberry-lemonade',
    name: 'Blueberry Lemonade',
    price: 500,
    category: 'refreshers',
    description: 'Wild forest blueberries infused into sparkling cold lemonade with fresh mint.',
    options: { hasSweetness: true, hasIce: true },
  },
  {
    id: 'refresher-mango-passion',
    name: 'Mango Passion',
    price: 500,
    category: 'refreshers',
    description: 'Tropical passion fruit and honey mango over cracked clear ice.',
    isPopular: true,
    options: { hasSweetness: true, hasIce: true },
  },
  {
    id: 'refresher-peach-iced-tea',
    name: 'Peach Iced Tea',
    price: 450,
    category: 'refreshers',
    description: 'Brewed delicate Ceylon tea infused with white peach puree and lemon slice.',
    options: { hasSweetness: true, hasIce: true },
  },

  // BITES
  {
    id: 'bite-chicken-cheese',
    name: 'Chicken & Cheese Sandwich',
    price: 300,
    category: 'bites',
    description: 'Tender pulled herb chicken breast, melted mozzarella and cheddar in artisanal bread.',
    isPopular: true,
  },
  {
    id: 'bite-egg-cheese',
    name: 'Egg & Cheese Sandwich',
    price: 250,
    category: 'bites',
    description: 'Warm fluffy butter scrambled eggs topped with melted gouda and house mayo.',
  },
  {
    id: 'bite-cheese-toastie',
    name: 'Cheese Toastie',
    price: 250,
    category: 'bites',
    description: 'Golden skillet-toasted sourdough overflowing with 3 melted gooey cheeses.',
    isPopular: true,
  },
  {
    id: 'bite-loaded-fries',
    name: 'Loaded Fries',
    price: 350,
    category: 'bites',
    description: 'Crispy skin-on french fries showered with warm cheddar cheese sauce & herb seasoning.',
    isPopular: true,
  },

  // SWEETS
  {
    id: 'sweet-brownie',
    name: 'Brownie',
    price: 250,
    category: 'sweets',
    description: 'Gooey 70% dark Belgian chocolate brownie with cracked shiny crust.',
    isPopular: true,
  },
  {
    id: 'sweet-chocolate-cake',
    name: 'Chocolate Cake',
    price: 300,
    category: 'sweets',
    description: 'Triple-layer moist chocolate sponge draped in silky cocoa ganache.',
  },
  {
    id: 'sweet-vanilla-cake',
    name: 'Vanilla Cake',
    price: 250,
    category: 'sweets',
    description: 'Light tender chiffon crumb frosted with fragrant vanilla bean buttercream.',
  },
  {
    id: 'sweet-cookie',
    name: 'Choc Chip Cookie',
    price: 200,
    category: 'sweets',
    description: 'Jumbo browned-butter cookie stuffed with melting chocolate chunks.',
  },
  {
    id: 'sweet-brownie-icecream',
    name: 'Brownie + Ice Cream',
    price: 350,
    category: 'sweets',
    description: 'Warm fudgy brownie served straight from the oven with a cold scoop of vanilla bean ice cream.',
    isPopular: true,
  },
];

export const MELORA_DEALS: DealItem[] = [
  {
    id: 'deal-sweet-break',
    name: 'Sweet Break',
    price: 700,
    description: 'Any milkshake + brownie',
    originalValueEstimate: 850,
    savings: 150,
    type: 'sweet_break',
  },
  {
    id: 'deal-boba-break',
    name: 'Boba Break',
    price: 700,
    description: 'Any bubble tea + cookie',
    originalValueEstimate: 800,
    savings: 100,
    type: 'boba_break',
  },
  {
    id: 'deal-melora-duo',
    name: 'Melora Duo',
    price: 950,
    description: '2 beverages + 1 snack',
    originalValueEstimate: 1350,
    savings: 400,
    type: 'melora_duo',
  },
];
