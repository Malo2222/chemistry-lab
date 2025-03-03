import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ChemicalItem from './ChemicalItem';
import { Beaker, FlaskRound as Flask, Pipette, Trash2, FlipHorizontal as MixerHorizontal, Droplets, Info, ArrowRight, Flame, Thermometer, Scissors, Moon, Sun } from 'lucide-react';
import { Home } from 'lucide-react';

const LabBench: React.FC = () => {
  const { state, dispatch } = useGame();
  const [dilutionAmount, setDilutionAmount] = useState<number>(10);
  const [reductionAmount, setReductionAmount] = useState<number>(10);
  const [showTheory, setShowTheory] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  const currentLevel = state.levels[state.currentLevel - 1];
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };
  const renderSolutionComparison = () => {
    if (!state.currentSolution || !state.targetSolution) return null;
    
    const target = state.levels[state.currentLevel - 1].targetSolution;
    const tolerance = target.tolerance || 5;
    
    const concDiff = Math.abs((state.currentSolution.concentration - target.concentration) / target.concentration) * 100;
    const volumeDiff = Math.abs((state.currentSolution.volume - target.volume) / target.volume) * 100;
    
    const concWithinTolerance = concDiff <= tolerance;
    const volWithinTolerance = volumeDiff <= tolerance;
    
    return (
      <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded border">
        <h4 className="text-sm font-medium mb-1">Progress</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Concentration Difference:</span>
              <span className={concWithinTolerance ? 'text-green-600' : 'text-red-600'}>
                {concDiff.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded overflow-hidden">
              <div 
                className={`h-2 ${concWithinTolerance ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, 100 - concDiff)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Volume Difference:</span>
              <span className={volWithinTolerance ? 'text-green-600' : 'text-red-600'}>
                {volumeDiff.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded overflow-hidden">
              <div 
                className={`h-2 ${volWithinTolerance ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, 100 - volumeDiff)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Handle solution selection
  const handleSolutionSelect = (solutionId: string) => {
    setSelectedSolutions(prev => {
      if (prev.includes(solutionId)) {
        return prev.filter(id => id !== solutionId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, solutionId];
    });
  };
  
  // Handle mixing selected solutions
  const handleMix = () => {
    if (selectedSolutions.length !== 2) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Select exactly two solutions to mix',
      });
      return;
    }
    
    const solution1 = state.inventory.find(chem => chem.id === selectedSolutions[0]);
    const solution2 = state.inventory.find(chem => chem.id === selectedSolutions[1]);
    
    if (!solution1 || !solution2) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Error: One or more solutions not found',
      });
      return;
    }
    
    // Check for reactions based on mixing
    const mixReaction = currentLevel.reactions?.find(r => 
      r.type === 'mix' && 
      ((r.reactant === solution1.formula && r.reactant2 === solution2.formula) ||
       (r.reactant === solution2.formula && r.reactant2 === solution1.formula)) &&
      (r.reactantState === undefined || r.reactantState === solution1.state) 
    );
    
    if (mixReaction) {
      // React the chemicals
      const newSolution = {
        id: `mix-${Date.now()}`,
        name: mixReaction.productName || 'Reaction Product',
        formula: mixReaction.product,
        color: mixReaction.productColor || solution1.color,
        concentration: (solution1.concentration + solution2.concentration) / 2,
        volume: solution1.volume + solution2.volume,
        state: mixReaction.productState || 'liquid',
      };
      
      const updatedInventory = state.inventory.filter(
        chem => !selectedSolutions.includes(chem.id)
      );
      
      const actionsAfterMix = state.actionsRemaining !== null ? state.actionsRemaining - 1 : null;
      
      dispatch({
        type: 'SET_MESSAGE',
        payload: `Reaction: ${solution1.formula} + ${solution2.formula} → ${newSolution.formula}`,
      });
      
      dispatch({
        type: 'MIX_SOLUTIONS',
        payload: {
          solution1,
          solution2,
          resultId: newSolution.id,
        },
      });
    } else {
      // Regular mixing
      dispatch({
        type: 'MIX_SOLUTIONS',
        payload: {
          solution1,
          solution2,
          resultId: `mix-${Date.now()}`,
        },
      });
    }
    
    // Clear selections after mixing
    setSelectedSolutions([]);
  };
  
  const handleDilute = () => {
    if (!state.activeSolution) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Select a solution to dilute first',
      });
      return;
    }
    
    const water = state.inventory.find(chem => chem.formula === 'H₂O');
    
    if (!water) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'No water available for dilution',
      });
      return;
    }
    
    dispatch({
      type: 'DILUTE_SOLUTION',
      payload: {
        solution: state.activeSolution,
        water,
        amount: dilutionAmount,
        dilutionId: `dilute-${Date.now()}`,
      },
    });
  };
  
  const handleReduceVolume = () => {
    if (!state.activeSolution) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Select a solution to reduce volume first',
      });
      return;
    }
    
    if (reductionAmount >= state.activeSolution.volume) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Cannot remove that much volume! Solution would be empty.',
      });
      return;
    }
    
    dispatch({
      type: 'REDUCE_VOLUME',
      payload: {
        solution: state.activeSolution,
        amount: reductionAmount,
        resultId: `reduced-${Date.now()}`,
      },
    });
  };
  
  const handleHeatSolution = () => {
    if (!state.activeSolution) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Select a solution to heat first',
      });
      return;
    }
    
    // Check if heater is available in this level
    if (!currentLevel.equipment.includes('heater')) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Heater not available in this level',
      });
      return;
    }
    
    dispatch({
      type: 'HEAT_SOLUTION',
      payload: {
        solution: state.activeSolution,
        resultId: `heated-${Date.now()}`,
      },
    });
  };
  
  const handleCheckSolution = () => {
    if (!state.activeSolution) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'Select a solution to check',
      });
      return;
    }
    
    dispatch({
      type: 'CHECK_SOLUTION',
      payload: {
        solution: state.activeSolution,
      },
    });
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

  // Calculate how much water is available
  const availableWater = state.inventory.find(chem => chem.formula === 'H₂O')?.volume || 0;
  
  return (
    <div className="game-container">
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">Quick Tutorial</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                  <span className="font-bold text-indigo-700">1</span>
                </div>
                <div>
                  <p className="font-medium">Select a chemical from your inventory</p>
                  <p className="text-sm text-gray-600">Click on any beaker or flask in your inventory to select it as your active solution.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                  <span className="font-bold text-indigo-700">2</span>
                </div>
                <div>
                  <p className="font-medium">Dilute your solution</p>
                  <p className="text-sm text-gray-600">Use the "Dilute" button to add water to your active solution. Enter the amount of water (in mL) you want to add.</p>
                  <p className="text-sm text-gray-600 mt-1">This will decrease the concentration but increase the volume.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                  <span className="font-bold text-indigo-700">3</span>
                </div>
                <div>
                  <p className="font-medium">Reduce volume</p>
                  <p className="text-sm text-gray-600">Use the "Reduce Volume" button to remove some liquid from your active solution.</p>
                  <p className="text-sm text-gray-600 mt-1">This keeps the concentration the same but decreases the volume.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                  <span className="font-bold text-indigo-700">4</span>
                </div>
                <div>
                  <p className="font-medium">Mix compatible solutions</p>
                  <p className="text-sm text-gray-600">The "Mix Solutions" button combines your active solution with another compatible solution.</p>
                  <p className="text-sm text-gray-600 mt-1">This can be used to combine volumes of the same chemical or to create reactions between different chemicals.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                  <span className="font-bold text-indigo-700">5</span>
                </div>
                <div>
                  <p className="font-medium">Heat solutions (when available)</p>
                  <p className="text-sm text-gray-600">If a heater is available, you can use it to heat solutions, potentially causing state changes or chemical reactions.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                  <span className="font-bold text-indigo-700">6</span>
                </div>
                <div>
                  <p className="font-medium">Match the target solution</p>
                  <p className="text-sm text-gray-600">Your goal is to create a solution that matches the formula, state, concentration, and volume of the target solution.</p>
                  <p className="text-sm text-gray-600 mt-1">Use the "Check Solution" button to see how close you are.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 rounded-full p-2 mt-1">
                  <span className="font-bold text-indigo-700">7</span>
                </div>
                <div>
                  <p className="font-medium">Action limits</p>
                  <p className="text-sm text-gray-600">Some levels limit the number of actions you can perform. Each dilution, mixing, volume reduction, or heating counts as one action.</p>
                  <p className="text-sm text-gray-600 mt-1">You'll earn bonus points for completing levels with fewer actions!</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> For the first level, try diluting the 1.0 M NaCl solution with water to reach both the target concentration (0.5 M) and volume (100 mL).
                </p>
              </div>
            </div>
            <button 
              className="mt-6 btn-primary w-full"
              onClick={() => setShowTutorial(false)}
            >
              Got it! Let's start
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Level {state.currentLevel}</h2>
          <span className={`level-badge ${currentLevel.difficulty === 'easy' ? 'level-easy' : 
            currentLevel.difficulty === 'medium' ? 'level-medium' : 'level-hard'}`}>
            {currentLevel.difficulty}
          </span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="font-medium">Target Solution</h3>
          <ChemicalItem chemical={state.targetSolution || undefined} type="flask" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Your Solution</h3>
          <ChemicalItem chemical={state.currentSolution || undefined} type="flask" />
          {state.currentSolution && renderSolutionComparison()}

        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Inventory</h3>
        <div className="grid grid-cols-4 gap-4">
          {state.inventory.map(chemical => (
            <div
              key={chemical.id}
              className={`cursor-pointer transition-transform ${
                selectedSolutions.includes(chemical.id) ? 'scale-110' : ''
              }`}
              onClick={() => handleSolutionSelect(chemical.id)}
            >
              <ChemicalItem chemical={chemical} type="beaker" />
            </div>
          ))}
        </div>
      </div>
      
      
<div className="flex flex-wrap gap-2 mb-4">
  <button
    className="btn-primary"
    onClick={handleMix}
    disabled={selectedSolutions.length !== 2}
  >
    <MixerHorizontal size={18} />
    Mix
  </button>
  
  <div className="flex items-center gap-2">
    <button
      className="btn-secondary"
      onClick={handleDilute}
      disabled={!state.activeSolution}
    >
      <Droplets size={18} />
      Dilute
    </button>
    <input
      type="number"
      className="w-16 px-2 py-1 border rounded dark:bg-slate-700 dark:border-slate-600"
      value={dilutionAmount}
      onChange={(e) => setDilutionAmount(Math.max(0, parseInt(e.target.value) || 0))}
      min="0"
      max="100"
    />
    <span className="text-sm">mL</span>
  </div>
  
  <div className="flex items-center gap-2">
    <button
      className="btn-secondary"
      onClick={handleReduceVolume}
      disabled={!state.activeSolution}
    >
      <Scissors size={18} />
      Reduce
    </button>
    <input
      type="number"
      className="w-16 px-2 py-1 border rounded dark:bg-slate-700 dark:border-slate-600"
      value={reductionAmount}
      onChange={(e) => setReductionAmount(Math.max(0, parseInt(e.target.value) || 0))}
      min="0"
      max="100"
    />
    <span className="text-sm">mL</span>
  </div>
  
  <button
    className="btn-secondary"
    onClick={handleHeatSolution}
    disabled={!state.activeSolution}
  >
    <Flame size={18} />
    Heat
  </button>
  
  <button
    className="btn-secondary"
    onClick={handleCheckSolution}
    disabled={!state.currentSolution}
  >
    <Info size={18} />
    Check
  </button>
  
  <button
    className="btn-danger"
    onClick={() => dispatch({ type: 'RESTART_LEVEL' })}
  >
    <Trash2 size={18} />
    Reset
  </button>
  <div className="flex flex-wrap gap-2 mb-4">
  
  <button
    className="btn-secondary"
    onClick={() => dispatch({ type: 'RETURN_TO_MENU' })}
  >
    <Home size={18} />
    Menu
  </button>
</div>
</div>

{/* Add this section to display the active solution */}
{state.activeSolution && (
  <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
    <h3 className="text-md font-medium mb-1">Active Solution</h3>
    <p className="text-sm">{state.activeSolution.name} - {state.activeSolution.formula}</p>
    <p className="text-sm">{state.activeSolution.concentration.toFixed(2)}M, {state.activeSolution.volume.toFixed(1)}mL</p>
  </div>
)}

{state.message && (
  <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
    {state.message}
  </div>
)}  </div>
  );
};

export default LabBench;