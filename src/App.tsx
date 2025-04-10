import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { prompt } from "./components/Prompt";
import "./App.css";
import StartGame from "./components/StartGame";
import ChoosingTrivia from "./components/ChoosingTrivia";

function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCategorySelected, setIsCategorySelected] = useState<boolean>(false);
  const [isTriviaQuestionGenerated, setIsTriviaQuestionGenerated] =
    useState<boolean>(false);
  const [triviaQuestion, setTriviaQuestion] = useState<string | undefined>("");

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
  });

  async function getTriviaQuestion() {
    setIsTriviaQuestionGenerated(true);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt + selectedCategory,
    });
    console.log(response.text);
    setTriviaQuestion(response.text);
    setIsTriviaQuestionGenerated(true);
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategorySelected(true);
    console.log("Selected category:", category);
  };

  useEffect(() => {
    if (selectedCategory && isCategorySelected) {
      getTriviaQuestion();
    }
  }, [selectedCategory, isCategorySelected]);

  return (
    <div>
      {gameStarted ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 h-dvh">
          {isCategorySelected ? (
            <div className="text-white">
              {isTriviaQuestionGenerated ? (
                <span>{triviaQuestion}</span>
              ) : (
                <span>Loading...</span>
              )}
            </div>
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
