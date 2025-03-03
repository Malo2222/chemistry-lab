import React from 'react';
import { useGame } from '../context/GameContext';
import { FlaskRound as Flask, Beaker, Award, BookOpen } from 'lucide-react';

const GameMenu: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' });
  };
  
  const handleSelectLevel = (levelId: number) => {
    dispatch({ type: 'SELECT_LEVEL', payload: levelId });
  };
  
  const renderDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="level-badge level-easy">Easy</span>;
      case 'medium':
        return <span className="level-badge level-medium">Medium</span>;
      case 'hard':
        return <span className="level-badge level-hard">Hard</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="dark">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Flask className="h-16 w-16 text-indigo-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-400 rounded-full opacity-50 animate-pulse"></div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold .text-white-800 { mb-2">Chemistry Lab: Dilution Master</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Master the concepts of molarity, molality, and dilution through interactive challenges. 
          Mix chemicals, perform dilutions, and create solutions with precise concentrations.
        </p>
      </div>
      
      {state.score > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-center">
          <div className="flex justify-center mb-2">
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-yellow-700 font-medium">Current Score: {state.score}</p>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-white-800">How to Play</h2>
        </div>
        <div className="dark">
          <ol className="list-decimal pl-5 space-y-2 text-white-700">
            <li><strong>Select chemicals</strong> from your inventory by clicking on them</li>
            <li><strong>Dilute solutions</strong> by adding water to decrease concentration but increase volume</li>
            <li><strong>Mix compatible solutions</strong> to combine their volumes and solutes</li>
            <li><strong>Match both the concentration AND volume</strong> of the target solution</li>
            <li>Use the <strong>C₁V₁ = C₂V₂</strong> formula to calculate dilutions</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>First Level Tip:</strong> To create a 0.5 M solution from a 1.0 M solution, you need to double the volume. 
              If you start with 50 mL of 1.0 M solution and add 50 mL of water, you'll get 100 mL of 0.5 M solution.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white-800 mb-4">Select a Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.levels.map((level) => (
            <div 
              key={level.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
              onClick={() => handleSelectLevel(level.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white-800">
                  Level {level.id}: {level.name}
                </h3>
                {renderDifficultyBadge(level.difficulty)}
              </div>
              <p className="text-sm text-gray-600 mb-2">{level.description}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Beaker className="h-4 w-4 mr-1" />
                <span>Target: {level.targetSolution.chemical} ({level.targetSolution.concentration} M, {level.targetSolution.volume} mL)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <button 
          className="btn-primary px-8 py-3 text-lg flex items-center justify-center mx-auto"
          onClick={handleStartGame}
        >
          <Flask className="h-5 w-5 mr-2" />
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameMenu;