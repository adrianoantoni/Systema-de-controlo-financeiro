import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  color: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color, className }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        className
      )}
      style={{ 
        backgroundColor: `${color}20`, // 20 for ~12% opacity
        color: color 
      }}
    >
      {children}
    </span>
  );
};
