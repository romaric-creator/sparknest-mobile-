import * as LucideIcons from 'lucide-react-native';

export const getIconNames = (): string[] => {
  // Filter out non-icon exports (like createLucideIcon, icons, etc.)
  // Lucide icon names typically start with an uppercase letter
  return Object.keys(LucideIcons).filter(name => name[0] === name[0].toUpperCase() && name !== 'createLucideIcon' && name !== 'icons');
};