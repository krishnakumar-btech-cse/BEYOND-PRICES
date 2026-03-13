import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface RouteRiskCardProps {
  score: number;
}

const RouteRiskCard: React.FC<RouteRiskCardProps> = ({ score }) => {
  const isSafe = score > 80;
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        <ShieldCheck size={18} /> Route Safety
      </div>
      <div className={`text-2xl font-bold ${isSafe ? 'text-green-600' : 'text-orange-500'}`}>
        {score}/100
      </div>
    </div>
  );
};

export default RouteRiskCard;