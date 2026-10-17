export const LUXURY_COLOR_MAP: Record<string, { background: string; isLight?: boolean }> = {
  'Nocturne Black': { background: '#141414' },
  'Midnight Navy': { background: '#1A2736' },
  'Deep Aubergine': { background: '#3E1C33' },
  'Warm Sand': { background: '#D2BBA0' },
  'Cognac Ochre': { background: '#9B5B2E' },
  'Onyx Black': { background: '#111111' },
  'Espresso Suede': { background: '#3D281D' },
  '18k Gold': { background: 'linear-gradient(135deg, #ECC880 0%, #D4AF37 50%, #AA7C11 100%)' },
  'Camel Melange': { background: '#B89778' },
  'Oatmeal Melange': { background: '#D8CFBC', isLight: true },
  'Classic Camel': { background: '#C19A6B' },
  'Dark Espresso': { background: '#2B1B17' },
  'Stealth Black': { background: '#1C1C1E' },
  'Ivory Ecru': { background: '#F4EFEB', isLight: true },
  'Charcoal Pinstripe': { background: '#33373B' },
  'Pale Khaki': { background: '#C2B89B' },
  'Emerald Forest': { background: '#1B4D3E' },
  'Midnight Abyss': { background: '#101721' },
  'Obsidian Noir': { background: '#0F0F10' },
  'Terracotta Bronze': { background: '#B35E44' },
  'Porcelain Alabaster': { background: '#F0EEE9', isLight: true },
  'Oat Milk': { background: '#EAE4D9', isLight: true },
  'Sage Frost': { background: '#9EA89A' },
  'Raw Ecru': { background: '#EFECE6', isLight: true },
  'Taupe Camel': { background: '#9E8878' },
  'Vicuna golden': { background: '#C68B45' },
  'Caramel Tan': { background: '#B7753E' },
  'Antique Havana': { background: '#4A3B32' },
  'Cream Ecru': { background: '#F7F3E8', isLight: true },
  'Raven Black': { background: '#18181A' },
  'Midnight Black': { background: '#131518' },
  'Cognac golden': { background: '#A36829' },
  'Deep Burgundy': { background: '#54121E' },
  'Pitch Black': { background: '#0C0C0D' },
  'Espresso Patina': { background: '#36221A' },
  'Polished Black': { background: '#121212' },
  'Deep Chocolate': { background: '#301F18' },
  'Warm Ivory': { background: '#F7F4EA', isLight: true },
  '18k Gold / White Pearl': { background: 'linear-gradient(135deg, #ECC880 50%, #F5F5F0 50%)' },
  'Midnight Melange': { background: '#222933' },
  'Tobacco Brown': { background: '#593B26' },
  'Slate Charcoal': { background: '#40454A' },
  'Olive Forest': { background: '#3D4533' },
  'Camel Hair': { background: '#C49866' },
  'Royal Burgundy': { background: '#5E1926' },
  'Charcoal Grey': { background: '#383838' },
  'Alabaster Ivory': { background: '#F2EFE9', isLight: true },
  'Midnight Windowpane': { background: '#19202C' },
  'Graphite Black': { background: '#202224' },
  'Nocturne Onyx': { background: '#131315' },
  'Royal Amethyst': { background: '#4D245A' },
  'Antique Gold & Emerald': { background: 'linear-gradient(135deg, #C5A059 50%, #174233 50%)' },
  'Liquid Auric': { background: 'linear-gradient(135deg, #E6C775 0%, #C99E32 100%)' },
  'Midnight Blue': { background: '#162436' },
  'Sandstone Taupe': { background: '#9B8E82' },
  'Oatmeal Fleck': { background: '#D7CFBE', isLight: true },
  'Anthracite Grey': { background: '#383C42' },
  'Heather Smoke': { background: '#7A7D84' },
  'Warm Ecru': { background: '#EFE9DE', isLight: true },
  'Cognac Tan': { background: '#965A2C' },
  'Chocolate Espresso': { background: '#2C1B14' },
  'Midnight Marine': { background: '#162D38' },
  'Sienna Brown': { background: '#8A4726' },
  'Vintage Brown': { background: '#573B28' },
  'Classic Black': { background: '#151515' },
  'Oxblood Patina': { background: '#4A121A' },
  'Polished Bone': { background: '#EDE8DD', isLight: true },
  'Pure Chalk': { background: '#F8F8F8', isLight: true },
  'Champagne Silk': { background: '#E8DFD0', isLight: true },
  '18k Yellow Gold': { background: 'linear-gradient(135deg, #ECC880 0%, #D4AF37 100%)' },
  'Forest Green & Gold': { background: 'linear-gradient(135deg, #1C4431 50%, #C99E32 50%)' },
  'Auric Pearl': { background: 'linear-gradient(135deg, #F3ECE1 50%, #D8B76E 50%)' },
  'Gold & Onyx': { background: 'linear-gradient(135deg, #D4AF37 50%, #151515 50%)' },
  'Polished Gold': { background: 'linear-gradient(135deg, #F0D082 0%, #C8992E 100%)' },
  'Amber Flacon': { background: '#BA6820' },
  'Clear Crystal': { background: 'linear-gradient(135deg, #E8EFF2 0%, #C5D6DF 100%)' },
  'Forest Emerald': { background: '#134E39' },
  'Ruby Flacon': { background: '#7B182B' },
  'Smoked Glass': { background: '#424548' },
  'Dark brown': { background: '#3B2820' },
  'Light blue': { background: '#8FBAD6' },
};

