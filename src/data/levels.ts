import { Level } from '../types';

const levels: Level[] = [
  {
    id: 1,
    name: "Introduction to Molarity",
    description: "Create a solution with the correct molarity by mixing the provided chemicals.",
    difficulty: "easy",
    targetSolution: {
      chemical: "NaCl",
      concentration: 0.5, // 0.5 M
      volume: 100, // 100 mL
      tolerance: 5, // 5% error allowed
      state: "liquid",
    },
    availableChemicals: [
      {
        id: "nacl-1",
        name: "Sodium Chloride",
        formula: "NaCl",
        color: "solution-blue",
        concentration: 1.0, // 1.0 M
        volume: 50, // 50 mL (changed from 100 to make the first level more intuitive)
        state: "liquid",
      },
      {
        id: "water-1",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 200, // 200 mL
        state: "liquid",
      },
    ],
    equipment: ["beaker", "flask", "pipette"],
    hints: [
      "Remember that molarity (M) = moles of solute / volume of solution in liters",
      "To dilute a solution, you can add more solvent (water)",
      "Use C₁V₁ = C₂V₂ to calculate the required volumes",
      "For this level: 1.0 M × 50 mL = 0.5 M × 100 mL",
    ],
    theory: "Molarity is defined as the number of moles of solute per liter of solution. It's a measure of concentration. The formula is M = n/V, where M is molarity, n is moles of solute, and V is volume in liters. When diluting a solution, the amount of solute stays the same, but the volume increases, so the concentration decreases.",
  },
  {
    id: 2,
    name: "Serial Dilution",
    description: "Perform a serial dilution to create a solution with the specified concentration.",
    difficulty: "medium",
    targetSolution: {
      chemical: "HCl",
      concentration: 0.1, // 0.1 M
      volume: 100, // 100 mL
      tolerance: 3, // 3% error allowed
      state: "liquid",
    },
    availableChemicals: [
      {
        id: "hcl-1",
        name: "Hydrochloric Acid",
        formula: "HCl",
        color: "solution-yellow",
        concentration: 1.0, // 1.0 M
        volume: 50, // 50 mL
        state: "liquid",
      },
      {
        id: "water-2",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 200, // 200 mL
        state: "liquid",
      },
    ],
    equipment: ["beaker", "flask", "pipette"],
    hints: [
      "Serial dilution involves diluting a solution multiple times",
      "Each dilution step reduces the concentration by a specific factor",
      "You can use multiple beakers to perform the dilution steps",
      "Try diluting the 1.0 M solution to 0.5 M first, then to 0.1 M",
    ],
    theory: "Serial dilution is a technique where a solution is diluted multiple times in sequence. Each dilution reduces the concentration by a specific factor. It's commonly used in laboratories to create solutions with very low concentrations. The formula C₁V₁ = C₂V₂ applies to each dilution step.",
  },
  {
    id: 3,
    name: "Volume Reduction",
    description: "Reduce the volume of a solution while maintaining its concentration.",
    difficulty: "medium",
    targetSolution: {
      chemical: "CuSO₄",
      concentration: 0.5, // 0.5 M
      volume: 50, // 50 mL
      tolerance: 4, // 4% error allowed
      state: "liquid",
    },
    availableChemicals: [
      {
        id: "cuso4-1",
        name: "Copper Sulfate",
        formula: "CuSO₄",
        color: "solution-blue",
        concentration: 0.5, // 0.5 M
        volume: 100, // 100 mL
        state: "liquid",
      },
      {
        id: "water-3",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 150, // 150 mL
        state: "liquid",
      },
    ],
    equipment: ["beaker", "flask", "pipette"],
    hints: [
      "You need to reduce the volume without changing the concentration",
      "The 'Reduce Volume' button lets you remove liquid from the solution",
      "Try removing exactly 50 mL from the 100 mL solution",
      "Remember: reducing volume doesn't change concentration, just total volume",
    ],
    theory: "Reducing the volume of a solution doesn't change its concentration if no chemical reaction occurs. The number of moles of solute decreases in proportion to the volume, keeping the ratio (molarity) constant. Chemists often reduce volume by evaporation, but in this simulation, we can directly remove some solution volume.",
  },
  {
    id: 4,
    name: "Double Dilution with Limited Actions",
    description: "Perform a double dilution with a limited number of actions to create the target solution.",
    difficulty: "hard",
    targetSolution: {
      chemical: "KMnO₄",
      concentration: 0.05, // 0.05 M
      volume: 100, // 100 mL
      tolerance: 2, // 2% error allowed
      state: "liquid",
    },
    availableChemicals: [
      {
        id: "kmno4-1",
        name: "Potassium Permanganate",
        formula: "KMnO₄",
        color: "solution-purple",
        concentration: 0.5, // 0.5 M
        volume: 50, // 50 mL
        state: "liquid",
      },
      {
        id: "water-4",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 250, // 250 mL
        state: "liquid",
      },
    ],
    maxActions: 3, // Limit to 3 actions
    equipment: ["beaker", "flask", "pipette"],
    hints: [
      "You only have 3 actions to complete this level",
      "Plan your dilutions carefully to minimize the number of steps",
      "For the most efficient method: 0.5 M × 10 mL = 0.05 M × 100 mL",
      "Try reducing the volume first, then diluting to the target",
    ],
    theory: "Double dilution is a technique where a solution is diluted twice in sequence. It's useful when you need to create a solution with a very low concentration from a concentrated stock solution. In a laboratory setting, efficiency is important - minimizing the number of steps reduces error and saves time.",
  },
  {
    id: 5,
    name: "Heat Reaction",
    description: "Heat a solution to trigger a chemical reaction, then achieve the target concentration.",
    difficulty: "medium",
    targetSolution: {
      chemical: "CuO",
      concentration: 0.25, // 0.25 M
      volume: 100, // 100 mL
      tolerance: 5, // 5% error allowed
      state: "solid",
    },
    availableChemicals: [
      {
        id: "cu-hydroxide-1",
        name: "Copper Hydroxide",
        formula: "Cu(OH)₂",
        color: "solution-blue",
        concentration: 0.5, // 0.5 M
        volume: 100, // 100 mL
        state: "liquid",
      },
      {
        id: "water-5",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 150, // 150 mL
        state: "liquid",
      },
    ],
    equipment: ["beaker", "flask", "pipette", "heater"],
    reactions: [
      {
        type: "heat",
        reactant: "Cu(OH)₂",
        reactantState: "liquid",
        product: "CuO",
        productName: "Copper Oxide",
        productColor: "solution-red",
        productState: "solid",
      }
    ],
    hints: [
      "Copper hydroxide decomposes to copper oxide when heated",
      "First dilute the solution to the right concentration",
      "Then heat the solution to trigger the chemical reaction",
      "The reaction: Cu(OH)₂ → CuO + H₂O",
    ],
    theory: "Thermal decomposition is a chemical reaction where heat causes a substance to break down into simpler substances. In this case, copper hydroxide decomposes into copper oxide and water when heated. This type of reaction is common in inorganic chemistry and metallurgy.",
  },
  {
    id: 6,
    name: "Mixing Different Solutions",
    description: "Mix two different solutions to create a new chemical through reaction.",
    difficulty: "medium",
    targetSolution: {
      chemical: "AgCl",
      concentration: 0.1, // 0.1 M
      volume: 100, // 100 mL
      tolerance: 4, // 4% error allowed
      state: "solid",
    },
    availableChemicals: [
      {
        id: "agno3-1",
        name: "Silver Nitrate",
        formula: "AgNO₃",
        color: "solution-teal",
        concentration: 0.2, // 0.2 M
        volume: 50, // 50 mL
        state: "liquid",
      },
      {
        id: "nacl-6",
        name: "Sodium Chloride",
        formula: "NaCl",
        color: "solution-blue",
        concentration: 0.2, // 0.2 M
        volume: 50, // 50 mL
        state: "liquid",
      },
      {
        id: "water-6",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 100, // 100 mL
        state: "liquid",
      },
    ],
    equipment: ["beaker", "flask", "pipette"],
    reactions: [
      {
        type: "mix",
        reactant: "AgNO₃",
        reactantState: "liquid",
        secondReactant: "NaCl",
        secondReactantState: "liquid",
        product: "AgCl",
        productName: "Silver Chloride",
        productColor: "solution-purple",
        productState: "solid",
      }
    ],
    hints: [
      "Mix silver nitrate with sodium chloride to form silver chloride",
      "AgNO₃ + NaCl → AgCl + NaNO₃",
      "You'll need equal volumes of the reactants for a complete reaction",
      "Adjust the concentrations first if needed using dilution",
    ],
    theory: "Double displacement reactions occur when the cations and anions of two ionic compounds exchange partners. In this reaction, silver nitrate and sodium chloride react to form silver chloride (which precipitates as a solid) and sodium nitrate. These reactions are often used to create precipitates for analysis or isolation.",
  },
  {
    id: 7,
    name: "Precise Concentration Control",
    description: "Prepare a solution with exact concentration and volume using a limited number of actions.",
    difficulty: "hard",
    targetSolution: {
      chemical: "KCl",
      concentration: 0.125, // 0.125 M
      volume: 80, // 80 mL
      tolerance: 2, // 2% error allowed
      state: "liquid",
    },
    availableChemicals: [
      {
        id: "kcl-1",
        name: "Potassium Chloride",
        formula: "KCl",
        color: "solution-orange",
        concentration: 0.5, // 0.5 M
        volume: 50, // 50 mL
        state: "liquid",
      },
      {
        id: "water-7",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 200, // 200 mL
        state: "liquid",
      },
    ],
    maxActions: 2, // Limit to 2 actions
    equipment: ["beaker", "flask", "pipette"],
    hints: [
      "You only have 2 actions to complete this level",
      "Calculate exactly how much water you need to add to achieve both the concentration and volume",
      "For this level: 0.5 M × 20 mL = 0.125 M × 80 mL",
      "First reduce the KCl volume to 20 mL, then add 60 mL of water",
    ],
    theory: "Dilution calculations are fundamental in analytical chemistry. When preparing solutions of precise concentration, chemists must calculate exact volumes. The formula C₁V₁ = C₂V₂ applies to dilution problems and allows us to calculate the final concentration or the required amount of diluent.",
  },
  {
    id: 8,
    name: "Multi-Step Reaction Sequence",
    description: "Perform a sequence of reactions to create the target solution.",
    difficulty: "hard",
    targetSolution: {
      chemical: "CO₂",
      concentration: 0.1, // 0.1 M
      volume: 100, // 100 mL
      tolerance: 3, // 3% error allowed
      state: "gas",
    },
    availableChemicals: [
      {
        id: "caco3-1",
        name: "Calcium Carbonate",
        formula: "CaCO₃",
        color: "solution-yellow",
        concentration: 0.2, // 0.2 M
        volume: 100, // 100 mL
        state: "solid",
      },
      {
        id: "hcl-8",
        name: "Hydrochloric Acid",
        formula: "HCl",
        color: "solution-green",
        concentration: 0.4, // 0.4 M
        volume: 50, // 50 mL
        state: "liquid",
      },
      {
        id: "water-8",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 100, // 100 mL
        state: "liquid",
      },
    ],
    maxActions: 5,
    equipment: ["beaker", "flask", "pipette", "heater"],
    reactions: [
      {
        type: "mix",
        reactant: "CaCO₃",
        reactantState: "solid",
        secondReactant: "HCl",
        secondReactantState: "liquid",
        product: "CO₂",
        productName: "Carbon Dioxide",
        productColor: "solution-teal",
        productState: "liquid", // Initially formed in solution
      },
      {
        type: "heat",
        reactant: "CO₂",
        reactantState: "liquid",
        product: "CO₂",
        productState: "gas",
      }
    ],
    hints: [
      "First mix calcium carbonate with hydrochloric acid: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂",
      "Then heat the solution to convert the dissolved CO₂ to gas state",
      "Make sure to dilute to the correct concentration before heating",
      "You have 5 actions to complete all the necessary steps",
    ],
    theory: "Many important chemical processes involve multiple reaction steps. In this case, we're forming carbon dioxide through an acid-base reaction with a carbonate, then using heat to change its physical state. This is similar to processes used in industry and laboratories for gas preparation.",
  },
  {
    id: 9,
    name: "Advanced Mixing Challenge",
    description: "Mix multiple solutions to create a compound with specific properties.",
    difficulty: "hard",
    targetSolution: {
      chemical: "Fe(OH)₃",
      concentration: 0.15, // 0.15 M
      volume: 100, // 100 mL
      tolerance: 2, // 2% error allowed
      state: "solid",
    },
    availableChemicals: [
      {
        id: "fecl3-1",
        name: "Iron(III) Chloride",
        formula: "FeCl₃",
        color: "solution-orange",
        concentration: 0.3, // 0.3 M
        volume: 75, // 75 mL
        state: "liquid",
      },
      {
        id: "naoh-1",
        name: "Sodium Hydroxide",
        formula: "NaOH",
        color: "solution-yellow",
        concentration: 0.45, // 0.45 M
        volume: 50, // 50 mL
        state: "liquid",
      },
      {
        id: "water-9",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 150, // 150 mL
        state: "liquid",
      },
    ],
    maxActions: 4,
    equipment: ["beaker", "flask", "pipette"],
    reactions: [
      {
        type: "mix",
        reactant: "FeCl₃",
        reactantState: "liquid",
        secondReactant: "NaOH",
        secondReactantState: "liquid",
        product: "Fe(OH)₃",
        productName: "Iron(III) Hydroxide",
        productColor: "solution-red",
        productState: "solid",
      }
    ],
    hints: [
      "The reaction is: FeCl₃ + 3NaOH → Fe(OH)₃ + 3NaCl",
      "You'll need to dilute both solutions before mixing",
      "For stoichiometric mixing, you need 1 mole of FeCl₃ for every 3 moles of NaOH",
      "Calculate carefully to achieve the target concentration of 0.15 M",
    ],
    theory: "Precipitation reactions form insoluble compounds (precipitates) from soluble reactants. Iron(III) hydroxide is a common precipitate in qualitative analysis. Such reactions follow stoichiometry rules, where reactants combine in specific molar ratios according to balanced chemical equations.",
  },
  {
    id: 10,
    name: "Master Laboratory Challenge",
    description: "Use all the techniques you've learned to solve this multi-step synthesis problem.",
    difficulty: "hard",
    targetSolution: {
      chemical: "CuCl₂",
      concentration: 0.1, // 0.1 M
      volume: 100, // 100 mL
      tolerance: 1, // 1% error allowed - most precise requirement
      state: "liquid",
    },
    availableChemicals: [
      {
        id: "cuo-1",
        name: "Copper Oxide",
        formula: "CuO",
        color: "solution-red",
        concentration: 0.2, // 0.2 M
        volume: 50, // 50 mL
        state: "solid",
      },
      {
        id: "hcl-10",
        name: "Hydrochloric Acid",
        formula: "HCl",
        color: "solution-green",
        concentration: 0.5, // 0.5 M
        volume: 80, // 80 mL
        state: "liquid",
      },
      {
        id: "water-10",
        name: "Distilled Water",
        formula: "H₂O",
        color: "bg-transparent",
        concentration: 0,
        volume: 200, // 200 mL
        state: "liquid",
      },
    ],
    maxActions: 4,
    equipment: ["beaker", "flask", "pipette", "heater"],
    reactions: [
      {
        type: "mix",
        reactant: "CuO",
        reactantState: "solid",
        secondReactant: "HCl",
        secondReactantState: "liquid",
        product: "CuCl₂",
        productName: "Copper(II) Chloride",
        productColor: "solution-blue",
        productState: "liquid",
      }
    ],
    hints: [
      "The reaction is: CuO + 2HCl → CuCl₂ + H₂O",
      "You need to mix the correct amounts of each reactant",
      "Dilute the solution carefully to exactly 0.1 M",
      "The tolerance is only 1% - you need to be extremely precise!",
    ],
    theory: "In this master challenge, you're synthesizing copper(II) chloride through an acid-base reaction. This is a real-world synthesis procedure commonly used in laboratories. It requires careful stoichiometric calculations, precise measurements, and attention to detail - all hallmarks of skilled laboratory work.",
  },
];

export default levels;