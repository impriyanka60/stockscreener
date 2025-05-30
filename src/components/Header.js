// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="logo">StockDash</div>
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/screener" onClick={() => setMenuOpen(false)}>Screener</Link>
        <Link to="/compare" onClick={() => setMenuOpen(false)}>Compare</Link>
        <Link to="/watchlist" onClick={() => setMenuOpen(false)}>Watchlist</Link>
        <Link to="/insights" onClick={() => setMenuOpen(false)}>Insights</Link>
        <Link to="/alerts" onClick={() => setMenuOpen(false)}>Alerts</Link>
      </nav>
      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
}

export default Header;
