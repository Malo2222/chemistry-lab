import React, { createContext, useContext, useReducer } from 'react';
import { GameState, Action, Chemical } from '../types';
import levels from '../data/levels';

const initialState: GameState = {
  currentLevel: 0,
  levels,
  inventory: [],
  activeSolution: null,
  targetSolution: null,
  currentSolution: null,
  score: 0,
  attempts: 0,
  actionsRemaining: null,
  gameStatus: 'menu',
  message: 'Welcome to Chemistry Lab: Dilution Master!',
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStatus: 'playing',
        currentLevel: 1,
        inventory: [...state.levels[0].availableChemicals],
        targetSolution: {
          id: 'target',
          name: state.levels[0].targetSolution.chemical,
          formula: state.levels[0].targetSolution.chemical,
          color: 'solution-green',
          concentration: state.levels[0].targetSolution.concentration,
          volume: state.levels[0].targetSolution.volume,
        },
        currentSolution: null, // Reset current solution
        actionsRemaining: state.levels[0].maxActions || null,
        message: `Level 1: ${state.levels[0].name}`,
      };
      
    case 'SELECT_LEVEL':
      const levelIndex = action.payload - 1;
      if (levelIndex < 0 || levelIndex >= state.levels.length) {
        return state;
      }
      
      return {
        ...state,
        gameStatus: 'playing',
        currentLevel: action.payload,
        inventory: [...state.levels[levelIndex].availableChemicals],
        targetSolution: {
          id: 'target',
          name: state.levels[levelIndex].targetSolution.chemical,
          formula: state.levels[levelIndex].targetSolution.chemical,
          color: 'solution-green',
          concentration: state.levels[levelIndex].targetSolution.concentration,
          volume: state.levels[levelIndex].targetSolution.volume,
        },
        currentSolution: null, // Reset current solution
        actionsRemaining: state.levels[levelIndex].maxActions || null,
        message: `Level ${action.payload}: ${state.levels[levelIndex].name}`,
      };
      
    case 'SELECT_CHEMICAL':
      const selectedChemical = state.inventory.find(chem => chem.id === action.payload);
      return {
        ...state,
        activeSolution: selectedChemical || null,
        currentSolution: selectedChemical || state.currentSolution, // Update current solution when selecting a chemical
        message: selectedChemical 
          ? `Selected: ${selectedChemical.name}` 
          : 'No chemical selected'
      };
      
    case 'MIX_SOLUTIONS':
      const { solution1, solution2, resultId } = action.payload;
      
      // Get current level to check for reactions
      const currentLvl = state.levels[state.currentLevel - 1];
      
      // Check if these two solutions have a reaction when mixed
      // Only check if reactions exist for the level
      const mixReaction = currentLvl.reactions?.find(r => 
        r.type === 'mix' && 
        ((r.reactant === solution1.formula && (r.reactant2 === solution2.formula || r.secondReactant === solution2.formula)) ||
         (r.reactant === solution2.formula && (r.reactant2 === solution1.formula || r.secondReactant === solution1.formula)))
      );
      
      let mixedSolution: Chemical;
      
      if (mixReaction) {
        // Apply the reaction to create a new product
        mixedSolution = {
          id: resultId,
          name: mixReaction.productName || `${solution1.name} + ${solution2.name}`,
          formula: mixReaction.product,
          color: mixReaction.productColor || solution1.color,
          // Fall back to standard concentration calculation if no specific value
          concentration: mixReaction.productConcentration !== undefined 
            ? mixReaction.productConcentration
            : ((solution1.concentration * solution1.volume) + (solution2.concentration * solution2.volume)) / (solution1.volume + solution2.volume),
          volume: solution1.volume + solution2.volume,
          state: mixReaction.productState || 'liquid',
        };
      } else {
        // No reaction - just mix the solutions
        const totalVolume = solution1.volume + solution2.volume;
        const totalMoles = (solution1.concentration * solution1.volume / 1000) + 
                          (solution2.concentration * solution2.volume / 1000);
        const newConcentration = totalMoles / (totalVolume / 1000);
        
        // Create new solution
        mixedSolution = {
          id: resultId,
          name: `${solution1.name} + ${solution2.name}`,
          formula: `${solution1.formula} + ${solution2.formula}`,
          color: solution1.color, // Could blend colors based on ratio
          concentration: newConcentration,
          volume: totalVolume,
          state: solution1.state, // Maintain the state
        };
      }
      
      // Remove the original solutions and add the new one
      const updatedInventoryAfterMix = state.inventory.filter(
        chem => chem.id !== solution1.id && chem.id !== solution2.id
      );

      // Update actions remaining
      const actionsAfterMix = state.actionsRemaining !== null ? state.actionsRemaining - 1 : null;
      
      // Check if actions exhausted
      if (actionsAfterMix === 0) {
        return {
          ...state,
          inventory: [...updatedInventoryAfterMix, mixedSolution],
          activeSolution: mixedSolution,
          currentSolution: mixedSolution,
          actionsRemaining: actionsAfterMix,
          message: mixReaction 
            ? `Reaction occurred: ${solution1.formula} + ${solution2.formula} → ${mixedSolution.formula}. You've used all your available actions!`
            : "You've used all your available actions! Check your solution or restart.",
        };
      }
      
      return {
        ...state,
        inventory: [...updatedInventoryAfterMix, mixedSolution],
        activeSolution: mixedSolution,
        currentSolution: mixedSolution,
        actionsRemaining: actionsAfterMix,
        message: mixReaction 
          ? `Reaction occurred: ${solution1.formula} + ${solution2.formula} → ${mixedSolution.formula}`
          : `Mixed ${solution1.formula} with ${solution2.formula}`,
      };
      
    case 'DILUTE_SOLUTION':
      const { solution, water, amount, dilutionId } = action.payload;
      
      if (amount > water.volume) {
        return {
          ...state,
          message: "Not enough water for this dilution!",
        };
      }
      
      // Calculate new concentration and volume
      const newVolume = solution.volume + amount;
      const newConc = (solution.concentration * solution.volume) / newVolume;
      
      // Create diluted solution
      const dilutedSolution: Chemical = {
        id: dilutionId,
        name: solution.name,
        formula: solution.formula,
        color: solution.color,
        concentration: newConc,
        volume: newVolume,
        state: solution.state, // Maintain the state
      };
      
      // Update water volume
      const updatedWater: Chemical = {
        ...water,
        volume: water.volume - amount,
      };
      
      // Update inventory
      const inventoryAfterDilution = state.inventory.filter(
        chem => chem.id !== solution.id && chem.id !== water.id
      );
      
      if (updatedWater.volume > 0) {
        inventoryAfterDilution.push(updatedWater);
      }

      // Update actions remaining
      const actionsAfterDilute = state.actionsRemaining !== null ? state.actionsRemaining - 1 : null;
      
      // Check if actions exhausted
      if (actionsAfterDilute === 0) {
        return {
          ...state,
          inventory: [...inventoryAfterDilution, dilutedSolution],
          activeSolution: dilutedSolution,
          currentSolution: dilutedSolution, // Update current solution
          actionsRemaining: actionsAfterDilute,
          message: "You've used all your available actions! Check your solution or restart.",
        };
      }
      
      return {
        ...state,
        inventory: [...inventoryAfterDilution, dilutedSolution],
        activeSolution: dilutedSolution,
        currentSolution: dilutedSolution, // Update current solution
        actionsRemaining: actionsAfterDilute,
      };

    case 'REDUCE_VOLUME':
      const { solution: reduceSolution, amount: reduceAmount, resultId: reduceId } = action.payload;
      
      if (reduceAmount >= reduceSolution.volume) {
        return {
          ...state,
          message: "Cannot remove that much volume! Solution would be empty.",
        };
      }
      
      // The concentration remains the same, only volume changes
      const reducedSolution: Chemical = {
        id: reduceId,
        name: reduceSolution.name,
        formula: reduceSolution.formula,
        color: reduceSolution.color,
        concentration: reduceSolution.concentration,
        volume: reduceSolution.volume - reduceAmount,
        state: reduceSolution.state, // Maintain the state
      };
      
      // Update inventory
      const inventoryAfterReduction = state.inventory.filter(
        chem => chem.id !== reduceSolution.id
      );

      // Update actions remaining
      const actionsAfterReduce = state.actionsRemaining !== null ? state.actionsRemaining - 1 : null;
      
      // Check if actions exhausted
      if (actionsAfterReduce === 0) {
        return {
          ...state,
          inventory: [...inventoryAfterReduction, reducedSolution],
          activeSolution: reducedSolution,
          currentSolution: reducedSolution, // Update current solution
          actionsRemaining: actionsAfterReduce,
          message: "You've used all your available actions! Check your solution or restart.",
        };
      }
      
      return {
        ...state,
        inventory: [...inventoryAfterReduction, reducedSolution],
        activeSolution: reducedSolution,
        currentSolution: reducedSolution, // Update current solution
        actionsRemaining: actionsAfterReduce,
      };

    case 'HEAT_SOLUTION':
      const { solution: heatSolution, resultId: heatedId } = action.payload;
      
      // Get current level to check for reactions
      const lvl = state.levels[state.currentLevel - 1];
      
      // Check if this solution has a reaction when heated
      const reaction = lvl.reactions?.find(r => 
        r.type === 'heat' && 
        r.reactant === heatSolution.formula &&
        (r.reactantState === undefined || r.reactantState === heatSolution.state)
      );
      
      let heatedSolution: Chemical;
      
      if (reaction) {
        // Apply the reaction
        heatedSolution = {
          id: heatedId,
          name: reaction.productName || heatSolution.name,
          formula: reaction.product,
          color: reaction.productColor || heatSolution.color,
          concentration: heatSolution.concentration,
          volume: heatSolution.volume,
          state: reaction.productState || 'liquid',
        };
      } else {
        // Just change the state to indicate it's been heated
        heatedSolution = {
          ...heatSolution,
          id: heatedId,
          state: heatSolution.state === 'solid' ? 'liquid' : 
                 heatSolution.state === 'liquid' ? 'gas' : heatSolution.state,
        };
      }
      
      // Update inventory
      const inventoryAfterHeating = state.inventory.filter(
        chem => chem.id !== heatSolution.id
      );

      // Update actions remaining
      const actionsAfterHeat = state.actionsRemaining !== null ? state.actionsRemaining - 1 : null;
      
      // Check if actions exhausted
      if (actionsAfterHeat === 0) {
        return {
          ...state,
          inventory: [...inventoryAfterHeating, heatedSolution],
          activeSolution: heatedSolution,
          currentSolution: heatedSolution, // Update current solution
          actionsRemaining: actionsAfterHeat,
          message: reaction 
            ? `Reaction occurred: ${heatSolution.formula} → ${heatedSolution.formula}. You've used all your available actions!` 
            : "You've used all your available actions! Check your solution or restart.",
        };
      }
      
      return {
        ...state,
        inventory: [...inventoryAfterHeating, heatedSolution],
        activeSolution: heatedSolution,
        currentSolution: heatedSolution, // Update current solution
        actionsRemaining: actionsAfterHeat,
        message: reaction 
          ? `Reaction occurred: ${heatSolution.formula} → ${heatedSolution.formula}` 
          : `Solution heated ${heatSolution.state === 'solid' ? 'into liquid' : 
             heatSolution.state === 'liquid' ? 'into gas' : ''}`,
      };
      
    case 'CHECK_SOLUTION':
      const { solution: checkSolution } = action.payload;
      const currentLevel = state.levels[state.currentLevel - 1];
      const target = currentLevel.targetSolution;
      
      // Calculate percentage difference
      const concDiff = Math.abs((checkSolution.concentration - target.concentration) / target.concentration) * 100;
      const volumeDiff = Math.abs((checkSolution.volume - target.volume) / target.volume) * 100;
      
      // Check formula match - required for chemistry accuracy
      const formulaMatch = checkSolution.formula === target.chemical;
      
      // Additional check for state if specified in the target
      const stateMatch = target.state ? checkSolution.state === target.state : true;
      
      const isCorrect = formulaMatch && stateMatch && concDiff <= target.tolerance && volumeDiff <= target.tolerance;
      
      // Calculate score based on accuracy
      const accuracyScore = Math.max(0, 100 - (concDiff + volumeDiff));
      const levelScore = Math.floor(accuracyScore * (currentLevel.difficulty === 'easy' ? 1 : 
                                                    currentLevel.difficulty === 'medium' ? 1.5 : 2));
      
      // Bonus for using fewer actions than allowed
      const actionBonus = state.actionsRemaining !== null && currentLevel.maxActions 
        ? Math.floor((state.actionsRemaining / currentLevel.maxActions) * 50) 
        : 0;
      
      if (isCorrect) {
        return {
          ...state,
          gameStatus: 'success',
          score: state.score + levelScore + actionBonus,
          message: `Success! Your solution is within the acceptable range. Score: +${levelScore} ${actionBonus > 0 ? `(+${actionBonus} action bonus)` : ''}`,
        };
      } else {
        let failureReason = '';
        if (!formulaMatch) {
          failureReason = `The chemical formula ${checkSolution.formula} doesn't match the target ${target.chemical}. `;
        } else if (!stateMatch && target.state) {
          failureReason = `The chemical state (${checkSolution.state}) doesn't match the target state (${target.state}). `;
        } else {
          failureReason = `The concentration is ${concDiff.toFixed(1)}% off and volume is ${volumeDiff.toFixed(1)}% off from the target. `;
        }
        
        return {
          ...state,
          attempts: state.attempts + 1,
          message: `Not quite right. ${failureReason}`,
        };
      }
      
    case 'NEXT_LEVEL':
      const nextLevel = state.currentLevel + 1;
      if (nextLevel > state.levels.length) {
        return {
          ...state,
          gameStatus: 'menu',
          message: `Congratulations! You've completed all levels with a score of ${state.score}!`,
        };
      }
      
      const nextLevelData = state.levels[nextLevel - 1];
      return {
        ...state,
        gameStatus: 'playing',
        currentLevel: nextLevel,
        inventory: [...nextLevelData.availableChemicals],
        activeSolution: null,
        currentSolution: null, // Reset current solution
        targetSolution: {
          id: 'target',
          name: nextLevelData.targetSolution.chemical,
          formula: nextLevelData.targetSolution.chemical,
          color: 'solution-green',
          concentration: nextLevelData.targetSolution.concentration,
          volume: nextLevelData.targetSolution.volume,
          state: nextLevelData.targetSolution.state,
        },
        actionsRemaining: nextLevelData.maxActions || null,
        message: `Level ${nextLevel}: ${nextLevelData.name}`,
      };
      
    case 'RESTART_LEVEL':
      const currentLevelData = state.levels[state.currentLevel - 1];
      return {
        ...state,
        gameStatus: 'playing',
        inventory: [...currentLevelData.availableChemicals],
        activeSolution: null,
        currentSolution: null, // Reset current solution
        actionsRemaining: currentLevelData.maxActions || null,
        message: `Restarting Level ${state.currentLevel}: ${currentLevelData.name}`,
      };
      
    case 'RETURN_TO_MENU':
      return {
        ...state,
        gameStatus: 'menu',
        currentLevel: 0,
        inventory: [],
        activeSolution: null,
        targetSolution: null,
        currentSolution: null,
        actionsRemaining: null,
        message: 'Welcome to Chemistry Lab: Dilution Master!',
      };
      
    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload,
      };
      
    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);