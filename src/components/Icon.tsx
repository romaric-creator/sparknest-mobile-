import React from 'react';
import { icons } from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';

// Get the icon names from the `icons` object
type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: IconName;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found.`);
    // Render a fallback icon or nothing
    return null;
  }

  return <LucideIcon {...props} />;
};

export default Icon;