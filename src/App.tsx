import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import GameMenu from './components/GameMenu';
import LabBench from './components/LabBench';
import GameSuccess from './components/GameSuccess';
import { FlaskRound as Flask, Github } from 'lucide-react';

const GameContainer: React.FC = () => {
  const { state } = useGame();
  
  const renderGameContent = () => {
    switch (state.gameStatus) {
      case 'menu':
        return <GameMenu />;
      case 'playing':
        return <LabBench />;
      case 'success':
        return <GameSuccess />;
      default:
        return <GameMenu />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Flask className="h-8 w-8 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Chemistry Lab: Dilution Master</h1>
        </div>
        <div className="flex items-center text-sm">
          <span className="mr-4">Score: {state.score}</span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto">
        {renderGameContent()}
      </main>
      
      <footer className="max-w-6xl mx-auto mt-8 text-center text-sm text-gray-500">
        <p>Graham Malone - Extra Credit for Mr. Sandoval's Chemistry Class</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;