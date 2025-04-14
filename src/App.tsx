import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { prompt } from "./components/Prompt";
import "./App.css";
import StartGame from "./components/StartGame";
import ChoosingTrivia from "./components/ChoosingTrivia";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownStyles, handleAnswerHover, handleAnswerLeave, formatAnswerListItem, isAnswerCorrect } from "./components/MarkdownStyling";

function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCategorySelected, setIsCategorySelected] = useState<boolean>(false);
  const [isTriviaQuestionGenerated, setIsTriviaQuestionGenerated] = useState<boolean>(false);
  const [triviaQuestion, setTriviaQuestion] = useState<string | undefined>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
  });

  async function getTriviaQuestion() {
    setIsTriviaQuestionGenerated(true);
    setSelectedAnswer(null);
    setShowResult(false);

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

  const handleAnswerSelection = (content: string) => {
    if (selectedAnswer || showResult) return; // Prevent multiple selections

    setSelectedAnswer(content);
    setShowResult(true);

    if (isAnswerCorrect(content)) {
      setUserScore(prevScore => prevScore + 1);
    }

    // Log whether the answer is correct
    console.log("Selected answer:", content, isAnswerCorrect(content) ? "(CORRECT)" : "(INCORRECT)");
  };

  const components = {
    h1: ({ node, ...props }) => <h1 style={markdownStyles.h1} {...props} />,
    h2: ({ node, ...props }) => <h2 style={markdownStyles.h2} {...props} />,
    p: ({ node, ...props }) => <p style={markdownStyles.p} {...props} />,
    ul: ({ node, ...props }) => <ul style={markdownStyles.ul} {...props} />,
    ol: ({ node, ...props }) => <ol style={markdownStyles.ol} {...props} />,
    li: ({ node, ...props }) => {
      const content = props.children ? props.children.toString() : "";
      const isSelected = selectedAnswer === content;
      const isCorrect = isAnswerCorrect(content);
      const showResultHighlight = showResult && (isSelected || isCorrect);

      const customStyle = {
        ...markdownStyles.li,
        backgroundColor: showResultHighlight
          ? isCorrect
            ? "rgba(16, 185, 129, 0.3)" // Green background for correct
            : isSelected
            ? "rgba(239, 68, 68, 0.3)"
            : "rgba(15, 23, 42, 0.6)" // Red for wrong selection
          : "rgba(15, 23, 42, 0.6)", // Default
        border: showResultHighlight
          ? isCorrect
            ? "1px solid rgba(16, 185, 129, 0.6)" // Green border for correct
            : isSelected
            ? "1px solid rgba(239, 68, 68, 0.6)"
            : "1px solid rgba(148, 163, 184, 0.2)" // Red for wrong selection
          : "1px solid rgba(148, 163, 184, 0.2)", // Default
      };

      return (
        <li
          style={customStyle}
          onMouseEnter={!showResult ? handleAnswerHover : undefined}
          onMouseLeave={!showResult ? handleAnswerLeave : undefined}
          onClick={() => handleAnswerSelection(content)}
        >
          {formatAnswerListItem(content)}
          {showResult && isCorrect && (
            <span
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#10b981", // Green
                fontWeight: "bold",
              }}
            >
              ✓ Correct
            </span>
          )}
          {showResult && isSelected && !isCorrect && (
            <span
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#ef4444", // Red
                fontWeight: "bold",
              }}
            >
              ✗ Incorrect
            </span>
          )}
        </li>
      );
    },
  };

  return (
    <div>
      {gameStarted ? (
        <div className='bg-gradient-to-br from-slate-800 to-slate-900 h-dvh'>
          {isCategorySelected ? (
            <div className='text-white pt-2 px-4 h-dvh flex justify-center items-center flex-col'>
              <div className='w-full max-w-2xl bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-700'>
                {isTriviaQuestionGenerated ? (
                  <>
                    <Markdown remarkPlugins={[remarkGfm]} components={components}>
                      {triviaQuestion}
                    </Markdown>

                    {showResult && (
                      <div className='flex justify-center mt-6'>
                        <button
                          onClick={getTriviaQuestion}
                          className='bg-indigo-600 hover:bg-indigo-700 text-white mb-2 font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-md'
                        >
                          Next Question
                        </button>
                      </div>
                    )}
                    <span className='underline text-lg'>Your points: {userScore}</span>
                  </>
                ) : (
                  <div className='flex justify-center items-center h-40'>
                    <span className='text-xl'>Loading question...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ChoosingTrivia categories={[]} onSelectCategory={handleCategorySelect} />
          )}
        </div>
      ) : (
        <StartGame onStart={() => setGameStarted(true)} />
      )}
    </div>
  );
}

export default App;
