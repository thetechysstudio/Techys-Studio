import { Plan, CardSize, CardTemplate, Memory } from './types.ts';

export const SIZES: {   
  label: CardSize; 
  dimensions: string; 
  basePrice: number; 
  discountThreshold: number; 
  discountPercent: number;
}[] = [
  { 
    label: 'Small', 
    dimensions: '6.5 × 9 cm', 
    basePrice: 49, 
    discountThreshold: 3, 
    discountPercent: 15 
  },
  { 
    label: 'Medium', 
    dimensions: '8.5 × 11 cm', 
    basePrice: 59, 
    discountThreshold: 2, 
    discountPercent: 20 
  },
  { 
    label: 'Large', 
    dimensions: '16.5 × 8.5 cm', 
    basePrice: 79, 
    discountThreshold: 2, 
    discountPercent: 25 
  },
];

export const PLANS: Plan[] = [
  {
    id: 'plan-1',
    name: 'Classic Video Card',
    description: 'Perfect for simple digital gifts.',
    price: 'Base',
    features: ['Own Video', 'Default Card Template', 'Instant Checkout'],
    includesVideo: true,
    includesImage: false,
    canCustomizeTemplate: false,
    isBookCall: false,
  },
  {
    id: 'plan-2',
    name: 'Memory Plus',
    description: 'The fan favorite with photo & video combo.',
    price: '+10 rs',
    features: ['Own Video', 'Own Image', 'Default Card Template', 'Instant Checkout'],
    includesVideo: true,
    includesImage: true,
    canCustomizeTemplate: false,
    isBookCall: false,
  },
  {
    id: 'plan-3',
    name: 'Creative Studio',
    description: 'Full template control for special occasions.',
    price: 'Custom',
    features: ['Own Video', 'Own Image', 'Template Customization', 'Book a Call'],
    includesVideo: true,
    includesImage: true,
    canCustomizeTemplate: true,
    isBookCall: true,
  },
  {
    id: 'plan-4',
    name: 'Premium Custom',
    description: 'White-glove service for events.',
    price: 'Bespoke',
    features: ['Premium Custom Plan', 'Fully Personalized', 'Contact Us'],
    includesVideo: true,
    includesImage: true,
    canCustomizeTemplate: true,
    isBookCall: true,
  },
];

export const TEMPLATES: CardTemplate[] = [
  { id: 't1', name: 'Minimalist', style: 'bg-white', thumbnail: 'https://picsum.photos/seed/t1/100/140' },
  { id: 't2', name: 'Vintage Cream', style: 'bg-[#f5f2e9]', thumbnail: 'https://picsum.photos/seed/t2/100/140' },
  { id: 't3', name: 'Soft Rose', style: 'bg-[#fff5f5]', thumbnail: 'https://picsum.photos/seed/t3/100/140' },
  { id: 't4', name: 'Midnight', style: 'bg-[#2d2d2d] text-white', thumbnail: 'https://picsum.photos/seed/t4/100/140' },
];



export const MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Sunset in Amalfi',
    caption: 'The golden hour felt like it would last forever.',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600',
    x: 15,
    y: 20,
    rotation: -8,
  },
  {
    id: '2',
    title: 'Tokyo Nights',
    caption: 'Neon lights and the smell of rain in Shibuya.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600',
    x: 75,
    y: 15,
    rotation: 6,
  },
  {
    id: '3',
    title: 'Alpine Cabin',
    caption: 'Morning coffee with a view of the peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
    x: 45,
    y: 10,
    rotation: -4,
  },
  {
    id: '4',
    title: 'Desert Mirage',
    caption: 'Endless sands and silent horizons.',
    imageUrl: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=600',
    x: 25,
    y: 60,
    rotation: 9,
  },
  {
    id: '5',
    title: 'The Hidden Library',
    caption: 'Found this gem in the heart of the old town.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600',
    x: 65,
    y: 55,
    rotation: -7,
  },
  {
    id: '6',
    title: 'First Surf',
    caption: 'Bali waves and salty hair.',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600',
    x: 85,
    y: 70,
    rotation: 5,
  },
  {
    id: '7',
    title: 'Wild Florals',
    caption: 'Spring arrived early this year.',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600',
    x: 5,
    y: 80,
    rotation: -10,
  },
  {
    id: '8',
    title: 'Morning Mist',
    caption: 'Silent roads through the redwood forest.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600',
    x: 40,
    y: 85,
    rotation: 3,
  },
];
