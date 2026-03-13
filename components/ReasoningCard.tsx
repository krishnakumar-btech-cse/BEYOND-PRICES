import React from 'react';
import { Bot, Lightbulb } from 'lucide-react';

interface ReasoningCardProps {
  reasoning: string;
}

const ReasoningCard: React.FC<ReasoningCardProps> = ({ reasoning }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg text-white">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <Bot className="text-agri-400" /> AI Strategy Reasoning
      </h3>
      <div className="flex gap-4">
        <Lightbulb className="text-yellow-400 shrink-0 mt-1" size={24} />
        <p className="text-slate-200 leading-relaxed text-sm md:text-base">
          {reasoning}
        </p>
      </div>
    </div>
  );
};

export default ReasoningCard;