"use client";

import React, { useState } from 'react';
import { getDNASimulationConfig, DNAConfig } from '@/services/api';
import DNA3D from '@/components/simulations/DNA3D';
import Cookies from 'js-cookie';
import { Dna, Play, AlertTriangle, Flame } from 'lucide-react';

export default function DNASimulationPage() {
  const [scenario, setScenario] = useState('NORMAL');
  const [config, setConfig] = useState<DNAConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const launchSimulation = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    if(!token) return;

    try {
      const res = await getDNASimulationConfig({ scenario }, token);
      setConfig(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-surface min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Dna className="text-purple-600" size={36}/> 
          Structure de l'ADN
        </h1>
        <p className="text-gray-500">Visualisez la double hélice et simulez des accidents génétiques.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CONTRÔLES */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
          <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Scénario</h2>
          
          <div className="space-y-3">
             <button 
                onClick={() => setScenario('NORMAL')}
                className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${scenario === 'NORMAL' ? 'bg-green-50 border-green-500 text-green-800' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                <div className="bg-green-200 p-2 rounded-full"><Dna size={16}/></div>
                <div>
                    <div className="font-bold">Normal</div>
                    <div className="text-xs opacity-70">Appariement A-T / G-C</div>
                </div>
             </button>

             <button 
                onClick={() => setScenario('MUTATION')}
                className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${scenario === 'MUTATION' ? 'bg-red-50 border-red-500 text-red-800' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                <div className="bg-red-200 p-2 rounded-full"><AlertTriangle size={16}/></div>
                <div>
                    <div className="font-bold">Mutation</div>
                    <div className="text-xs opacity-70">Erreur de réplication</div>
                </div>
             </button>

             <button 
                onClick={() => setScenario('HEAT')}
                className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${scenario === 'HEAT' ? 'bg-orange-50 border-orange-500 text-orange-800' : 'border-gray-200 hover:bg-gray-50'}`}
             >
                <div className="bg-orange-200 p-2 rounded-full"><Flame size={16}/></div>
                <div>
                    <div className="font-bold">Chaleur (95°C)</div>
                    <div className="text-xs opacity-70">Dénaturation</div>
                </div>
             </button>

             <button 
               onClick={launchSimulation}
               className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex justify-center items-center gap-2"
             >
                {loading ? "Chargement..." : <><Play size={18}/> Lancer</>}
             </button>
          </div>
        </div>

        {/* VISUALISATION */}
        <div className="lg:col-span-2">
           {config ? (
               <div className="space-y-4 animate-in fade-in">
                   <DNA3D config={config} />
                   <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                       <p className="font-bold text-purple-900 dark:text-purple-200">Observation :</p>
                       <p className="text-purple-700 dark:text-purple-300">{config.message}</p>
                   </div>
               </div>
           ) : (
               <div className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700">
                   <Dna size={64} className="opacity-20"/>
               </div>
           )}
        </div>
      </div>
    </div>
  );
}