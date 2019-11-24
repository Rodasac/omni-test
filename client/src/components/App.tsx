import React, {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { userReducer, initialState } from './store/reducers';

import '../styles/index.scss';
import '../styles/gc-fonts/style.css';

import Login from './Login';
import Details from './Details';

const store = createStore(
  userReducer,
  initialState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

/*
* Entry Component and Initializer on OmniTest
* @constructor
*/
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/' exact={true}>
            <Details />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
