import { useState } from "react";
import "./App.css";
import StartGame from "./components/StartGame";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div>
      <h1>Buzz! Trivia Game</h1>

      {gameStarted ? (
        <div className="game-container">
          <h2>Game in Progress...</h2>
          {/* Add game logic here */}
        </div>
      ) : (
        <StartGame onStart={() => setGameStarted(true)} />
      )}
    </div>
  );
}

export default App;
