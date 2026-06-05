import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md'
}) => {
  const variants = {
    primary: 'bg-homoeo-royal text-white',
    secondary: 'bg-homoeo-sky text-homoeo-dark',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
    light: 'bg-homoeo-light text-homoeo-dark'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={`
      font-semibold rounded-full inline-block
      ${variants[variant]}
      ${sizes[size]}
    `}>
      {children}
    </span>
  );
};

export default Badge;