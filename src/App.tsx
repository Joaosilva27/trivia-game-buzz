import { useState, useEffect, CSSProperties } from "react";
import { GoogleGenAI } from "@google/genai";
import { prompt } from "./components/Prompt";
import "./App.css";
import StartGame from "./components/StartGame";
import ChoosingTrivia from "./components/ChoosingTrivia";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownStyles, handleAnswerHover, handleAnswerLeave, formatAnswerListItem, isAnswerCorrect } from "./components/MarkdownStyling";
import { Components } from "react-markdown";

type Difficulty = {
  name: string;
  color: string;
  hoverColor: string;
};

// Custom component props type
type CustomComponentProps = {
  node: any;
  children?: React.ReactNode;
  [key: string]: any;
};

function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [triviaLoading, setTriviaLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [isCategorySelected, setIsCategorySelected] = useState<boolean>(false);
  const [isTriviaQuestionGenerated, setIsTriviaQuestionGenerated] = useState<boolean>(false);
  const [triviaQuestion, setTriviaQuestion] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
  const [numberOfIncorrectAnswers, setNumberOfIncorrectAnswers] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; parts: Array<{ text: string }> }>>([]);

  const difficulties: Difficulty[] = [
    { name: "Easy", color: "bg-green-600", hoverColor: "hover:bg-green-500" },
    { name: "Normal", color: "bg-blue-600", hoverColor: "hover:bg-blue-500" },
    { name: "Hard", color: "bg-orange-600", hoverColor: "hover:bg-orange-500" },
    { name: "Impossible", color: "bg-red-600", hoverColor: "hover:bg-red-500" },
  ];

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
  });

  async function getTriviaQuestion() {
    setTriviaLoading(true);
    setIsTriviaQuestionGenerated(true);
    setSelectedAnswer(null);
    setShowResult(false);

    const newChatHistory = [...chatHistory];

    newChatHistory.push({
      role: "user",
      parts: [{ text: prompt + " Category: " + selectedCategory + " Difficulty: " + selectedDifficulty }],
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: newChatHistory,
      });

      newChatHistory.push({
        role: "model",
        parts: [{ text: response.text }],
      });

      setChatHistory(newChatHistory);
      setTriviaQuestion(response.text);
      setIsTriviaQuestionGenerated(true);
      setTriviaLoading(false);
    } catch (error) {
      console.error("Error with chat history:", error);

      const simpleResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt + " Category: " + selectedCategory + " Difficulty: " + selectedDifficulty }],
          },
        ],
      });

      setChatHistory([
        {
          role: "user",
          parts: [{ text: prompt + " Difficulty: " + selectedDifficulty + " Category: " + selectedCategory }],
        },
        {
          role: "model",
          parts: [{ text: simpleResponse.text }],
        },
      ]);

      setTriviaQuestion(simpleResponse.text);
      setIsTriviaQuestionGenerated(true);
    }
  }

  const handleCategorySelect = (category: string, difficulty: string) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);
    setIsCategorySelected(true);
    console.log("Selected category:", category, "Difficulty:", difficulty);
  };

  useEffect(() => {
    if (selectedCategory && isCategorySelected) {
      getTriviaQuestion();
    }
  }, [selectedCategory, isCategorySelected]);

  const handleAnswerSelection = (content: string) => {
    if (selectedAnswer || showResult) return;

    setSelectedAnswer(content);
    setShowResult(true);

    if (isAnswerCorrect(content)) {
      setUserScore(prevScore => prevScore + 1);
      setNumberOfCorrectAnswers(prevNumber => prevNumber + 1);
    } else if (userScore > 0) {
      setUserScore(prevScore => prevScore - 1);
      setNumberOfIncorrectAnswers(prevNumber => prevNumber + 1);
    }

    console.log("Selected answer:", content, isAnswerCorrect(content) ? "(CORRECT)" : "(INCORRECT)");
  };

  const onResetGame = () => {
    setGameStarted(false);
    setIsCategorySelected(false);
    setSelectedCategory("");
    setSelectedDifficulty("");
    setIsTriviaQuestionGenerated(false);
    setTriviaQuestion("");
    setSelectedAnswer(null);
    setShowResult(false);
    setUserScore(0);
    setNumberOfCorrectAnswers(0);
    setNumberOfIncorrectAnswers(0);
    setChatHistory([]);
  };

  const components: Components = {
    h1: ({ node, ...props }: CustomComponentProps) => <h1 style={markdownStyles.h1 as CSSProperties} {...props} />,
    h2: ({ node, ...props }: CustomComponentProps) => <h2 style={markdownStyles.h2 as CSSProperties} {...props} />,
    p: ({ node, ...props }: CustomComponentProps) => <p style={markdownStyles.p as CSSProperties} {...props} />,
    ul: ({ node, ...props }: CustomComponentProps) => <ul style={markdownStyles.ul as CSSProperties} {...props} />,
    ol: ({ node, ...props }: CustomComponentProps) => <ol style={markdownStyles.ol as CSSProperties} {...props} />,
    li: ({ node, ...props }: CustomComponentProps) => {
      const content = props.children ? props.children.toString() : "";
      const isSelected = selectedAnswer === content;
      const isCorrect = isAnswerCorrect(content);
      const showResultHighlight = showResult && (isSelected || isCorrect);

      const customStyle = {
        ...markdownStyles.li,
        backgroundColor: showResultHighlight
          ? isCorrect
            ? "rgba(16, 185, 129, 0.3)"
            : isSelected
            ? "rgba(239, 68, 68, 0.3)"
            : "rgba(15, 23, 42, 0.6)"
          : "rgba(15, 23, 42, 0.6)",
        border: showResultHighlight
          ? isCorrect
            ? "1px solid rgba(16, 185, 129, 0.6)"
            : isSelected
            ? "1px solid rgba(239, 68, 68, 0.6)"
            : "1px solid rgba(148, 163, 184, 0.2)"
          : "1px solid rgba(148, 163, 184, 0.2)",
      } as CSSProperties;

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
                color: "#10b981",
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
                color: "#ef4444",
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
                {triviaLoading ? (
                  <div className='flex flex-col items-center justify-center h-40 space-y-4'>
                    <div className='w-12 h-12 border-4 border-indigo-500 border-t-4 border-t-transparent rounded-full animate-spin'></div>
                    <span className='text-slate-300 text-lg font-medium'>Generating your Buzz! Trivia...</span>
                  </div>
                ) : (
                  <>
                    {userScore >= 10 ? (
                      <div className='flex flex-col items-center justify-center text-center p-8 bg-blue-900/10 border-2 border-blue-500/30 rounded-2xl max-w-md mx-auto animate-[fadeIn_0.5s_ease-in-out]'>
                        <h1 className='text-5xl font-extrabold text-sky-50 mb-6 drop-shadow-lg'>You Win!</h1>
                        <p className='text-xl text-indigo-100 mb-6'>Congratulations on your trivia mastery!</p>

                        <div className='flex justify-around w-full my-4 mb-8'>
                          <div className='flex flex-col items-center p-4 bg-green-500/20 border border-green-500/40 rounded-xl min-w-32'>
                            <span className='text-4xl font-bold text-green-500'>{numberOfCorrectAnswers}</span>
                            <span className='text-sm text-gray-300'>Correct</span>
                          </div>
                          <div className='flex flex-col items-center p-4 bg-red-500/20 border border-red-500/40 rounded-xl min-w-32'>
                            <span className='text-4xl font-bold text-red-500'>{numberOfIncorrectAnswers}</span>
                            <span className='text-sm text-gray-300'>Incorrect</span>
                          </div>
                        </div>

                        <button
                          className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-md'
                          onClick={onResetGame}
                        >
                          Return to Home
                        </button>

                        {/* Tailwind doesn't have built-in confetti animations, so I'm copy pasting this from stackoverflow lol */}
                        <div className='relative w-full h-full'>
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className='absolute w-2 h-2 rounded-full animate-ping'
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 6)],
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random() * 3}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Markdown remarkPlugins={[remarkGfm]} components={components}>
                          {triviaQuestion}
                        </Markdown>
                        {showResult && (
                          <div className='flex justify-center mt-6 space-x-4'>
                            <button
                              onClick={getTriviaQuestion}
                              className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-md'
                            >
                              Next Question
                            </button>
                          </div>
                        )}
                        <div className='flex flex-col justify-center items-center mt-4'>
                          <div className='bg-slate-800 px-6 py-3 rounded-lg border border-indigo-500/30 shadow-md shadow-indigo-500/10'>
                            <div className='flex items-center gap-3'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-6 w-6 text-yellow-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                              </svg>
                              <span className='text-xl font-medium text-white'>
                                Your Points: <span className='font-bold text-indigo-400'>{userScore}</span>
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={onResetGame}
                            className='bg-gray-600 mt-6 hover:bg-gray-700 w-fit text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-md'
                          >
                            Return to Home
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <ChoosingTrivia categories={[]} difficulties={difficulties} onSelectCategory={handleCategorySelect} />
          )}
        </div>
      ) : (
        <StartGame onStart={() => setGameStarted(true)} />
      )}
    </div>
  );
}

export default App;
