import React from "react";
import LayingBuzzImage from "../images/layingBuzz.png";

interface StartGameProps {
  onStart: () => void;
}

const StartGame: React.FC<StartGameProps> = ({ onStart }) => {
  return (
    <div className="start-game">
      <h1>Welcome to Buzz! Trivia Game!</h1>
      <button onClick={onStart}>Start Game</button>
      <img src={LayingBuzzImage} />
    </div>
  );
};

export default StartGame;
