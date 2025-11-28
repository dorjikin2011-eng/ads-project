import React from 'react';
import logo from '../assets/acclogo.png'; // TypeScript will recognize this after declarations.d.ts

const PngLogoIcon = () => {
  return (
    <img
      src={logo}
      style={{
        width: '100%',      // responsive width
        maxWidth: '150px',  // maximum width
        height: 'auto',     // maintain aspect ratio
        display: 'block'    // remove extra bottom spacing
      }}
    />
  );
};

export default PngLogoIcon;
