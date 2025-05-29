// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';

import Home from './pages/Home';
import CompanyDetails from './pages/CompanyDetails';
import Compare from './pages/Compare';
import Screener from './pages/Screener';
import Watchlist from './pages/Watchlist';
import Insights from './pages/Insights';
import Alerts from './pages/Alerts';

import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company/:symbol" element={<CompanyDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/screener" element={<Screener />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
