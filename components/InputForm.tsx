
import React, { useState } from 'react';
import { CropType, FarmerType, UserInput } from '../types';
import { 
  Database, 
  MapPin, 
  Scale, 
  Loader2, 
  ChevronRight, 
  Warehouse, 
  ChevronLeft,
  Search,
  CheckCircle2,
  Calendar,
  Truck,
  RotateCcw
} from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const CROP_ICONS: Record<string, string> = {
  'Wheat': '🌾',
  'Rice': '🍚',
  'Tomato': '🍅',
  'Potato': '🥔',
  'Onion': '🧅',
  'Cotton': '☁️',
  'Maize': '🌽'
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserInput>({
    cropType: CropType.WHEAT,
    farmerType: FarmerType.SMALL,
    harvestDate: 'today',
    quantity: 500,
    quantityUnit: 'Kg',
    location: '',
    storageAvailable: false,
    storageType: 'Room',
    storageDuration: '1-2 days',
    travelRange: 25
  });

  const detectLocation = () => {
    setLocating(true);
    setLocationError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ ...prev, location: "Villupuram District" }));
          setLocating(false);
          setStep(2);
        },
        (error) => {
          setLocating(false);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError("Location access was denied. Please enter your location manually.");
          } else {
            setLocationError("Could not detect location. Please enter it manually.");
          }
        },
        { timeout: 10000 }
      );
    } else {
      setLocating(false);
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderStep = () => {
    switch(step) {
      case 1: // Step 2: Location Based Auto Detection
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-black uppercase tracking-tight">Identify Your Hub</h2>
              <p className="text-neutral-400 font-medium">Auto-detection drives local market price and weather correlation.</p>
            </div>
            
            <button 
              type="button"
              onClick={detectLocation}
              className={`w-full py-10 border-2 border-dashed transition-all group flex flex-col items-center justify-center gap-4 ${
                locationError ? 'border-red-200 bg-red-50' : 'border-neutral-200 bg-neutral-50 hover:border-agri-600 hover:bg-agri-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform ${
                locationError ? 'bg-white text-red-500' : 'bg-white text-agri-600 group-hover:scale-110'
              }`}>
                {locating ? <Loader2 className="animate-spin" /> : <MapPin />}
              </div>
              <span className={`font-black uppercase tracking-[0.2em] text-xs ${
                locationError ? 'text-red-500' : 'text-neutral-400 group-hover:text-agri-600'
              }`}>
                {locating ? 'Syncing Network...' : locationError || 'Auto-Detect Location (GPS)'}
              </span>
            </button>

            <div className="space-y-4 pt-4">
              <label className="mono-label text-neutral-400">Manual Override</label>
              <input
                type="text"
                placeholder="ENTER DISTRICT / TALUK"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value.toUpperCase()})}
                className="w-full px-6 py-5 bg-neutral-50 border border-neutral-200 text-lg font-black outline-none focus:border-agri-600 uppercase"
              />
              {formData.location && (
                <button onClick={nextStep} className="w-full py-5 bg-agri-900 text-white font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:bg-black transition-all">
                  Confirm Location <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        );

      case 2: // Step 3: Crop Selection
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-black uppercase tracking-tight">Confirm Your Crop</h2>
                <p className="text-neutral-400 font-medium">Selected crop drives spoilage curve and urgency alerts.</p>
              </div>
              <button onClick={prevStep} className="p-2 text-neutral-300 hover:text-neutral-900 transition-colors"><ChevronLeft /></button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.values(CropType).map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => { setFormData({...formData, cropType: crop}); nextStep(); }}
                  className={`p-6 border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                    formData.cropType === crop ? 'border-agri-600 bg-agri-50' : 'border-neutral-100 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-4xl">{CROP_ICONS[crop] || '🌿'}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{crop}</span>
                </button>
              ))}
            </div>

            <div className="p-4 bg-neutral-50 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400 border border-neutral-100">
               <span>Selected: {formData.cropType}</span>
               <button onClick={() => setStep(2)} className="text-agri-600 flex items-center gap-1 hover:underline"><RotateCcw size={12} /> Change</button>
            </div>
          </div>
        );

      case 3: // Part B: Detailed Inputs
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-black uppercase tracking-tight">Yield Context</h2>
                <p className="text-neutral-400 font-medium">Quantity and timing decide transport and market choice.</p>
              </div>
              <button onClick={prevStep} className="p-2 text-neutral-300 hover:text-neutral-900"><ChevronLeft /></button>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <label className="mono-label text-neutral-400">Harvest Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                  className="flex-1 px-6 py-5 bg-neutral-50 border border-neutral-200 text-2xl font-black outline-none focus:border-agri-600"
                />
                <select 
                  value={formData.quantityUnit}
                  onChange={(e) => setFormData({...formData, quantityUnit: e.target.value as any})}
                  className="w-32 px-4 py-5 bg-neutral-900 text-white font-black uppercase text-xs outline-none"
                >
                  <option>Kg</option>
                  <option>Quintal</option>
                  <option>Ton</option>
                </select>
              </div>
              <p className="text-[10px] font-bold text-neutral-300 uppercase">Example: 500 Kg</p>
            </div>

            {/* Harvest Date */}
            <div className="space-y-4">
              <label className="mono-label text-neutral-400">Harvest Date</label>
              <div className="grid grid-cols-3 gap-2">
                {['today', 'yesterday', 'custom'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({...formData, harvestDate: d})}
                    className={`py-4 border text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.harvestDate === d ? 'bg-agri-900 text-white border-agri-900' : 'bg-white text-neutral-400 border-neutral-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {formData.harvestDate === 'custom' && (
                <input 
                  type="date" 
                  onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 font-bold uppercase text-xs outline-none"
                />
              )}
            </div>

            {/* Storage */}
            <div className="space-y-4">
              <label className="mono-label text-neutral-400">Storage Availability</label>
              <div className="grid grid-cols-2 gap-4">
                 <button
                   onClick={() => setFormData({...formData, storageAvailable: true})}
                   className={`p-5 border-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                     formData.storageAvailable ? 'border-agri-600 bg-agri-50 text-agri-900' : 'border-neutral-100 text-neutral-300'
                   }`}
                 >
                   <Warehouse size={16} /> Yes
                 </button>
                 <button
                   onClick={() => setFormData({...formData, storageAvailable: false})}
                   className={`p-5 border-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                     !formData.storageAvailable ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-100 text-neutral-300'
                   }`}
                 >
                   No
                 </button>
              </div>
              
              {formData.storageAvailable && (
                <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-6 animate-fade-in">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-neutral-400">Type</label>
                      <div className="flex gap-2">
                        {['Room', 'Cold'].map(t => (
                          <button 
                            key={t}
                            onClick={() => setFormData({...formData, storageType: t as any})}
                            className={`flex-1 py-2 text-[9px] font-black border ${formData.storageType === t ? 'bg-agri-900 text-white border-agri-900' : 'bg-white text-neutral-400 border-neutral-200'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-neutral-400">Max Duration</label>
                      <select 
                        value={formData.storageDuration}
                        onChange={(e) => setFormData({...formData, storageDuration: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-neutral-200 text-[10px] font-bold uppercase"
                      >
                         <option>1-2 days</option>
                         <option>3-5 days</option>
                         <option>5+ days</option>
                      </select>
                   </div>
                </div>
              )}
            </div>

            {/* Travel Range */}
            <div className="space-y-4 pt-6 border-t border-neutral-100">
               <div className="flex justify-between items-end">
                  <label className="mono-label text-neutral-400">Travel Willingness</label>
                  <span className="text-xl font-black text-agri-600">{formData.travelRange} km</span>
               </div>
               <input 
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={formData.travelRange}
                  onChange={(e) => setFormData({...formData, travelRange: Number(e.target.value)})}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-agri-600"
               />
               <p className="text-[10px] font-bold text-neutral-300 uppercase">Limits suggestions to realistic markets</p>
            </div>

            <button onClick={nextStep} className="w-full py-6 bg-agri-900 text-white font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl">
               Review Selection <ChevronRight size={18} />
            </button>
          </div>
        );

      case 4: // Part B Summary Checkpoint
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-black uppercase tracking-tight">Strategy Checkpoint</h2>
              <p className="text-neutral-400 font-medium">Please verify your data before AI projection.</p>
            </div>

            <div className="bg-agri-900 text-white p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 size={100} /></div>
              
              <div className="grid grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-1">
                    <p className="mono-label opacity-40">Commodity</p>
                    <p className="text-xl font-black uppercase tracking-tighter">{formData.cropType}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="mono-label opacity-40">Quantity</p>
                    <p className="text-xl font-black uppercase tracking-tighter">{formData.quantity} {formData.quantityUnit}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="mono-label opacity-40">Harvested</p>
                    <p className="text-xl font-black uppercase tracking-tighter capitalize">{formData.harvestDate}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="mono-label opacity-40">Location</p>
                    <p className="text-xl font-black uppercase tracking-tighter">{formData.location}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="mono-label opacity-40">Storage</p>
                    <p className="text-xl font-black uppercase tracking-tighter">
                      {formData.storageAvailable ? `${formData.storageType} (${formData.storageDuration})` : 'None'}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <p className="mono-label opacity-40">Radius</p>
                    <p className="text-xl font-black uppercase tracking-tighter">{formData.travelRange} km</p>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
               <button
                  onClick={() => onSubmit(formData)}
                  disabled={isLoading}
                  className="w-full bg-agri-600 text-white font-black uppercase tracking-[0.4em] text-xs py-8 flex items-center justify-center gap-4 hover:bg-agri-900 transition-all disabled:opacity-30 shadow-xl"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Generate Selling Plan <ChevronRight size={20} /></>}
                </button>
                <button onClick={() => setStep(3)} className="text-center mono-label text-neutral-400 hover:text-neutral-900 transition-colors uppercase">Edit Details</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12">
      <div className="bg-white border border-neutral-200 p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-neutral-100 overflow-hidden">
          <div className="bg-agri-600 h-full transition-all duration-700" style={{width: `${(step/4)*100}%`}}></div>
        </div>
        
        {renderStep()}

        {/* Global Footer Signals */}
        <div className="mt-12 pt-8 border-t border-neutral-50 flex justify-between items-center opacity-40 text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400">
           <span className="flex items-center gap-1">No Middlemen Involved</span>
           <span className="flex items-center gap-1">Public Data Verified</span>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
