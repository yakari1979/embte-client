"use client";

import React, { useState } from 'react';
import { getDNASimulationConfig, DNAConfig } from '@/services/api';
import DNA3D from '@/components/simulations/DNA3D';
import Cookies from 'js-cookie';
import { Dna, Play, AlertTriangle, Flame, ThermometerSun, ShieldCheck } from 'lucide-react';

export default function DNASimulationPage() {
  const [scenario, setScenario] = useState('NORMAL');
  
  // Config par défaut
  const [config, setConfig] = useState<DNAConfig | null>({
      strandColor: "#e0e0e0",
      rotationSpeed: 0.5,
      basePairCount: 20,
      separation: 0,
      hasMutation: false,
      mutationIndex: -1,
      message: "ADN Double Hélice : Structure stable et complémentaire."
  });
  
  const [loading, setLoading] = useState(false);

  const launchSimulation = async (newScenario: string) => {
    setLoading(true);
    setScenario(newScenario);
    
    const token = Cookies.get('token');
    if(!token) return;

    try {
      const res = await getDNASimulationConfig({ scenario: newScenario }, token);
      setConfig(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- CORRECTION ICI : On sécurise les valeurs pour éviter l'erreur TypeScript ---
  // Si config est null ou si separation est undefined, on utilise 0 ou false par défaut.
  const isMutated = config?.hasMutation ?? false;
  const isSeparated = (config?.separation ?? 0) > 0.5; // On considère séparé si > 0.5

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Dna className="text-purple-600" size={36}/> 
          La Molécule d'Hérédité (ADN)
        </h1>
        <p className="text-gray-500 mt-2">
            Explorez la structure en double hélice et testez sa stabilité face aux agents mutagènes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE : CONTRÔLES (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
              <Play size={18}/> Expériences
            </h2>
            
            <div className="space-y-3">
               <button 
                  onClick={() => launchSimulation('NORMAL')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${scenario === 'NORMAL' ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'}`}
               >
                  <div className={`p-2 rounded-lg ${scenario === 'NORMAL' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-900'}`}><ShieldCheck size={18}/></div>
                  <div>
                      <div className={`font-bold text-sm ${scenario === 'NORMAL' ? 'text-green-800' : 'text-gray-700 dark:text-gray-300'}`}>État Physiologique</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">37°C • pH 7.4</div>
                  </div>
               </button>

               <button 
                  onClick={() => launchSimulation('MUTATION')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${scenario === 'MUTATION' ? 'bg-red-50 border-red-500 ring-1 ring-red-500' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'}`}
               >
                  <div className={`p-2 rounded-lg ${scenario === 'MUTATION' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-900'}`}><AlertTriangle size={18}/></div>
                  <div>
                      <div className={`font-bold text-sm ${scenario === 'MUTATION' ? 'text-red-800' : 'text-gray-700 dark:text-gray-300'}`}>Agent Mutagène</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">UV / Rayons X</div>
                  </div>
               </button>

               <button 
                  onClick={() => launchSimulation('HEAT')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${scenario === 'HEAT' ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'}`}
               >
                  <div className={`p-2 rounded-lg ${scenario === 'HEAT' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-900'}`}><ThermometerSun size={18}/></div>
                  <div>
                      <div className={`font-bold text-sm ${scenario === 'HEAT' ? 'text-orange-800' : 'text-gray-700 dark:text-gray-300'}`}>Choc Thermique</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">95°C (PCR)</div>
                  </div>
               </button>
            </div>
          </div>

          {/* Carte Observation (On utilise les variables sécurisées) */}
          <div className={`p-5 rounded-2xl border transition-all ${isMutated ? 'bg-red-50 border-red-200' : isSeparated ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
              <h3 className={`font-bold text-sm uppercase tracking-wide mb-2 ${isMutated ? 'text-red-700' : isSeparated ? 'text-orange-700' : 'text-blue-700'}`}>
                  Observation Labo
              </h3>
              <p className={`text-sm leading-relaxed ${isMutated ? 'text-red-900' : isSeparated ? 'text-orange-900' : 'text-blue-900'}`}>
                  {config?.message}
              </p>
          </div>

        </div>

        {/* COLONNE DROITE : VISUALISATION (9 cols) */}
        <div className="lg:col-span-9">
           {config ? (
               <div className="animate-in fade-in zoom-in duration-500">
                   <DNA3D config={config} />
               </div>
           ) : (
               <div className="h-[600px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
               </div>
           )}
        </div>

      </div>
    </div>
  );
}