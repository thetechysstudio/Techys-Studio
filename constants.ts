import { Plan, CardSize, CardTemplate, Memory } from './types.ts';
import bestFriends from './src/assets/best-friends.png';
import farewell from './src/assets/farewell.png';
import birthday from './src/assets/birthday.png';
import teachers from './src/assets/teachers.png';
import motherFatherDay from './src/assets/mother-father-day.png';
import specialMemories from './src/assets/specialmemories.png';
import anniversary from './src/assets/aniversary.png';
import rakshaBandhan from './src/assets/RakshaBandhan.png';

export const imgBestFriend = bestFriends;
export const imgFarewell = farewell;
export const imgBirthday = birthday;
export const imgTeachers = teachers;
export const imgMotherFatherDay = motherFatherDay;
export const imgSpecialMemories = specialMemories;
export const imgAnniversary = anniversary;
export const imgRakshaBandhan = rakshaBandhan;


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
    title: 'Best Friends',
    caption: 'The bond of love and respect.',
    imageUrl: imgBestFriend,
    x: 15,
    y: 20,
    rotation: -8,
  },
  {
    id: '2',
    title: 'Farewell',
    caption: 'The bond of love and respect.',
    imageUrl: imgFarewell,
    x: 75,
    y: 15,
    rotation: 6,
  },
  {
    id: '3',
    title: 'Birthday',
    caption: 'The bond of love and respect.',
    imageUrl: imgBirthday,
    x: 45,
    y: 10,
    rotation: -4,
  },
  {
    id: '4',
    title: 'Teachers',
    caption: 'The bond of love and respect.',
    imageUrl: imgTeachers,
    x: 25,
    y: 60,
    rotation: 9,
  },
  {
    id: '5',
    title: 'Mother Father Day',
    caption: 'The bond of love and respect.',
    imageUrl: imgMotherFatherDay,
    x: 65,
    y: 55,
    rotation: -7,
  },
  {
    id: '6',
    title: 'Special Memories',
    caption: 'The bond of love and togetherness.',
    imageUrl: imgSpecialMemories,
    x: 85,
    y: 70,
    rotation: 5,
  },
  {
    id: '7',
    title: 'Anniversary',
    caption: 'The bond of love and togetherness.',
    imageUrl: imgAnniversary,
    x: 5,
    y: 80,
    rotation: -10,
  },
  {
    id: '8',
    title: 'Raksha Bandhan',
    caption: 'The bond of love and protection.',
    imageUrl: imgRakshaBandhan,
    x: 40,
    y: 85,
    rotation: 3,
  },
];
