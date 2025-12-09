import React from 'react';

interface CloseIconProps {
  className?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      className={className}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export default CloseIcon;