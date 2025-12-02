import React from 'react';

interface PngLogoIconProps {
  className?: string;
}

const PngLogoIcon: React.FC<PngLogoIconProps> = ({ className }) => {
  return (
    <img
      src="/acclogo.png"
      className={className}
      style={{
        objectFit: 'contain',
        height: 'auto',
      }}
      alt="ACC Logo"
    />
  );
};

export default PngLogoIcon;



