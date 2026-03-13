
import React, { useState, useMemo } from 'react';
import { ConsumerPrediction, MarketBalanceNudge, ConsumerAlert } from '../types';
import { 
  ShoppingBag, 
  MapPin, 
  TrendingDown, 
  TrendingUp, 
  ArrowLeft,
  Zap,
  Package,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Navigation,
  AlertCircle,
  Activity,
  Calendar,
  Scale,
  Leaf,
  ChevronDown,
  ChevronUp,
  Timer,
  BarChart,
  Lightbulb,
  ZapOff,
  Split,
  Globe,
  Sprout,
  X,
  MessageSquare
} from 'lucide-react';

interface ConsumerDashboardProps {
  data: ConsumerPrediction;
  location: string;
  onReset: () => void;
}

type FilterLens = 'value' | 'fresh' | 'near' | null;

const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ data, location, onReset }) => {
  const [radius, setRadius] = useState(15); 
  const [activeLens, setActiveLens] = useState<FilterLens>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [showFullComparison, setShowFullComparison] = useState(false);
  const [showBasketFallback, setShowBasketFallback] = useState(false);

  // Reality-First: Filter markets by user radius
  const reachableMarkets = useMemo(() => {
    return (data.nearbyMarkets || [])
      .filter(m => m.distance_km <= radius)
      .sort((a, b) => a.distance_km - b.distance_km);
  }, [data.nearbyMarkets, radius]);

  // Part K: Smart Filtering Logic (Decision Lenses)
  const filteredCrops = useMemo(() => {
    let crops = [...(data.recommendedCrops || [])];
    if (activeLens === 'value') {
      crops.sort((a, b) => b.effectiveValueScore - a.effectiveValueScore);
    } else if (activeLens === 'fresh') {
      crops.sort((a, b) => b.freshnessScore - a.freshnessScore);
    } else if (activeLens === 'near') {
      crops.sort((a, b) => {
        const distA = data.nearbyMarkets?.find(m => m.name === a.bestMarketName)?.distance_km || 999;
        const distB = data.nearbyMarkets?.find(m => m.name === b.bestMarketName)?.distance_km || 999;
        return distA - distB;
      });
    }
    return crops;
  }, [data.recommendedCrops, activeLens, data.nearbyMarkets]);

  const bestValueCrop = filteredCrops[0];
  const bestMarket = data.nearbyMarkets?.find(m => m.name === bestValueCrop?.bestMarketName);

  const activeAlerts = (data.alerts || []).filter(a => !dismissedAlerts.includes(a.id));

  const getNudgeIcon = (type: MarketBalanceNudge['type']) => {
    switch (type) {
      case 'High Demand': return <Activity size={18} className="text-amber-600" />;
      case 'Surplus Nudge': return <Globe size={18} className="text-agri-600" />;
      case 'Seasonal Peak': return <Sprout size={18} className="text-blue-600" />;
      default: return <Info size={18} />;
    }
  };

  const getAlertIcon = (type: ConsumerAlert['type'] | string) => {
    switch (type) {
      case 'price': return <TrendingDown size={14} />;
      case 'freshness': return <Leaf size={14} />;
      case 'distance': return <MapPin size={14} />;
      default: return <Info size={14} />;
    }
  };

  if (!data.recommendedCrops || data.recommendedCrops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-6">
        <AlertCircle size={48} className="text-neutral-200" />
        <p className="mono-label text-neutral-400">Market intelligence currently syncing for {location}</p>
        <button onClick={onReset} className="text-xs font-black uppercase text-navy-900 underline underline-offset-4">Try different region</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto py-12 px-6 space-y-12 animate-fade-in pb-40">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-200 pb-12 gap-8">
        <div className="space-y-4">
          <button onClick={onReset} className="mono-label text-neutral-400 hover:text-navy-900 transition-colors flex items-center gap-2">
            <ArrowLeft size={12} /> Search Different Area
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-6xl font-display font-black tracking-tighter text-neutral-900 uppercase leading-none">
              Market Search <span className="text-neutral-300">/</span> {location}
            </h2>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 text-right">
           <div className="space-y-2">
              <p className="mono-label text-neutral-400 mb-1">Max Travel Distance: <span className="text-navy-900">{radius}km</span></p>
              <input 
                type="range" min="2" max="50" step="1" value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-48 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
              />
           </div>
           <div>
              <p className="mono-label text-neutral-400 mb-1">Regional Food Supply</p>
              <div className="text-3xl font-black text-navy-900 number-tabular">{data.regionalSupplyStrength}%</div>
           </div>
        </div>
      </header>

      {/* Simple Instruction Bar - "Low Words" for the common shopper */}
      <div className="bg-agri-600 text-white p-8 flex items-center gap-8 shadow-xl border-l-8 border-navy-900">
         <div className="w-14 h-14 bg-white/20 flex items-center justify-center rounded-full shrink-0 shadow-inner">
            <MessageSquare size={28} />
         </div>
         <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Today's Best Move / Daily Advice</span>
            <p className="text-2xl font-display font-black uppercase tracking-tight leading-none italic">
               "{data.simple_advice}"
            </p>
         </div>
      </div>

      {/* High-Impact Alerts */}
      {activeAlerts.length > 0 && (
        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
          {activeAlerts.map(alert => (
            <div key={alert.id} className="shrink-0 flex items-center gap-4 bg-navy-900 text-white px-6 py-4 rounded-full shadow-lg animate-fade-in group border border-white/10">
              <div className="w-8 h-8 rounded-full bg-agri-600 flex items-center justify-center">
                {getAlertIcon(alert.type)}
              </div>
              <div className="pr-4 border-r border-white/10">
                <p className="text-[11px] font-black uppercase tracking-widest leading-none">{alert.message}</p>
                <p className="text-[8px] font-bold text-navy-400 uppercase tracking-widest mt-1 italic">{alert.actionHint}</p>
              </div>
              <button onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])} className="p-1 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Simple Filters - Plain English Labels */}
      <div className="flex items-center gap-4 border-b border-neutral-100 pb-8">
        <span className="mono-label text-neutral-400 mr-4">Filter By:</span>
        <button 
          onClick={() => setActiveLens(activeLens === 'value' ? null : 'value')}
          className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all ${activeLens === 'value' ? 'bg-agri-600 border-agri-600 text-white' : 'border-neutral-200 text-neutral-400 hover:border-neutral-900'}`}
        >
          <TrendingDown size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Cheapest Price</span>
        </button>
        <button 
          onClick={() => setActiveLens(activeLens === 'fresh' ? null : 'fresh')}
          className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all ${activeLens === 'fresh' ? 'bg-agri-600 border-agri-600 text-white' : 'border-neutral-200 text-neutral-400 hover:border-neutral-900'}`}
        >
          <Leaf size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Freshest Food</span>
        </button>
        <button 
          onClick={() => setActiveLens(activeLens === 'near' ? null : 'near')}
          className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all ${activeLens === 'near' ? 'bg-agri-600 border-agri-600 text-white' : 'border-neutral-200 text-neutral-400 hover:border-neutral-900'}`}
        >
          <MapPin size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Closest To Me</span>
        </button>
        {activeLens && (
          <button onClick={() => setActiveLens(null)} className="text-[9px] font-black uppercase text-red-500 hover:underline">Reset Filters</button>
        )}
      </div>

      {/* Shopping Strategy Optimization */}
      <div className="bg-white border-4 border-neutral-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]">
         <div className="p-10 lg:p-16 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-navy-900 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.4em]">
                     <Package size={12} /> Personalized Shopping Strategy
                  </div>
                  <h3 className="text-5xl font-display font-black text-neutral-900 uppercase tracking-tighter leading-tight">
                    {data.smartBasket.strategy} <span className="text-neutral-300">/</span> {data.smartBasket.travelEffort} Travel
                  </h3>
               </div>
               <div className="flex items-center gap-12 text-right">
                  <div className="space-y-1">
                     <span className="mono-label text-neutral-400">Total Bill Cost</span>
                     <div className="text-4xl font-black text-navy-900">₹{data.smartBasket.totalCost}</div>
                  </div>
                  <div className="space-y-1">
                     <span className="mono-label text-neutral-400">Freshness Grade</span>
                     <div className="text-4xl font-black text-agri-600">{data.smartBasket.avgFreshness}%</div>
                  </div>
               </div>
            </div>

            <p className="text-2xl font-light text-neutral-500 italic leading-snug max-w-5xl leading-relaxed">
               "{data.smartBasket.reasoning}"
            </p>

            <div className="grid lg:grid-cols-2 gap-12">
               {data.smartBasket.nodes.map((node, i) => (
                 <div key={i} className="bg-neutral-50 border border-neutral-100 p-8 space-y-6 group hover:border-navy-900 transition-all">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <h5 className="text-sm font-black uppercase tracking-widest text-neutral-400">Store Choice {i+1}</h5>
                          <div className="text-2xl font-display font-black text-neutral-900 uppercase tracking-tight">{node.marketName}</div>
                       </div>
                       <div className="text-right">
                          <div className="text-xl font-black text-navy-900">₹{node.subtotal}</div>
                          <div className="text-[9px] font-bold text-agri-600 uppercase">{node.freshnessScore}% Fresh</div>
                       </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {node.items.map((item, j) => (
                         <span key={j} className="text-[10px] font-black bg-white border border-neutral-200 px-3 py-1.5 uppercase tracking-widest group-hover:border-navy-900 transition-colors shadow-sm">{item}</span>
                       ))}
                    </div>
                 </div>
               ))}
            </div>

            <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.smartBasket.totalSavingsVsRetail > 0 ? 'bg-agri-50 text-agri-600' : 'bg-neutral-50 text-neutral-400'}`}>
                     <TrendingDown size={20} />
                  </div>
                  <div className="space-y-0.5">
                     <span className="mono-label text-neutral-400">Expected Savings</span>
                     <div className="text-xl font-black text-neutral-900 uppercase tracking-tight">Save ₹{data.smartBasket.totalSavingsVsRetail} vs. Store Prices</div>
                  </div>
               </div>
               
               <div className="flex items-center gap-6">
                 {data.smartBasket.fallbackSingleMarket && (
                    <button onClick={() => setShowBasketFallback(!showBasketFallback)} className="mono-label text-neutral-400 hover:text-neutral-900 underline underline-offset-4 decoration-2">Just use one store instead</button>
                 )}
                 <button className="px-10 py-6 bg-navy-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center gap-3 shadow-xl">Confirm Plan <ArrowRight size={16} /></button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
