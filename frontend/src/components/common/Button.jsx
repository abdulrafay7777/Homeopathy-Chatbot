import React from 'react';

const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;