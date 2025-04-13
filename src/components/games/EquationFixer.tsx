import React, { useState, useEffect } from 'react';

const EquationFixer = () => {
  const [blanks, setBlanks] = useState<(string | null)[]>(['3', '+', null, '=', '5']);
  const [options] = useState(['1', '2', '3', '4']);
  const [message, setMessage] = useState('');
  const [celebrate, setCelebrate] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const checkAnswer = (newBlanks: (string | null)[]) => {
    if (newBlanks.includes(null)) {
      setMessage('');
      return;
    }

    const [left1, op, middle, , right] = newBlanks;
    let result = 0;

    const num1 = parseInt(left1!);
    const num2 = parseInt(middle!);
    const expected = parseInt(right!);

    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*') result = num1 * num2;
    else if (op === '/') result = num1 / num2;

    if (result === expected) {
      setMessage('✅ Correct!');
      setCelebrate(true);
      createParticles();
      setTimeout(() => setCelebrate(false), 2000);
    } else {
      setMessage('❌ Try again!');
    }
  };

  const createParticles = () => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    })));
  };

  const handleDrop = (value: string, index: number) => {
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    setBlanks(newBlanks);
    checkAnswer(newBlanks);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4 relative overflow-hidden">
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-2xl animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${Math.random() * 1}s`
          }}
          onAnimationEnd={() => setParticles(prev => prev.filter(part => part.id !== p.id))}
        >
          {['✨', '🌟', '🎉', '💫'][Math.floor(Math.random() * 4)]}
        </div>
      ))}

      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
        🧮 Math Magic Fixer 🔧
      </h2>

      <div className="flex justify-center space-x-4 text-3xl font-mono mb-8 relative z-10">
        {blanks.map((val, index) => (
          <div
            key={index}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e.dataTransfer.getData('text'), index)}
            className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 ${
              val ? 'bg-green-500 scale-110' : 'bg-white/20 hover:bg-white/30'
            } border-2 border-dashed border-white/50 shadow-lg backdrop-blur-sm`}
          >
            <span className={val ? 'text-white' : 'text-white/50'}>
              {val ?? '?'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6 flex-wrap max-w-md relative z-10">
        {options.map((option, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text', option);
              e.currentTarget.classList.add('dragging');
            }}
            onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
            className="p-4 text-2xl w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 
                     cursor-grab active:cursor-grabbing shadow-xl hover:shadow-2xl transition-all hover:scale-110 
                     hover:rotate-12 animate-bounce-slow"
          >
            <span className="text-white drop-shadow">{option}</span>
          </div>
        ))}
      </div>

      <div className={`mt-6 text-2xl font-bold transition-all duration-500 ${
        message.includes('✅') ? 'text-green-400' : 'text-red-400'
      } ${message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {message}
      </div>

      {celebrate && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="text-6xl animate-jump">
            🎉🌟✨
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes jump {
          0% { transform: scale(0); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        .animate-float {
          animation: float 1.5s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .animate-jump {
          animation: jump 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};

export default EquationFixer;