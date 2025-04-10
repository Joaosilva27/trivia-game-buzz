import React from "react";

interface ChoosingTriviaProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

const ChoosingTrivia: React.FC<ChoosingTriviaProps> = ({
  categories,
  onSelectCategory,
}) => {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="w-full max-w-3xl px-6 py-10 text-center">
        <h1 className="mb-10 text-4xl font-bold text-white">
          SELECT CATEGORY
          <span className="block mt-2 text-xl font-medium text-amber-400">
            Choose your Buzz! trivia topic
          </span>
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayCategories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className="flex items-center justify-center p-4 text-xl font-medium text-white bg-slate-700 rounded-lg transition-all duration-300 hover:bg-amber-500 hover:text-slate-900 hover:shadow-lg hover:shadow-amber-400/30 transform hover:-translate-y-1 group"
            >
              <span className="mr-3 text-2xl group-hover:scale-125 transition-transform duration-300">
                {categoryIcons[category] || "🎯"}
              </span>
              {category}
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Select a category to begin Buzzing!
        </p>
      </div>
    </div>
  );
};

export default ChoosingTrivia;
