import React, { useRef } from 'react';
import { BrowserRouter, Switch, Route, NavLink, NavBar } from 'react-router-dom';
import './App.css';
import Megamap from './Megamap.js';
import QuizWidget from './QuizWidget.js'

const handleClick = (county) => {
  console.log('App component clicked');
}

const Nav = () => (
  <div className='header'>
    <div className='app_name'>
      <h2>Accents</h2>
    </div>
    <div>
      <NavLink className='nav_links' exact to='/' activeClassName='active'>
        Home
      </NavLink>
      <NavLink className='nav_links' to='/quiz' activeClassName='active'>
        Quiz
      </NavLink>
    </div>

  </div>
)

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <div className='interactive_elements'>
        <Switch>
          <Route exact path='/quiz' render={() => <QuizWidget totalNumQs={10} />} />
          <Route exact path='/' component={Megamap} />
        </Switch>
        </div>
      </BrowserRouter>
    </div >
  );
}

export default App;
