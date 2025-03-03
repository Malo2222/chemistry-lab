import React from 'react';
import { Chemical } from '../types';
import { useGame } from '../context/GameContext';
import { Beaker, FlaskRound as Flask, Pipette, CloudSnow, Cloud } from 'lucide-react';

interface ChemicalItemProps {
  chemical: Chemical;
  type?: 'beaker' | 'flask' | 'pipette';
}

const ChemicalItem: React.FC<ChemicalItemProps> = ({ chemical, type = 'beaker' }) => {
  const { state, dispatch } = useGame();
  const isActive = state.activeSolution?.id === chemical.id;
  
  const handleClick = () => {
    dispatch({
      type: 'SET_ACTIVE_SOLUTION',
      payload: isActive ? null : chemical,
    });
  };
  
  const fillHeight = (chemical.volume / 100) * 100;
  
  const renderBubbles = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="bubble"
        style={{
          left: `${20 + i * 30}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ));
  };
  
  const renderGasParticles = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="gas-particle"
        style={{
          left: `${10 + i * 20}%`,
          animationDelay: `${i * 0.3}s`,
        }}
      />
    ));
  };
  
  const renderSolidParticles = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="solid-particle"
        style={{
          left: `${5 + i * 12}%`,
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ));
  };
  
  const renderContainer = () => {
    const baseClasses = `relative cursor-pointer transition-all duration-200 ${
      isActive ? 'scale-105 shadow-lg' : 'hover:scale-102'
    }`;
    
    switch (type) {
      case 'flask':
        return (
          <div className={`${baseClasses} flask`}>
            <div className="flask-neck" />
            <div className="flask-body">
              <div
                className="solution"
                style={{
                  backgroundColor: chemical.color,
                  height: `${fillHeight}%`,
                }}
              >
                {chemical.state === 'liquid' && renderBubbles()}
                {chemical.state === 'gas' && renderGasParticles()}
                {chemical.state === 'solid' && renderSolidParticles()}
              </div>
            </div>
            <div className="flask-base" />
          </div>
        );
      
      case 'pipette':
        return (
          <div className={`${baseClasses} pipette`}>
            <div className="pipette-tip" />
            <div className="pipette-body">
              <div
                className="solution"
                style={{
                  backgroundColor: chemical.color,
                  height: `${fillHeight}%`,
                }}
              >
                {chemical.state === 'liquid' && renderBubbles()}
                {chemical.state === 'gas' && renderGasParticles()}
                {chemical.state === 'solid' && renderSolidParticles()}
              </div>
            </div>
            <div className="pipette-bulb" />
          </div>
        );
      
      default:
        return (
          <div className={`${baseClasses} beaker`}>
            <div className="beaker-body">
              <div
                className="solution"
                style={{
                  backgroundColor: chemical.color,
                  height: `${fillHeight}%`,
                }}
              >
                {chemical.state === 'liquid' && renderBubbles()}
                {chemical.state === 'gas' && renderGasParticles()}
                {chemical.state === 'solid' && renderSolidParticles()}
              </div>
            </div>
            <div className="beaker-base" />
          </div>
        );
    }
  };
  
  const renderIcon = () => {
    const chemicalState = chemical.state || 'liquid';
    
    // State-specific icons
    if (chemicalState === 'solid') {
      return <CloudSnow className="h-5 w-5 text-blue-500" />;
    } else if (chemicalState === 'gas') {
      return <Cloud className="h-5 w-5 text-gray-400" />;
    }
    
    // Default container icons
    switch (type) {
      case 'flask':
        return <Flask className="h-5 w-5 text-gray-600" />;
      case 'pipette':
        return <Pipette className="h-5 w-5 text-gray-600" />;
      default:
        return <Beaker className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const renderStateLabel = () => {
    if (!chemical.state) return null;
    
    return (
      <div className={`text-xs px-1 py-0.5 rounded ${
        chemical.state === 'solid' ? 'bg-blue-100 text-blue-700' :
        chemical.state === 'gas' ? 'bg-gray-100 text-gray-700' :
        'bg-teal-100 text-teal-700'
      }`}>
        {chemical.state}
      </div>
    );
  };
  
  return (
    <div onClick={handleClick} className="chemical-item">
      {renderContainer()}
      <div className="chemical-info">
        <div className="flex items-center justify-center gap-1 mb-1">
          {renderIcon()}
          <span className="chemical-formula">{chemical.formula}</span>
        </div>
        <span className="chemical-volume">{chemical.volume.toFixed(1)} mL</span>
        {renderStateLabel()}
      </div>
    </div>
  );
};

export default ChemicalItem;