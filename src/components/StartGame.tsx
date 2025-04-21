import React from "react";
import BuzzLogo from "../images/BuzzLogo.png";
import BuzzHostImage from "../images/BuzzHost.png";
import GithubIcon from "../images/githubIcon.png";

interface StartGameProps {
  onStart: () => void;
}

const StartGame: React.FC<StartGameProps> = ({ onStart }) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900'>
      <div className='w-full flex justify-center items-center flex-col max-w-lg px-8 py-10 text-center'>
        <div className='flex'>
          <div className='relative mb-8'>
            <img src={BuzzHostImage} alt='Buzz Character' className='relative z-10 mx-auto h-80' />
          </div>
          <img src={BuzzLogo} className='w-26 h-26 ml-4' />
        </div>

        <button
          onClick={onStart}
          className='px-12 py-4 w-fit text-xl font-bold text-slate-900 transition-all duration-300 bg-amber-400 rounded-full hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/30 transform hover:-translate-y-1'
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
