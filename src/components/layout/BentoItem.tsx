import React from 'react';

interface BentoItemProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'row' | 'col';
}

const BentoItem: React.FC<BentoItemProps> = ({ children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'md:col-span-1 md:row-span-1',
    md: 'md:col-span-2 md:row-span-1',
    lg: 'md:col-span-3 md:row-span-2',
    row: 'md:col-span-3 md:row-span-1',
    col: 'md:col-span-1 md:row-span-2',
  };

  return (
    <div className={`${sizeClasses[size]} transition-all duration-300 hover:scale-[1.02]`}>
      {children}
    </div>
  );
};

export default BentoItem;