import React from 'react';
import { useGame } from '../context/GameContext';
import { Award, ArrowRight, Home } from 'lucide-react';

const GameSuccess: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleNextLevel = () => {
    dispatch({ type: 'NEXT_LEVEL' });
  };
  
  const handleReturnToMenu = () => {
    dispatch({ type: 'RETURN_TO_MENU' });
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <Award className="h-16 w-16 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white-800 mb-2">Level Complete!</h2>
        <p className="text-gray-600">{state.message}</p>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-indigo-700 mb-2">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-indigo-600">Total Score</p>
            <p className="text-xl font-bold text-indigo-800">{state.score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-indigo-600">Attempts</p>
            <p className="text-xl font-bold text-indigo-800">{state.attempts}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {state.currentLevel < state.levels.length ? (
          <button 
            className="btn-primary flex items-center justify-center"
            onClick={handleNextLevel}
          >
            Next Level <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-green-700 mb-2">Congratulations!</h3>
            <p className="text-green-600">You've completed all levels!</p>
          </div>
        )}
        
        <button 
          className="btn-secondary flex items-center justify-center"
          onClick={handleReturnToMenu}
        >
          Return to Menu <Home className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default GameSuccess;