import React from 'react';
import './App.css';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import SuburbsListControl from './features/realEstateMap/SuburbsListControl';

function App() {
  return (
    <div className="container">
      <header>Real Estate Map</header>
      <div className="map">
        <RealEstateMap />
      </div>
      <div className="info-container">
        <SuburbsListControl />
      </div>
      <footer>Map</footer>
    </div>
  );
}

export default App;
