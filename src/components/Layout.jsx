import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaMoon, FaSun } from 'react-icons/fa';

function Layout({ children, isDarkMode, setIsDarkMode }) {
  return (
    <>
      <header className="app-header">
        <div className="header-logo">
          <Link to="/">
            <h1>Meal Master 🍳</h1>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link"><FaHome /> Home</Link>
          <Link to="/shopping-list" className="nav-link"><FaShoppingCart /> Shopping List</Link>
          <button 
            className="theme-toggle" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </nav>
      </header>
      <main className="app-content">
        {children}
      </main>
    </>
  );
}

export default Layout;
