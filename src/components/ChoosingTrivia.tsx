import React, { useState } from "react";
import BuzzLogo from "../images/BuzzLogo.png";

interface ChoosingTriviaProps {
  categories: string[];
  difficulties: Array<{
    name: string;
    color: string;
    hoverColor: string;
  }>;
  onSelectCategory: (category: string, difficulty: string) => void;
  customTrivia: string;
  onCustomTriviaChange: (value: string) => void;
}

const ChoosingTrivia: React.FC<ChoosingTriviaProps> = ({ categories, difficulties, onSelectCategory, customTrivia, onCustomTriviaChange }) => {
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
    "Pop Culture",
    "Memes",
    customTrivia,
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
    "Pop Culture": "💅",
    Memes: "💀",
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedDifficulty(null);
  };

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    if (selectedCategory) {
      onSelectCategory(selectedCategory, difficulty);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900'>
      <div className='w-full max-w-3xl px-6 py-10 text-center'>
        <div className='flex justify-center flex-row mt-2 mb-10'>
          <span className='block mt-2 text-3xl font-medium text-amber-400'>Choose your</span>
          <img src={BuzzLogo} className='w-15 ml-2.5 mr-3' />
          <span className='block mt-2 text-3xl font-medium text-amber-400'>Trivia topic:</span>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {displayCategories.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`flex items-center truncate justify-center text-wrap p-4 text-xl font-medium text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 group ${
                selectedCategory === category
                  ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-400/30"
                  : "bg-slate-700 hover:bg-amber-500 hover:text-slate-900 hover:shadow-lg hover:shadow-amber-400/30"
              }`}
            >
              <span className='mr-3 text-2xl group-hover:scale-125 transition-transform duration-300'>{categoryIcons[category] || "🔮"}</span>
              {category}
            </button>
          ))}
        </div>

        <div className='mb-8 mt-8 bg-slate-700/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-600'>
          <label className='block text-lg text-amber-300 font-medium mb-3'>
            🔮 Don't see your preferred topic? Create your own custom trivia (optional):
          </label>
          <input
            value={customTrivia}
            onChange={e => onCustomTriviaChange(e.target.value)}
            placeholder='Enter custom topic here...'
            className='w-full px-4 py-3 bg-slate-800 truncate text-white rounded-lg border-2 border-amber-400/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 text-center text-lg placeholder-slate-400'
          />
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
      </div>
    </div>
  );
};

export default ChoosingTrivia;
