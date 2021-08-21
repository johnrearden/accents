import React from 'react';
import './App.css';
import AccentChooser from './AccentChooser.js';
import Megamap from './Megamap.js';

function App() {
  return (
    <div className="App">
      <div className='header'>
        <h1>Knowing Ireland</h1>
      </div>
      <div className='nav_bar'>
        {/* <a href='#'>Rivers</a>
        <a href='#'>Mountains</a>
        <a href='#'>Towns and Cities</a>
        <a href='#' style={{ float: 'right' }}>Take the test!</a> */}
      </div>
      {/* <div className='accent_chooser'>
        {<AccentChooser />}
        
      </div> */}
      <div>
        <Megamap />
      </div>
    </div>
  );
}

export default App;
