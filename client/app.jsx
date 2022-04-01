import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import EarthRefRoutes from '/client/modules/er/routes';
import KArArRoutes from '/client/modules/karar/routes';

const supportsHistory = 'pushState' in window.history;

const App = () => (
  <Router forceRefresh={!supportsHistory}>
    <Switch>
      <Redirect exact from="/" to="/KArAr"/>
      <Route path="/KArAr" component={KArArRoutes}/>
      <Route               component={EarthRefRoutes}/>
    </Switch>
  </Router>
);

export default App;