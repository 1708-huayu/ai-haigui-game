import React from 'react';

interface FrostedCardProps {
  children: React.ReactNode;
  className?: string;
}

const FrostedCard: React.FC<FrostedCardProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl shadow-black/50 ${className}`}
    >
      {children}
    </div>
  );
};

export default FrostedCard;