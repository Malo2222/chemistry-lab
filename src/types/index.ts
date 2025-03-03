export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  concentration: number; // in mol/L
  volume: number; // in mL
  state?: 'solid' | 'liquid' | 'gas'; // physical state
}

export interface Reaction {
  type: 'heat' | 'mix';
  reactant: string; // formula of reactant
  reactantState?: 'solid' | 'liquid' | 'gas'; // optional state requirement
  secondReactant?: string; // for mix reactions
  secondReactantState?: 'solid' | 'liquid' | 'gas'; // optional state requirement
  product: string; // formula of product
  productName?: string; // name of product (if different from formula)
  productColor?: string; // color of product solution
  productState?: 'solid' | 'liquid' | 'gas'; // state of product
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
  score: number;
  attempts: number;
  actionsRemaining: number | null; // null means unlimited actions
  gameStatus: 'menu' | 'playing' | 'success' | 'failure';
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
  | { type: 'RESTART_LEVEL' }
  | { type: 'RETURN_TO_MENU' }
  | { type: 'SET_MESSAGE'; payload: string };