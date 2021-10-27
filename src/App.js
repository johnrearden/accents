import React, {useRef} from 'react';
import './App.css';
import Megamap from './Megamap.js';
import QuizWidget from './QuizWidget.js'

function App() {

  const countyLabelRef = useRef(null); 
  const handleClick = (county) => {
    console.log('App component clicked');
  }
  return (
    <div className="App">
      <div className='header'>
        <div>
          <p className='app_name'>Accents</p>
        </div>
        <div className='nav_links'>
          <p className='link'>home</p>
          <p className='link'>quiz</p>
          <p className='link'>about</p>
        </div>

      </div>
      <div className='interactive_elements'>
        <div className='megamap_div'>
          <Megamap onclick={handleClick}/>
        </div>
        {/* <div className='quiz'>
          <QuizWidget totalNumQs={10} />
        </div> */}
      </div>
    </div>

  );
}

export default App;
