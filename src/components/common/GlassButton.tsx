import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  onClick 
}) => {
  const baseClasses = "rounded-xl border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-400/30 hover:from-amber-600 hover:to-yellow-600 focus:ring-amber-500/50",
    secondary: "bg-white/20 text-white border-white/30 hover:bg-white/30 focus:ring-white/50",
    outline: "bg-transparent text-white border-white/50 hover:bg-white/10 focus:ring-white/50"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default GlassButton;