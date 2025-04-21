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
import axios from "axios";

type Difficulty = {
  name: string;
  color: string;
  hoverColor: string;
};

function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [triviaLoading, setTriviaLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [isCategorySelected, setIsCategorySelected] = useState<boolean>(false);
  const [_isTriviaQuestionGenerated, setIsTriviaQuestionGenerated] = useState<boolean>(false);
  const [triviaQuestion, setTriviaQuestion] = useState<string | undefined>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [funFact, setFunFact] = useState<Promise<any>>();
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
  const [numberOfIncorrectAnswers, setNumberOfIncorrectAnswers] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string | undefined; parts: Array<{ text: string | undefined }> }>>([]);

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
    fetchFunFact();

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
      // setTriviaLoading(false);
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
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 style={markdownStyles.h1 as CSSProperties} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 style={markdownStyles.h2 as CSSProperties} {...props}>
        {children}
      </h2>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p style={markdownStyles.p as CSSProperties} {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul style={markdownStyles.ul as CSSProperties} {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol style={markdownStyles.ol as CSSProperties} {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => {
      const content = children ? children.toString() : "";
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
          {...props}
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

  const renderScoreMeter = () => {
    const maxScore = 10;
    return (
      <div className='fixed sm:bottom-4 md:right-0 lg:right-35 xl:right-80 sm:right-6 top-1/2 transform -translate-y-1/2 flex flex-col-reverse items-center justify-between bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg p-3 h-120 w-20 max-sm:relative max-sm:top-0 max-sm:transform-none max-sm:mt-6 max-sm:mx-auto max-sm:h-20 max-sm:w-full max-sm:flex-row-reverse'>
        <img
          className='w-30 max-sm:w-16 max-sm:h-16'
          src='https://games-we-played.myshopify.com/cdn/shop/products/57_a4e484dc-f7ae-4182-980b-2e7242316819_800x.png?v=1688414566'
        />

        <div className='text-center mb-1 max-sm:mb-0 max-sm:mx-3'>
          <span className='text-indigo-400 font-bold text-lg'>{userScore}</span>
          <span className='block text-slate-400 text-xs'>POINTS</span>
        </div>

        <div className='flex flex-col-reverse gap-1 w-full mb-2 flex-grow max-sm:flex-row max-sm:mb-0 max-sm:mx-2 max-sm:h-full'>
          {[...Array(maxScore)].map((_, index) => {
            const isActive = userScore > index;
            return (
              <div
                key={index}
                className={`h-full flex-grow rounded ${
                  isActive ? "bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-md shadow-indigo-600/20" : "bg-slate-700/50"
                } transition-all duration-300 max-sm:w-full max-sm:h-8`}
              />
            );
          })}
        </div>

        <div className='flex items-center justify-center w-full bg-slate-900/60 rounded-t-lg py-1 border-b border-indigo-500/30 max-sm:rounded-l-lg max-sm:rounded-tr-none max-sm:h-full max-sm:border-r max-sm:border-b-0 max-sm:py-0'>
          <div className='flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600'>
            <span className='text-white text-xs font-bold'>{maxScore}</span>
          </div>
        </div>
      </div>
    );
  };

  const fetchFunFact = async () => {
    try {
      const funFact = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random").then(res => res.data);

      setFunFact(funFact.text);

      console.log(funFact.text);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {gameStarted ? (
        <div className='bg-gradient-to-br from-slate-800 to-slate-900 h-dvh'>
          {isCategorySelected ? (
            <div className='text-white pt-2 px-4 h-dvh flex justify-center items-center flex-col flex-wrap'>
              <div className='w-full max-w-2xl bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-700'>
                {triviaLoading ? (
                  <div className='flex flex-col items-center justify-center h-40 space-y-4'>
                    <span>Fun fact: {funFact}</span>
                    <img
                      className='w-12 animate-spin'
                      style={{ animationDuration: "5000ms" }}
                      src='https://games-we-played.myshopify.com/cdn/shop/products/57_a4e484dc-f7ae-4182-980b-2e7242316819_800x.png?v=1688414566'
                    />
                    <span className='text-slate-300 text-xs font-medium'>Generating your Buzz! Trivia...</span>
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
                        <div className='flex justify-center mt-6'>
                          <button
                            onClick={onResetGame}
                            className='bg-gray-600 hover:bg-gray-700 w-fit text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-md'
                          >
                            Return to Home
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {!triviaLoading && userScore < 10 && renderScoreMeter()}
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
