import React from 'react';
import styles from './App.module.css';
import 'rsuite/dist/styles/rsuite-default.css';
import RealEstateMap from './features/realEstateMap/RealEstateMap';
import Sidebar from './features/sidebar/Sidebar';

function App() {
  return (
    <div className={styles.container}>
      <header>Real Estate Map</header>
      <div className={styles.map}>
        <RealEstateMap />
      </div>
      <Sidebar />
      <footer>Map</footer>
    </div>
  );
}

export default App;

// TODO: search (geocoder or just by data which is in the kml), loading indicators for polygons and prices. While loading big region display a couple of smaller regions to show how it looks like. Rent to Sell dynamics. Change of price dynamics (red - incresed comaring to past month/week, green - decreased, gray - no change)
