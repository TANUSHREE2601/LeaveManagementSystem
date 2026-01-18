import React from 'react';

const Card = ({ children, title, className = '', ...props }) => {
  return (
    <div className={`card transition-shadow duration-200 ${className}`} {...props}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;
