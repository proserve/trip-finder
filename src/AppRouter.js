import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';

const AppRouter = () => (
  <Router>
    <Route path="/:departure?/:arrival?" exact component={Home} />
  </Router>
);

export default AppRouter;
