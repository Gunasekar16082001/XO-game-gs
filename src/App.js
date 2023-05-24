import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './Nav';

function Square({ value, onClick }) {
  return (
    <button className={`square ${value}`} onClick={onClick}>
      {value}
    </button>
  );
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [gameCount, setGameCount] = useState(0);
  const [winCountX, setWinCountX] = useState(0);
  const [winCountO, setWinCountO] = useState(0);
  const [drawCount, setDrawCount] = useState(0);

  useEffect(() => {
    const storedGameCount = localStorage.getItem('gameCount');
    const storedWinCountX = localStorage.getItem('winCountX');
    const storedWinCountO = localStorage.getItem('winCountO');
    const storedDrawCount = localStorage.getItem('drawCount');

    if (storedGameCount && storedWinCountX && storedWinCountO && storedDrawCount) {
      setGameCount(Number(storedGameCount));
      setWinCountX(Number(storedWinCountX));
      setWinCountO(Number(storedWinCountO));
      setDrawCount(Number(storedDrawCount));
    }
  }, []);

  useEffect(() => {
    if (gameCount >= 10) {
      clearLocalStorage();
      setWinCountX(0);
      setWinCountO(0);
      setDrawCount(0);
      setGameCount(0);
      showOverallWinner();
    }
  }, [gameCount]);

  const clearLocalStorage = () => {
    for (let i = 1; i <= 10; i++) {
      localStorage.removeItem(`game${i}`);
    }
    localStorage.removeItem('gameCount');
    localStorage.removeItem('winCountX');
    localStorage.removeItem('winCountO');
    localStorage.removeItem('drawCount');
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  };

  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const updatedSquares = [...squares];
    updatedSquares[i] = isX ? 'X' : 'O';
    setSquares(updatedSquares);
    setIsX(!isX);

    const winner = calculateWinner(updatedSquares);
    if (winner) {
      if (winner === 'X') {
        setWinCountX(winCountX + 1);
      } else {
        setWinCountO(winCountO + 1);
      }
      setGameCount(gameCount + 1);
      localStorage.setItem('gameCount', gameCount + 1);
      localStorage.setItem('winCountX', winCountX + (winner === 'X' ? 1 : 0));
      localStorage.setItem('winCountO', winCountO + (winner === 'O' ? 1 : 0));
      localStorage.setItem(`game${gameCount + 1}`, winner);
      
      if (gameCount + 1 === 10) {
        showOverallWinner();
      }
    } else if (updatedSquares.every((square) => square !== null)) {
      setGameCount(gameCount + 1);
      setDrawCount(drawCount + 1);
      localStorage.setItem('gameCount', gameCount + 1);
      localStorage.setItem('drawCount', drawCount + 1);

      if (gameCount + 1 === 10) {
        showOverallWinner();
      }
    }
  };

  const showOverallWinner = () => {
    let overallWinner;
    if (winCountX > winCountO) {
      overallWinner = 'X';
    } else if (winCountX < winCountO) {
      overallWinner = 'O';
    } else {
      overallWinner = 'Draw';
    }
    setTimeout(() => {
      alert(`Overall Winner: ${overallWinner}`);
      clearLocalStorage();
      setWinCountX(0);
      setWinCountO(0);
      setDrawCount(0);
      setGameCount(0);
      window.location.reload();
    }, 500);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsX(true);
  };
  const refreshPage= () =>{
    localStorage.clear();
    window.location.reload();
  }

  return (
  <>
      <Navbar refreshPage={refreshPage} />
    <div className="game">
      <div className="board">
        <div className="board-row">
          <Square value={squares[0]} onClick={() => handleClick(0)} />
          <Square value={squares[1]} onClick={() => handleClick(1)} />
          <Square value={squares[2]} onClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onClick={() => handleClick(3)} />
          <Square value={squares[4]} onClick={() => handleClick(4)} />
          <Square value={squares[5]} onClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onClick={() => handleClick(6)} />
          <Square value={squares[7]} onClick={() => handleClick(7)} />
          <Square value={squares[8]} onClick={() => handleClick(8)} />
        </div>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      <div className="game-stats">
        <h2>Game Stats</h2>
        <table className="game-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(gameCount, 10) }).map((_, index) => {
              const gameNumber = gameCount - index;
              const winner = localStorage.getItem(`game${gameNumber}`);
              
              return (
                <tr key={gameNumber}>
                  <td>{gameNumber}</td>
                  <td>{winner || "-"}</td>
                </tr>
              );
            }).reverse()}
          </tbody>
        </table>
        <div className="result">
          <h3>Overall Result</h3>
          <p>X Wins: {winCountX}</p>
          <p>O Wins: {winCountO}</p>
          <p>Draws: {drawCount}</p>
        </div>
       
      </div>
    </div>
    </>
  );
}


export default App;


