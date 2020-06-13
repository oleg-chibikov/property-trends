import React from 'react';
import './App.css';
import RealEstateMap from './features/realEstateMap/RealEstateMap';

function App() {
  return (
    <div className="container">
      <header>Real Estate Map</header>
      <div className="map">
        <RealEstateMap centerAroundCurrentLocation />
      </div>
      <div className="info-container">Info</div>
      <footer>Map</footer>
    </div>
  );
}

export default App;
