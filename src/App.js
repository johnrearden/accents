import React from 'react';
import { BrowserRouter, Switch, Route, NavLink, NavBar } from 'react-router-dom';
import './App.css';
import Megamap from './Megamap.js';
import QuizWidget from './QuizWidget.js'

const handleClick = (county) => {
  console.log('App component cldicked');
}

const locations = [
  {
    name: 'athlone',
    lat: 53.4329,
    long: -7.9419,
    x: 741,
    y: 911
  },
  {
    name: 'Ballycotton',
    lat: 51.8241,
    long: -8.0140,
    x: 721,
    y: 1612
  },
  {
    name: 'Ballyconeely',
    lat: 53.4108,
    long: -10.1771,
    x: 145,
    y: 921
  },
  {
    name: 'Tilickafinna',
    lat: 51.5813,
    long: -10.2344,
    x: 131,
    y: 1715
  },
  {
    name: 'rosslare',
    lat: 52.1750,
    long: -6.3626,
    x: 1159,
    y: 1464
  },
  {
    name: 'howth',
    lat: 53.389213,
    long: -6.0339,
    x: 1240,
    y: 931
  },
  {
    name: 'north-east',
    lat: 55.2243,
    long: -6.1473,
    x: 1213,
    y: 95
  },

  {
    name: 'malin head',
    lat: 55.38,
    long: -7.3849,
    x: 886,
    y: 22
  },

  {
    name: 'mourne',
    lat: 54.2266,
    long: -5.6610,
    x: 1345,
    y: 566
  },

  {
    name: 'dawros',
    lat: 54.8266,
    long: -8.5640,
    x: 574,
    y: 278
  },

  {
    name: 'doonalt',
    lat: 54.6977,
    long: -8.8009,
    x: 515,
    y: 348
  }
]

const Nav = () => (
  <div className='header'>
    <div className='app_name'>
      <h2>irishaccents.ie</h2>
    </div>
    <div>
      <NavLink className='nav_links' exact to='/' activeClassName='active'>
        home
      </NavLink>
      <NavLink className='nav_links' to='/quiz' activeClassName='active'>
        quiz
      </NavLink>
    </div>

  </div>
)

const App = () => {
  // for (let loc of locations) {
  //   console.log(loc.name + ' : (' + calculateXPos(loc.long) + ','
  //             + calculateYPos(loc.lat) + ')');
  //   console.log('Actual : ' + loc.x + ',' + loc.y);
  // }

  return (
    <div>
      <HashRouter>
        <Nav />
        <div className='interactive_elements'>
          <Switch>
            <Route exact path='/quiz' render={() => <QuizWidget totalNumQs={3} />} />
            <Route exact path='/' component={Megamap} />
          </Switch>
        </div>
      </HashRouter>
    </div >
  );
}

export default App;