export function getLuxuryColorStyle(colorName: string): { background: string; isLight?: boolean } {
  if (LUXURY_COLOR_MAP[colorName]) {
    return LUXURY_COLOR_MAP[colorName];
  }
  const lower = colorName.toLowerCase();
  if (lower.includes('black') || lower.includes('noir') || lower.includes('onyx')) return { background: '#141414' };
  if (lower.includes('navy') || lower.includes('marine')) return { background: '#1A2736' };
  if (lower.includes('light blue') || lower.includes('sky')) return { background: '#8FBAD6' };
  if (lower.includes('blue')) return { background: '#2C4964' };
  if (lower.includes('white') || lower.includes('chalk')) return { background: '#FFFFFF', isLight: true };
  if (lower.includes('ivory') || lower.includes('ecru') || lower.includes('bone') || lower.includes('cream')) return { background: '#F7F3E8', isLight: true };
  if (lower.includes('gold')) return { background: 'linear-gradient(135deg, #ECC880 0%, #D4AF37 100%)' };
  if (lower.includes('brown') || lower.includes('espresso') || lower.includes('chocolate')) return { background: '#3B2820' };
  if (lower.includes('camel') || lower.includes('sand') || lower.includes('tan') || lower.includes('khaki')) return { background: '#C19A6B' };
  if (lower.includes('green') || lower.includes('emerald') || lower.includes('olive') || lower.includes('sage')) return { background: '#3D4533' };
  if (lower.includes('burgundy') || lower.includes('ruby') || lower.includes('wine')) return { background: '#54121E' };
  if (lower.includes('grey') || lower.includes('gray') || lower.includes('charcoal')) return { background: '#40454A' };
  return { background: '#222222' };
}

export interface ColorGroup {
  name: string;
  hex: string;
  matches: string[];
  isLight?: boolean;
}

// Group complex color names into selectable swatches (Alphabetical order)
export const COLOR_GROUPS: ColorGroup[] = [
  { name: 'Black', hex: '#1A1A1A', matches: ['Black', 'Noir', 'Abyss', 'Nocturne'] },
  { name: 'Brown', hex: '#4A3728', matches: ['Brown', 'Cognac', 'Espresso', 'Chocolate', 'Havana'] },
  { name: 'Burgundy', hex: '#4A1C20', matches: ['Burgundy', 'Aubergine'] },
  { name: 'Camel / Beige', hex: '#C19A6B', matches: ['Camel', 'Sand', 'Tan', 'Khaki', 'Oatmeal', 'Vicuna', 'Taupe'] },
  { name: 'Gold', hex: '#D4AF37', matches: ['Gold', 'Bronze'] },
  { name: 'Green', hex: '#2E4C38', matches: ['Emerald', 'Forest', 'Sage'] },
  { name: 'Grey', hex: '#4B4B4B', matches: ['Charcoal'] },
  { name: 'Ivory / White', hex: '#F8F5F0', matches: ['Ivory', 'Ecru', 'Alabaster', 'Milk', 'Pearl', 'White'], isLight: true },
  { name: 'Navy', hex: '#1B2431', matches: ['Navy'] },
];
