// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <nav className="header">
      <Link to="/">Home</Link>
      <Link to="/screener">Screener</Link>
      <Link to="/compare">Compare</Link>
      <Link to="/watchlist">Watchlist</Link>
      <Link to="/insights">Insights</Link>
      <Link to="/alerts">Alerts</Link>
    </nav>
  );
}

export default Header;
