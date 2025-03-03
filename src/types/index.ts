export interface Reaction {
  type: 'mix' | 'heat' | 'dilute';
  reactant: string;
  reactant2?: string;                // Keep this for compatibility 
  secondReactant?: string;           // Add this to match your levels data
  reactantState?: 'solid' | 'liquid' | 'gas';
  secondReactantState?: 'solid' | 'liquid' | 'gas';
  product: string;
  productName?: string;
  productColor?: string;
  productState?: 'solid' | 'liquid' | 'gas';
  productConcentration?: number;
}

// Make sure your Chemical interface has properly typed state
export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  concentration: number;
  volume: number;
  state?: 'solid' | 'liquid' | 'gas';
}

export interface Level {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetSolution: {
    chemical: string;
    concentration: number;
    volume: number;
    tolerance: number; // percentage of error allowed
    state?: 'solid' | 'liquid' | 'gas'; // optional state requirement
  };
  availableChemicals: Chemical[];
  equipment: ('beaker' | 'flask' | 'pipette' | 'burette' | 'heater')[];
  hints: string[];
  theory: string;
  maxActions?: number; // maximum number of actions allowed for this level
  reactions?: Reaction[]; // reactions that can occur in this level
}

export interface GameState {
  currentLevel: number;
  levels: Level[];
  inventory: Chemical[];
  activeSolution: Chemical | null;
  targetSolution: Chemical | null;
  currentSolution: Chemical | null;  // Add this line
  score: number;
  attempts: number;
  actionsRemaining: number | null;
  gameStatus: 'menu' | 'playing' | 'success';
  message: string;
}

export type Action =
  | { type: 'START_GAME' }
  | { type: 'SELECT_LEVEL'; payload: number }
  | { type: 'SELECT_CHEMICAL'; payload: string }
  | { type: 'MIX_SOLUTIONS'; payload: { solution1: Chemical; solution2: Chemical; resultId: string } }
  | { type: 'DILUTE_SOLUTION'; payload: { solution: Chemical; water: Chemical; amount: number; dilutionId: string } }
  | { type: 'REDUCE_VOLUME'; payload: { solution: Chemical; amount: number; resultId: string } }
  | { type: 'HEAT_SOLUTION'; payload: { solution: Chemical; resultId: string } }
  | { type: 'CHECK_SOLUTION'; payload: { solution: Chemical } }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESTART_LEVEL' }  // Keep this one
  | { type: 'RETURN_TO_MENU' }
  | { type: 'SET_MESSAGE'; payload: string };