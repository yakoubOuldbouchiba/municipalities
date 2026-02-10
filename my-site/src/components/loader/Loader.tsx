// src/components/loader/Loader.tsx
import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="loader-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
