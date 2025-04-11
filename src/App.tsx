import { useState } from "react";
import "./App.css";
import StartGame from "./components/StartGame";
import ChoosingTrivia from "./components/ChoosingTrivia";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategorySelected(true);
    console.log("Selected category:", category);
  };

  return (
    <div>
      {gameStarted ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 h-dvh">
          {isCategorySelected ? (
            <div>selected</div>
          ) : (
            <ChoosingTrivia
              categories={[]}
              onSelectCategory={handleCategorySelect}
            />
          )}
        </div>
      ) : (
        <StartGame onStart={() => setGameStarted(true)} />
      )}
    </div>
  );
}

export default App;
