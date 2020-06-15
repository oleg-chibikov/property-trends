import React from 'react';
import './App.css';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import SuburbsList from './features/suburbsList/SuburbsList';

function App() {
  return (
    <div className="container">
      <header>Real Estate Map</header>
      <div className="map">
        <RealEstateMap />
      </div>
      <div className="info-container">
        <SuburbsList />
      </div>
      <footer>Map</footer>
    </div>
  );
}

export default App;
