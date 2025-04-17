import React, { useState } from "react";
import { Difficulty } from "../App";

interface ChoosingTriviaProps {
  categories: string[];
  difficulties: Difficulty[];
  onSelectCategory: (category: string, difficulty: string) => void;
}

const ChoosingTrivia: React.FC<ChoosingTriviaProps> = ({ categories, difficulties, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const allCategories = [
    "General",
    "History",
    "Geography",
    "Music",
    "Science & Nature",
    "Sports",
    "Entertainment",
    "Culture",
    "Technology & Inventions",
  ];

  const displayCategories = categories?.length > 0 ? categories : allCategories;

  const categoryIcons: { [key: string]: string } = {
    General: "🎲",
    History: "📜",
    Geography: "🌍",
    Music: "🎵",
    "Science & Nature": "🔬",
    Sports: "⚽",
    Entertainment: "🎬",
    Culture: "🎭",
    "Technology & Inventions": "💡",
  };

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
    setSelectedDifficulty(null);
  };

  const handleDifficultySelect = (difficulty: string): void => {
    setSelectedDifficulty(difficulty);
    if (selectedCategory) {
      onSelectCategory(selectedCategory, difficulty);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900'>
      <div className='w-full max-w-3xl px-6 py-10 text-center'>
        <h1 className='mb-10 text-4xl font-bold text-white'>
          SELECT CATEGORY
          <span className='block mt-2 text-xl font-medium text-amber-400'>Choose your Buzz! trivia topic</span>
        </h1>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {displayCategories.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`flex items-center justify-center p-4 text-xl font-medium text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 group ${
                selectedCategory === category
                  ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-400/30"
                  : "bg-slate-700 hover:bg-amber-500 hover:text-slate-900 hover:shadow-lg hover:shadow-amber-400/30"
              }`}
            >
              <span className='mr-3 text-2xl group-hover:scale-125 transition-transform duration-300'>{categoryIcons[category] || "🎯"}</span>
              {category}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <>
            <h2 className='mt-8 mb-4 text-2xl font-bold text-white'>SELECT DIFFICULTY</h2>
            <div className='flex flex-wrap justify-center gap-3'>
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.name}
                  onClick={() => handleDifficultySelect(difficulty.name)}
                  className={`px-6 py-3 text-lg font-medium text-white rounded-lg transition-all duration-300 ${difficulty.color} ${
                    difficulty.hoverColor
                  } ${selectedDifficulty === difficulty.name ? "ring-4 ring-white" : ""}`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </>
        )}

        <p className='mt-8 text-sm text-slate-400'>
          {!selectedCategory
            ? "Select a category to begin Buzzing!"
            : selectedDifficulty
            ? `Ready to play ${selectedCategory} trivia on ${selectedDifficulty} difficulty!`
            : "Now select a difficulty level"}
        </p>
      </div>
    </div>
  );
};

export default ChoosingTrivia;
