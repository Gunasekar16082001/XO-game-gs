import React, { useState } from 'react';
import './App';

function Navbar({ refreshPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-center">
        <h1>Tic-Tac-Toe</h1>
      </div>
      <div className="navbar-corner">
        <button
          className="refresh-button"
          onClick={refreshPage}

        >
          Reset All 
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;
