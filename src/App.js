import React from 'react';
import './App.css';
import Megamap from './Megamap.js';
import QuizWidget from './QuizWidget.js'

function App() {
  return (
    <div className="App">
      {/* <div className='header'>
        <h1>Knowing Ireland</h1>
      </div> */}
      {/* <div className='megamap_div'>
        <Megamap />
      </div> */}
      <div className='quiz'>
        <QuizWidget totalNumQs={10}/>
      </div>
    </div>
    
  );
}

export default App;
