
import React from 'react';

export const TestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.34 4.66l-3-3a2 2 0 00-2.83 0l-10 10a2 2 0 000 2.83l3 3a2 2 0 002.83 0l10-10a2 2 0 000-2.83z"></path>
    <line x1="22" y1="2" x2="18" y2="6"></line>
    <path d="M3 10l5 5"></path>
    <path d="M15 3l-5 5"></path>
    <path d="M11 21l-5-5"></path>
  </svg>
);
