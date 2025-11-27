"use client";

import React, { useState } from 'react';
import { getCellSimulationConfig, CellConfig } from '@/services/api';
import Cell3D from '@/components/simulations/Cell3D';
import Cookies from 'js-cookie';
import { Settings2, Play, Activity, Microscope } from 'lucide-react';

export default function CellSimulationPage() {
  // 1. État des contrôles (Formulaire)
  const [params, setParams] = useState({
    cellType: 'ANIMAL', // ou PLANT
    healthState: 'NORMAL' // ou SICK, ACTIVE
  });

  // 2. État de la config reçue du Backend
  const [config, setConfig] = useState<CellConfig | null>(null);
  const [loading, setLoading] = useState(false);

  // 3. Appel au Backend
  const launchSimulation = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    if(!token) return;

    try {
      const res = await getCellSimulationConfig(params, token);
      setConfig(res.data);
    } catch (error) {
      console.error(error);
      alert("Erreur de simulation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-surface min-h-screen">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Microscope className="text-blue-600" size={32}/> 
          Laboratoire Virtuel : La Cellule
        </h1>
        <p className="text-gray-500">Configurez les paramètres biologiques et observez la réaction cellulaire en 3D.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : CONTRÔLES */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
            <Settings2 size={20}/> Paramètres
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de Cellule</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setParams({...params, cellType: 'ANIMAL'})}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${params.cellType === 'ANIMAL' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'}`}
                >
                  🦁 Animale
                </button>
                <button 
                   onClick={() => setParams({...params, cellType: 'PLANT'})}
                   className={`p-3 rounded-xl border text-sm font-bold transition-all ${params.cellType === 'PLANT' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'}`}
                >
                  🌿 Végétale
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">État Physiologique</label>
              <select 
                value={params.healthState}
                onChange={(e) => setParams({...params, healthState: e.target.value})}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NORMAL">Standard (Repos)</option>
                <option value="ACTIVE">⚡ Hyper-active (Mitochondries ++)</option>
                <option value="SICK">🦠 Malade / Infectée</option>
              </select>
            </div>

            <button 
              onClick={launchSimulation}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              {loading ? "Calcul en cours..." : <><Play size={20} fill="currentColor"/> Lancer la Simulation</>}
            </button>
          </div>
        </div>

        {/* COLONNE DROITE : VISUALISATION 3D */}
        <div className="lg:col-span-2 space-y-4">
           {config ? (
             <div className="animate-in fade-in zoom-in duration-500">
                <Cell3D config={config} />
                
                {/* Analyse de l'IA (Mockup basé sur le backend message) */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3 mt-4">
                   <Activity className="text-blue-600 shrink-0 mt-1" />
                   <div>
                      <h3 className="font-bold text-blue-800 dark:text-blue-200">Analyse Péni-Bot</h3>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">{config.message}</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-[500px] bg-gray-100 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400">
                <Microscope size={64} className="mb-4 opacity-20"/>
                <p>En attente de configuration...</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}