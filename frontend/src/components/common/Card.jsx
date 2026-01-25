import React from 'react';

export default function Card({ title, children, action, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

