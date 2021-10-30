import React, { useRef } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import './App.css';
import Megamap from './Megamap.js';
import QuizWidget from './QuizWidget.js'

const handleClick = (county) => {
  console.log('App component clicked');
}

const Dummy = () => (
  <div>
    <h1 >Dummy Component</h1>
    <button onClick={console.log('dummy clicked')}>Yo!</button>
  </div>
)

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <ul>
          <li>
            <NavLink to='/mega' activeClassName='active'>Mega</NavLink>
          </li>
          <li>
            <NavLink to='/quiz' activeClassName='active'>Quiz</NavLink>
          </li>
          <li>
            <NavLink activeClassName='active' to='/dummy'>Dummy</NavLink>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path='/mega' component={Megamap} />
          <Route exact path='/quiz' render={() => <QuizWidget totalNumQs={10} />} />
          <Route exact path='/dummy' component={Dummy} />
        </Switch>
      </BrowserRouter>
    </div >
  );
}

export default App;
