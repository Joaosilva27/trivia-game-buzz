import React from "react";
import LayingBuzzImage from "../images/layingBuzz.png";
import GithubIcon from "../images/githubIcon.png";

interface StartGameProps {
  onStart: () => void;
}

const StartGame: React.FC<StartGameProps> = ({ onStart }) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900'>
      <div className='w-full max-w-lg px-8 py-10 text-center'>
        <h1 className='mb-6 text-4xl font-bold text-white'>
          BUZZ!
          <span className='block mt-2 text-2xl font-medium text-amber-400'>TRIVIA GAME</span>
        </h1>

        <div className='relative mb-8'>
          <div className='absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70 rounded-xl'></div>
          <img src={LayingBuzzImage} alt='Buzz Character' className='relative z-10 mx-auto h-80' />
        </div>

        <button
          onClick={onStart}
          className='px-12 py-4 text-xl font-bold text-slate-900 transition-all duration-300 bg-amber-400 rounded-full hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/30 transform hover:-translate-y-1'
        >
          PLAY NOW
        </button>

        <a href='https://www.joaoportfolio.com' target='_blank'>
          <div className='flex justify-center items-center mt-6'>
            <p className=' text-sm underline text-slate-400'>Built by João Silva</p>
            <img src={GithubIcon} className='w-4 object-scale-down ml-1.5 animate-bounce' />
          </div>
        </a>
      </div>
    </div>
  );
};

export default StartGame;
