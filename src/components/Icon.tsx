import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native'; // Import LucideIcon type
import { StyleProp, ViewStyle } from 'react-native'; // Import for style prop

interface IconProps {
  name: keyof typeof LucideIcons; // Ensure name is a valid Lucide icon name
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>; // Add style prop
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor', strokeWidth, style, ...rest }) => {
  const LucideIconComponent = LucideIcons[name] as LucideIcon; // Cast to LucideIcon

  if (!LucideIconComponent) {
    console.warn(`Icon "${name}" not found in LucideIcons.`);
    return null; // Or render a fallback icon
  }

  return <LucideIconComponent size={size} color={color} strokeWidth={strokeWidth} style={style} {...rest} />;
};

export default Icon;