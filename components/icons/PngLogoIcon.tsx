import React from 'react';

interface PngLogoIconProps {
  className?: string;
}

const PngLogoIcon: React.FC<PngLogoIconProps> = ({ className }) => {
  return (
    <img
      src="/acclogo.png"
      className={className} // apply passed className
      alt="ACC Logo"
    />
  );
};

export default PngLogoIcon;


