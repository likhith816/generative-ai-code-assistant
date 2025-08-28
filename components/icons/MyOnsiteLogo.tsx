
import React from 'react';

export const MyOnsiteLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 60"
      {...props}
    >
      <path
        fill="currentColor"
        d="M50 0C32.7 0 18.5 14.2 18.5 31.5c0 8.3 3.2 15.9 8.5 21.6 1.4 1.5 3.5 1.7 5.1.5 1.6-1.2 1.9-3.4.7-5.1-4.2-4.5-6.8-10.4-6.8-16.9 0-13 10.5-23.5 23.5-23.5s23.5 10.5 23.5 23.5c0 6.5-2.6 12.4-6.8 16.9-1.2 1.6-1 3.9.7 5.1 1.6 1.2 3.8 1 5.1-.5 5.3-5.7 8.5-13.3 8.5-21.6C81.5 14.2 67.3 0 50 0z"
      />
      <circle fill="currentColor" cx="50" cy="20" r="8" />
    </svg>
);
