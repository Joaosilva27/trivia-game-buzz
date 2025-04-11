import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import "./App.css";
import StartGame from "./components/StartGame";
import ChoosingTrivia from "./components/ChoosingTrivia";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
  }

  main();

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
