"use client";

import React, { useState } from 'react';
import { getCellSimulationConfig, CellConfig } from '@/services/api';
import Cell3D from '@/components/simulations/Cell3D';
import Cookies from 'js-cookie';
import { Settings2, Play, Activity, Microscope, Leaf, Dog } from 'lucide-react';

export default function CellSimulationPage() {
  const [params, setParams] = useState({
    cellType: 'ANIMAL', // ou PLANT
    healthState: 'NORMAL' // ou SICK, ACTIVE
  });

  // Config par défaut pour éviter l'écran vide au démarrage
  const [config, setConfig] = useState<CellConfig | null>({
      membraneColor: "#3b82f6",
      nucleusColor: "#ef4444",
      mitochondriaCount: 5,
      hasCellWall: false,
      chloroplasts: false,
      cellType: 'ANIMAL', // Important pour le rendu 3D
      message: "Cellule animale standard en condition physiologique normale."
  });
  
  const [loading, setLoading] = useState(false);

  const launchSimulation = async (newParams: typeof params) => {
    setLoading(true);
    setParams(newParams); // Mise à jour immédiate UI
    
    const token = Cookies.get('token');
    if(!token) return;

    try {
      const res = await getCellSimulationConfig(newParams, token);
      setConfig(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Microscope className="text-blue-500" size={36}/> 
          L'Ultrastructure Cellulaire
        </h1>
        <p className="text-gray-500 mt-2">
            Laboratoire de cytologie comparée : Animal vs Végétal.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE : CONTRÔLES (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
              <Settings2 size={18}/> Modèle Biologique
            </h2>

            <div className="space-y-4">
                {/* Choix Type */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Règne</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                        onClick={() => launchSimulation({...params, cellType: 'ANIMAL'})}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${params.cellType === 'ANIMAL' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400'}`}
                        >
                        <Dog size={20}/>
                        <span className="text-xs font-bold">Animale</span>
                        </button>
                        <button 
                        onClick={() => launchSimulation({...params, cellType: 'PLANT'})}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${params.cellType === 'PLANT' ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400'}`}
                        >
                        <Leaf size={20}/>
                        <span className="text-xs font-bold">Végétale</span>
                        </button>
                    </div>
                </div>

                {/* Choix État */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Métabolisme</label>
                    <select 
                        value={params.healthState}
                        onChange={(e) => launchSimulation({...params, healthState: e.target.value})}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:border-blue-500 text-sm"
                    >
                        <option value="NORMAL">Repos Physiologique</option>
                        <option value="ACTIVE">⚡ Forte Activité (ATP++)</option>
                        <option value="SICK">🦠 Infection Virale</option>
                    </select>
                </div>
            </div>
          </div>

          {/* Analyse IA */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
             <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                 <Activity size={16}/> Diagnostic
             </h3>
             <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                 {loading ? "Analyse microscopique en cours..." : config?.message}
             </p>
          </div>

        </div>

        {/* COLONNE DROITE : VISUALISATION 3D (9 cols) */}
        <div className="lg:col-span-9">
           {config ? (
             <div className="animate-in fade-in zoom-in duration-500">
                <Cell3D config={config} />
             </div>
           ) : (
             <div className="h-[600px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}