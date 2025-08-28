
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-dark-bg-secondary/50 border border-dark-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-border">
        <h3 className="text-lg font-semibold text-dark-text">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
