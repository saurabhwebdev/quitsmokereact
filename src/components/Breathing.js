import { useState, useEffect } from 'react';

export default function Breathing() {
  const [phase, setPhase] = useState('idle');
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (isActive) {
      if (phase === 'idle') {
        setPhase('inhale');
        setCountdown(4);
      } else if (countdown > 0) {
        timer = setInterval(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        if (phase === 'inhale') {
          setPhase('hold');
          setCountdown(7);
        } else if (phase === 'hold') {
          setPhase('exhale');
          setCountdown(8);
        } else if (phase === 'exhale') {
          setPhase('inhale');
          setCountdown(4);
        }
      }
    } else {
      setPhase('idle');
    }

    return () => clearInterval(timer);
  }, [isActive, phase, countdown]);

  const toggleExercise = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPhase('inhale');
      setCountdown(4);
    }
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Click to Start';
    }
  };

  const getCircleAnimation = () => {
    switch (phase) {
      case 'inhale':
        return 'animate-expand';
      case 'hold':
        return 'animate-pulse';
      case 'exhale':
        return 'animate-contract';
      default:
        return '';
    }
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale':
        return 'border-blue-500';
      case 'hold':
        return 'border-yellow-500';
      case 'exhale':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Breathing Exercise</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Take a moment to relax and reduce your cravings with this breathing exercise
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
              {/* Animated Circle with Ripple Effect */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                <div className={`absolute inset-0 ${getCircleAnimation()} rounded-full opacity-30 ${getCircleColor()}`} />
                <div className={`absolute inset-0 ${getCircleAnimation()} rounded-full opacity-60 ${getCircleColor()} delay-75`} />
                <div
                  className={`
                    w-full h-full rounded-full border-8 transition-all duration-1000 ease-in-out 
                    flex items-center justify-center relative z-10 bg-white
                    ${getCircleColor()}
                    ${getCircleAnimation()}
                  `}
                >
                  <div className="text-center">
                    <div className={`text-3xl sm:text-5xl font-bold transition-colors duration-300
                      ${phase === 'inhale' ? 'text-blue-500' : ''}
                      ${phase === 'hold' ? 'text-yellow-500' : ''}
                      ${phase === 'exhale' ? 'text-green-500' : ''}
                      ${phase === 'idle' ? 'text-gray-800' : ''}
                    `}>
                      {countdown}
                    </div>
                    <div className="text-base sm:text-xl text-gray-600 mt-2 font-medium">
                      {getInstructions()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Button with Animation */}
              <button
                onClick={toggleExercise}
                className={`
                  w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white font-medium text-base sm:text-lg
                  transform transition-all duration-200 hover:scale-105
                  ${isActive 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-primary hover:bg-red-700'
                  }
                `}
              >
                {isActive ? 'Stop Exercise' : 'Start Breathing Exercise'}
              </button>

              {/* Instructions with Icons */}
              <div className="mt-6 sm:mt-8 text-center w-full">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4 sm:mb-6">Instructions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-blue-500 text-base sm:text-lg font-medium mb-2">Inhale (4s)</div>
                    <p className="text-sm sm:text-base text-gray-600">Breathe in slowly through your nose</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-yellow-500 text-base sm:text-lg font-medium mb-2">Hold (7s)</div>
                    <p className="text-sm sm:text-base text-gray-600">Hold your breath comfortably</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-green-500 text-base sm:text-lg font-medium mb-2">Exhale (8s)</div>
                    <p className="text-sm sm:text-base text-gray-600">Release slowly through your mouth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits and Tips Cards */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="text-primary mr-2">✨</span>
                Benefits
              </h3>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
                <li>Reduces stress and anxiety</li>
                <li>Helps manage cravings</li>
                <li>Improves focus and clarity</li>
                <li>Promotes relaxation</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="text-primary mr-2">💡</span>
                Tips
              </h3>
              <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-2">
                <li>Find a quiet, comfortable place</li>
                <li>Sit or lie in a relaxed position</li>
                <li>Focus on your breathing</li>
                <li>Practice regularly for best results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 