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
  const baseClasses = "rounded-xl border font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-400/30 hover:from-amber-600 hover:to-yellow-600 focus:ring-amber-500/50 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30",
    secondary: "bg-white/20 text-white border-white/30 hover:bg-white/30 focus:ring-white/50 backdrop-blur-sm",
    outline: "bg-transparent text-white border-white/50 hover:bg-white/10 focus:ring-white/50 backdrop-blur-sm"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} transform hover:scale-105 active:scale-95`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default GlassButton;