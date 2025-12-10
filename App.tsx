import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calculator, 
  Car, 
  Clock, 
  Fuel, 
  DollarSign, 
  Activity,
  Bot,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { InputField } from './components/InputField';
import { ResultCard } from './components/ResultCard';
import { getFinancialAdvice } from './services/geminiService';
import { DriverInputs, CalculationResult, LoadingState } from './types';

const INITIAL_INPUTS: DriverInputs = {
  earnings: 0,
  kilometers: 0,
  hours: 0,
  gasPrice: 5.80,
  efficiency: 10,
};

const MAINTENANCE_RATE = 0.50; // R$ 0.50 per KM

export default function App() {
  const [inputs, setInputs] = useState<DriverInputs>(INITIAL_INPUTS);
  const [results, setResults] = useState<CalculationResult | null>(null);
  
  // AI State
  const [advice, setAdvice] = useState<string | null>(null);
  const [aiState, setAiState] = useState<LoadingState>(LoadingState.IDLE);

  // Update inputs
  const handleInputChange = (field: keyof DriverInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  // Logic: Calculate Net Profit & Hourly Wage
  const calculate = useCallback(() => {
    const { earnings, kilometers, hours, gasPrice, efficiency } = inputs;

    if (hours === 0) {
      setResults(null);
      return;
    }

    const fuelConsumed = efficiency > 0 ? kilometers / efficiency : 0;
    const fuelCost = fuelConsumed * gasPrice;
    const maintenanceCost = kilometers * MAINTENANCE_RATE;
    const totalExpenses = fuelCost + maintenanceCost;
    const netProfit = earnings - totalExpenses;
    const hourlyWage = hours > 0 ? netProfit / hours : 0;

    setResults({
      fuelCost,
      maintenanceCost,
      totalExpenses,
      netProfit,
      hourlyWage
    });
  }, [inputs]);

  // Auto-calculate on input change
  useEffect(() => {
    calculate();
  }, [calculate]);

  // Handle Gemini Analysis
  const handleAnalyze = async () => {
    if (!results) return;
    
    setAiState(LoadingState.LOADING);
    setAdvice(null);
    
    try {
      const adviceText = await getFinancialAdvice(inputs, results);
      setAdvice(adviceText);
      setAiState(LoadingState.SUCCESS);
    } catch (err) {
      setAiState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 p-2.5 rounded-lg shadow-lg shadow-emerald-500/20">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Driver Profit</h1>
            <p className="text-slate-500 text-sm">Real Earnings Calculator</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs text-slate-400 font-mono">
            v1.0.1
           </span>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-200 mb-6 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-emerald-400" />
              Ride Data
            </h2>
            
            <div className="space-y-5">
              <InputField 
                label="Daily Earnings (Gross)"
                value={inputs.earnings || ''}
                onChange={(v) => handleInputChange('earnings', v)}
                icon={<DollarSign className="w-5 h-5" />}
                placeholder="0.00"
                suffix="R$"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Kilometers Driven"
                  value={inputs.kilometers || ''}
                  onChange={(v) => handleInputChange('kilometers', v)}
                  icon={<TrendingUp className="w-5 h-5" />}
                  placeholder="0"
                  suffix="km"
                />
                <InputField 
                  label="Hours Worked"
                  value={inputs.hours || ''}
                  onChange={(v) => handleInputChange('hours', v)}
                  icon={<Clock className="w-5 h-5" />}
                  placeholder="0"
                  suffix="h"
                />
              </div>

              <div className="border-t border-slate-800 pt-5 mt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Vehicle Configuration</p>
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Gas Price"
                    value={inputs.gasPrice || ''}
                    onChange={(v) => handleInputChange('gasPrice', v)}
                    icon={<Fuel className="w-5 h-5" />}
                    placeholder="5.80"
                    suffix="R$/L"
                  />
                  <InputField 
                    label="Fuel Efficiency"
                    value={inputs.efficiency || ''}
                    onChange={(v) => handleInputChange('efficiency', v)}
                    icon={<Activity className="w-5 h-5" />}
                    placeholder="10"
                    suffix="km/L"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Notice */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 flex items-start space-x-3">
             <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
             <div className="text-sm text-slate-400">
               <span className="text-slate-300 font-semibold">Note:</span> Maintenance and depreciation cost is automatically calculated at <span className="text-white">R$ {MAINTENANCE_RATE.toFixed(2)} per km</span> driven.
             </div>
          </div>
        </div>

        {/* Right Column: Results & AI */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard 
              title="Net Profit" 
              amount={results?.netProfit || 0} 
              highlight 
              colorClass={results && results.netProfit < 0 ? "text-red-400" : "text-emerald-400"}
              subtext="After fuel and maintenance"
            />
            <ResultCard 
              title="Hourly Net Wage" 
              amount={results?.hourlyWage || 0}
              colorClass={results && results.hourlyWage < 10 ? "text-amber-400" : "text-blue-400"}
              subtext="Your real hourly wage"
            />
            <ResultCard 
              title="Fuel Cost" 
              amount={results?.fuelCost || 0}
              colorClass="text-slate-300"
            />
             <ResultCard 
              title="Maintenance Reserve" 
              amount={results?.maintenanceCost || 0}
              colorClass="text-slate-300"
              subtext="Save this amount for repairs"
            />
          </div>

          {/* AI Analysis Section */}
          <div className="flex-grow flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Bot className="w-5 h-5 mr-2 text-indigo-400" />
                AI Assistant Analysis
              </h2>
              {results && inputs.earnings > 0 && (
                <button 
                  onClick={handleAnalyze}
                  disabled={aiState === LoadingState.LOADING}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                >
                  {aiState === LoadingState.LOADING ? 'Analyzing...' : 'Analyze Performance'}
                </button>
              )}
            </div>

            <div className="flex-grow bg-slate-950/50 rounded-xl p-4 border border-slate-800 min-h-[200px] overflow-y-auto">
              {aiState === LoadingState.IDLE && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                  <Bot className="w-8 h-8 opacity-50" />
                  <p>Fill in the data and click "Analyze" to receive personalized tips.</p>
                </div>
              )}
              
              {aiState === LoadingState.LOADING && (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  </div>
                  <p className="text-sm text-slate-400 animate-pulse">Consulting expert...</p>
                </div>
              )}

              {aiState === LoadingState.ERROR && (
                <div className="h-full flex flex-col items-center justify-center text-red-400 text-center">
                  <AlertTriangle className="w-8 h-8 mb-2 opacity-80" />
                  <p>An error occurred while generating the analysis. Please try again.</p>
                </div>
              )}

              {aiState === LoadingState.SUCCESS && advice && (
                <div className="prose prose-invert prose-sm max-w-none">
                  {/* Basic Markdown rendering for bold text and lists */}
                  {advice.split('\n').map((line, idx) => {
                    const cleanLine = line.trim();
                    if (!cleanLine) return <br key={idx} />;
                    
                    // Simple bold parsing
                    const parts = line.split('**');
                    return (
                      <p key={idx} className="mb-2 last:mb-0">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i} className="text-indigo-300 font-bold">{part}</strong> : part
                        )}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}