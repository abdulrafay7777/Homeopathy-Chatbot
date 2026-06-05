import React from 'react';

export const Card = ({ 
  children, 
  className = '', 
  hover = true,
  border = false,
  shadow = true 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-xl p-6
        ${shadow ? 'shadow-homoeo hover:shadow-homoeo-lg' : ''}
        ${hover ? 'transition-smooth' : ''}
        ${border ? 'border-2 border-homoeo-sky' : 'border border-homoeo-border'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;