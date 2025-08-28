import React from 'react';
import { MyOnsiteLogo } from './icons/MyOnsiteLogo';

export const Header: React.FC = () => {
  return (
    <header className="bg-dark-bg-secondary border-b border-dark-border shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <MyOnsiteLogo className="h-10 w-auto text-brand-blue" />
            <div className="flex flex-col">
                 <h1 className="text-xl font-bold text-dark-text tracking-tight">myOnsite HealthCare</h1>
                 <p className="text-sm text-dark-text-secondary">Generative AI Code Assistant</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
