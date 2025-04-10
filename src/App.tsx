import { useState } from "react";
import "./App.css";
import StartGame from "./components/StartGame";
import ChoosingTrivia from "./components/ChoosingTrivia";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div>
      {gameStarted ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 h-dvh">
          <ChoosingTrivia />
        </div>
      ) : (
        <StartGame onStart={() => setGameStarted(true)} />
      )}
    </div>
  );
}

export default App;
