
import { PhotoData } from './types';

export const PHOTOS: PhotoData[] = [
  {
    id: 1,
    url: 'https://picsum.photos/id/10/800/1000',
    title: 'Silent Peaks',
    location: 'Swiss Alps',
    date: 'OCT 2023',
    description: 'A moment of stillness above the clouds where the only sound is the whisper of the wind.'
  },
  {
    id: 2,
    url: 'https://picsum.photos/id/26/800/1000',
    title: 'Azure Solitude',
    // subtitle (user Description)
    description: 'The deep blue of the Aegean sea meets the bright white of the Cycladic architecture.', // (about card design)
    location: 'Santorini, Greece', // tagline
    date: 'AUG 2023', // Size Available (Small, Medium, Large)
  },
  {
    id: 3,
    url: 'https://picsum.photos/id/28/800/1000',
    title: 'Golden Hour',
    location: 'Kyoto, Japan',
    date: 'NOV 2023',
    description: 'Autumn leaves catching the last light of the day near the Kiyomizu-dera temple.'
  },
  {
    id: 4,
    url: 'https://picsum.photos/id/29/800/1000',
    title: 'Desert Mirage',
    location: 'Sahara, Morocco',
    date: 'JAN 2024',
    description: 'Endless dunes shifting under the relentless sun, a landscape of eternal change.'
  },
  {
    id: 5,
    url: 'https://picsum.photos/id/54/800/1000',
    title: 'Coastal Echoes',
    location: 'Big Sur, California',
    date: 'MAY 2023',
    description: 'Where the rugged cliffs meet the untamed Pacific, a boundary of pure energy.'
  },
  {
    id: 6,
    url: 'https://picsum.photos/id/64/800/1000',
    title: 'Emerald Canopy',
    location: 'Amazon, Brazil',
    date: 'MAR 2023',
    description: 'The breathing heart of our planet, dense with life and hidden mysteries.'
  },
  {
    id: 7,
    url: 'https://picsum.photos/id/76/800/1000',
    title: 'Nordic Light',
    location: 'Lofoten, Norway',
    date: 'DEC 2023',
    description: 'Chasing the aurora borealis across the jagged mountains of the Arctic circle.'
  }
];

export const COLORS = {
  paper: '#fdfbf7',
  frame: '#ffffff',
  text: '#1a1a1a',
  accent: '#e63946'
};
