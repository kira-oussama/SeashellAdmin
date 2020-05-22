import React from 'react';
import Login from './Login';
import {BrowserRouter as Router , Switch , Route} from 'react-router-dom'
import Dashboard from './Dashboard';
import Main from './Main'

import Add from './abonne/Add';
import Search from './abonne/Search';
import Edit from './abonne/Edit';
import Show from './abonne/Show';

import DocumentAdd from './document/Add';
import DocumentSearch from './document/Search';
import DocumentShow from './document/Show';
import DocumentEdit from './document/Edit'

function App() {
  return (
    <div>      
      <Router>
        <Switch>
          <Route exact path='/login'><Login /></Route>

          <Route exact path='/'>
            <Dashboard />
            <Main />
          </Route>
          
          {/* abonne section */}

          <Route exact path='/abonne/add'>
            <Dashboard />
            <Add />
          </Route>

          <Route exact path='/abonne/search'>
            <Dashboard />
            <Search />
          </Route>

          <Route path='/abonne/edit'>
            <Dashboard />
            <Edit />
          </Route>

          <Route path='/abonne/show'>
            <Dashboard />
            <Show />
          </Route>

          {/* document section */}

          <Route path='/document/add'>
            <Dashboard />
            <DocumentAdd />
          </Route>

          <Route path='/document/search'>
            <Dashboard />
            <DocumentSearch />
          </Route>

          <Route path='/document/edit'>
            <Dashboard />
            <DocumentEdit />
          </Route>

          <Route path='/document/show'>
            <Dashboard />
            <DocumentShow />
          </Route>
        
        </Switch>
      </Router>
    </div>
  );
}

export default App;