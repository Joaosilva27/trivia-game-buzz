import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import "./App.css";
import StartGame from "./components/StartGame";
import ChoosingTrivia from "./components/ChoosingTrivia";

function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCategorySelected, setIsCategorySelected] = useState<boolean>(false);
  const [triviaQuestion, setTriviaQuestion] = useState<string | undefined>("");

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
  });

  async function getTriviaQuestion() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents:
        `You are an AI that generates trivia questions for a game:

      - You will ask a trivia question based on the selected category.
      - The question should be clear and concise.
      - The question should be engaging and fun.
      - The question should be appropriate for all ages.
      - The question should be related to the selected category.
      - The question should be in English.
      - You MUST ONLY respond with the trivia question, followed by 4 possible answers, only one being correct.
      - For each of the 4 possible answers, you MUST provide a letter (A, B, C, or D) followed by the answer.
      - The correct answer should be marked with an asterisk (*) before the letter.
      - The question should be in the format: "Question? A. Answer1 B. Answer2 C. Answer3 D. Answer4"
      ` + selectedCategory,
    });
    console.log(response.text);
    setTriviaQuestion(response.text);
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
            <div className="text-white">{triviaQuestion}</div>
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
