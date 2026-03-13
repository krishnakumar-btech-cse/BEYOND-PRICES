
import React from 'react';
import { PredictionResult } from '../types';
import { Clock } from 'lucide-react';

interface SummaryCardProps {
  data: PredictionResult;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-r from-agri-600 to-agri-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-agri-100 text-sm font-semibold uppercase tracking-wider mb-1">Recommendation</div>
          <h1 className="text-3xl font-bold">Sell at {data.best_market}</h1>
          <div className="flex items-center gap-2 mt-2 text-agri-50">
            <Clock size={18} />
            {/* Fixed: best_hour -> best_hour_window */}
            <span>Best Time: {data.best_day} between {data.best_hour_window}</span>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[150px] text-center">
          <div className="text-xs text-agri-100 uppercase">Est. Profit</div>
          <div className="text-3xl font-bold flex items-center justify-center">
            <span className="text-lg mr-1">₹</span>
            {data.expected_profit.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;