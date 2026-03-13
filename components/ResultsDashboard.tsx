
import React from 'react';
import { PredictionResult, UserInput } from '../types';
import { 
  TrendingUp, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  RefreshCcw,
  Navigation
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

interface ResultsDashboardProps {
  data: PredictionResult;
  input: UserInput;
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, input, onReset }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Prediction Results for {input.cropType}</h2>
        <button 
          onClick={onReset}
          className="flex items-center gap-1 text-sm text-agri-700 hover:underline"
        >
          <RefreshCcw size={16} /> New Calculation
        </button>
      </div>

      {/* Top Recommendation Card - The "Hero" Insight */}
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

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Truck size={18} /> Transport Cost
          </div>
          <div className="text-2xl font-bold text-gray-800">₹{data.transport_cost}</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <ShieldCheck size={18} /> Route Safety
          </div>
          <div className={`text-2xl font-bold ${data.route_safety_score > 80 ? 'text-green-600' : 'text-orange-500'}`}>
            {data.route_safety_score}/100
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <AlertTriangle size={18} /> Spoilage Risk
          </div>
          <div className="text-2xl font-bold text-gray-800">{data.spoilage_risk}</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CheckCircle size={18} /> Confidence
          </div>
          {/* Fixed: confidence -> confidence_score */}
          <div className="text-2xl font-bold text-agri-600">{(data.confidence_score * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Main Analysis Section: Charts & Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Price Trends Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-agri-600" /> Market Price Forecast (7 Days)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.price_trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  tick={{fontSize: 12, fill: '#6b7280'}} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => val.slice(5)} // Show MM-DD
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#6b7280'}} 
                  axisLine={false}
                  tickLine={false}
                  unit="₹"
                  width={40}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#16a34a" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff'}}
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spoilage Risk Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
            <AlertTriangle className="text-orange-500" /> Spoilage Curve
          </h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.spoilage_curve}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  hide
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="riskPercentage" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorRisk)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Risk increases significantly after 3 days.
          </p>
        </div>
      </div>

      {/* Logistics & Backup Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Backup Plan Box */}
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <Navigation size={20} /> AI Strategy Reasoning
          </h3>
          {/* Fixed: backup_plan -> ai_reasoning */}
          <p className="text-amber-700 leading-relaxed">
            {data.ai_reasoning}
          </p>
        </div>

        {/* Risk Factors */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Identified Risk Factors</h3>
          <ul className="space-y-2">
            {data.risk_factors.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;