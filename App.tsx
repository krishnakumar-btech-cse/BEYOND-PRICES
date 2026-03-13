
import React, { useState, useEffect } from 'react';
import { generatePrediction, generateConsumerInsights } from './services/geminiService';
import { UserInput, PredictionResult, UserRole, ConsumerPrediction } from './types';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import ConsumerDashboard from './components/ConsumerDashboard';
import RoleSelector from './components/RoleSelector';
import Logo from './components/Logo';
import { Info, MapPin, Loader2, ArrowLeft, Database } from 'lucide-react';
const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [view, setView] = useState<'input' | 'dashboard'>('input');
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionResult | null>(null);
  const [consumerData, setConsumerData] = useState<ConsumerPrediction | null>(null);
  const [lastInput, setLastInput] = useState<UserInput | null>(null);
  const [consumerLocation, setConsumerLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleFarmerSubmit = async (data: UserInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePrediction(data);
      setPredictionData(result);
      setLastInput(data);
      setView('dashboard');
    } catch (err: any) {
      setError("Strategic analysis failed. Connection timeout or data inconsistency.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsumerSearch = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateConsumerInsights({ location: loc, preferences: [] });
      setConsumerData(result);
      setConsumerLocation(loc);
      setView('dashboard');
    } catch (err: any) {
      setError("Market intelligence feed unavailable for this region.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      // Mock seeding delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Mock data initialized locally.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleReset = () => {
    setView('input');
    setPredictionData(null);
    setConsumerData(null);
    setError(null);
  };

  const handleBackToRoles = () => {
    setRole(null);
    handleReset();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-agri-600/10 selection:text-agri-900">
      {/* Precision Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center gap-4 cursor-pointer group" 
              onClick={handleBackToRoles}
            >
              <Logo className="w-10 h-10 transition-transform group-hover:scale-105" colorClass={role === 'consumer' ? 'text-navy-900' : 'text-agri-600'} />
              <div className="border-l border-neutral-200 pl-4">
                <h1 className="text-xl font-display font-black tracking-tighter uppercase leading-none">HarvestPlanner</h1>
                <p className="mono-label text-[9px] text-neutral-400 mt-1">National Intelligence v2.0</p>
              </div>
            </div>

            {role && (
              <div className="flex items-center gap-8">
                <button 
                  onClick={handleBackToRoles}
                  className="mono-label text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={14} /> Switch Portal
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${role === 'consumer' ? 'bg-blue-600' : 'bg-agri-600'}`}></span>
                  System Active
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-10">
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-800 flex items-center gap-3 animate-fade-in">
            <Info size={18} />
            <span className="text-sm font-bold uppercase tracking-wide">{error}</span>
          </div>
        )}

        {!role ? (
          <RoleSelector onSelect={setRole} />
        ) : view === 'input' ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            {role === 'farmer' ? (
              <InputForm onSubmit={handleFarmerSubmit} isLoading={loading} />
            ) : (
              <div className="w-full max-w-xl bg-white border border-neutral-200 p-12 shadow-2xl">
                <div className="text-center mb-12">
                   <div className="bg-navy-900 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <MapPin className="text-white w-10 h-10" />
                   </div>
                   <h2 className="text-3xl font-display font-black tracking-tight mb-2">Market Intelligence</h2>
                   <p className="text-neutral-400 uppercase text-[10px] font-black tracking-[0.2em]">Enter Target Procurement Node</p>
                </div>
                <div className="space-y-6">
                  <input 
                    type="text" 
                    placeholder="E.G. NEW DELHI METRO AREA"
                    className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 font-bold text-lg outline-none focus:border-navy-900 transition-colors uppercase placeholder:text-neutral-200"
                    value={consumerLocation}
                    onChange={(e) => setConsumerLocation(e.target.value)}
                  />
                  <button 
                    onClick={() => handleConsumerSearch(consumerLocation)}
                    disabled={loading || !consumerLocation}
                    className="w-full py-5 bg-navy-900 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-black transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Initialize Regional Sync'}
                  </button>
                </div>
                <p className="mt-8 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                  Real-time correlation of regional mandi indices and wholesale-retail delta tracking.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {role === 'farmer' && predictionData && lastInput && (
              <Dashboard data={predictionData} input={lastInput} onReset={handleReset} />
            )}
            {role === 'consumer' && consumerData && (
              <ConsumerDashboard data={consumerData} location={consumerLocation} onReset={handleReset} />
            )}
          </div>
        )}
      </main>

      <footer className="mt-40 border-t border-neutral-200 py-16 px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <Logo className="w-6 h-6 grayscale opacity-30" colorClass="text-neutral-900" />
             <span className="mono-label text-neutral-300">HarvestPlanner | Official Agricultural Intelligence</span>
          </div>
          <div className="flex gap-10">
             <button 
               onClick={handleSeed}
               disabled={isSeeding}
               className="mono-label text-neutral-400 hover:text-agri-600 transition-colors flex items-center gap-2"
             >
               <Database size={12} /> {isSeeding ? 'Initializing...' : 'Initialize Demo Data'}
             </button>
             <a href="#" className="mono-label text-neutral-400 hover:text-neutral-900 transition-colors">Documentation</a>
             <a href="#" className="mono-label text-neutral-400 hover:text-neutral-900 transition-colors">API Status</a>
             <a href="#" className="mono-label text-neutral-400 hover:text-neutral-900 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
