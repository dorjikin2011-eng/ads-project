import React from 'react';

interface PngLogoIconProps {
  className?: string;
}

const PngLogoIcon: React.FC<PngLogoIconProps> = ({ className }) => {
  return (
    <img
      src="/acclogo.png"
      className={className ? className : "w-10 h-auto"}   // default safe size
      style={{
        objectFit: 'contain'
      }}
      alt="ACC Logo"
    />
  );
};

export default PngLogoIcon;




