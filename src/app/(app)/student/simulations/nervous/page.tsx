"use client";

import React, { useState } from 'react';
import Neuron3D from '@/components/simulations/Neuron3D';
import { stimulateNeuron, NeuronData } from '@/services/api';
import Cookies from 'js-cookie';
import { Activity, Zap, ArrowRight } from 'lucide-react';

export default function NervousSystemPage() {
  const [intensity, setIntensity] = useState(20); // Valeur par défaut (faible)
  const [data, setData] = useState<NeuronData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStimulate = async () => {
    if (isAnimating) return; // On attend la fin de l'animation précédente
    setLoading(true);
    
    const token = Cookies.get('token');
    if (!token) return;

    try {
        const res = await stimulateNeuron(intensity, token);
        setData(res.data);
        
        // Si le neurone tire (fired), on lance l'animation 3D
        if (res.data.fired) {
            setIsAnimating(true);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-surface min-h-screen">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Activity className="text-yellow-500" size={36}/> 
          Le Message Nerveux
        </h1>
        <p className="text-gray-500">Comprendre la naissance et la propagation du Potentiel d'Action.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GAUCHE : CONTRÔLES */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6 h-fit">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                <Zap size={20} className="text-yellow-500"/> Stimulateur
            </h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Intensité de la stimulation : <span className="text-blue-600 font-bold">{intensity} mV</span>
                </label>
                <input 
                    type="range" 
                    min="10" max="100" step="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Faible</span>
                    <span>Seuil (~30mV)</span>
                    <span>Forte</span>
                </div>
            </div>

            <button 
                onClick={handleStimulate}
                disabled={isAnimating || loading}
                className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${isAnimating ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-500/30'}`}
            >
                {loading ? "Calcul..." : "⚡ Envoyer la stimulation"}
            </button>

            {/* Résultat textuel */}
            {data && (
                <div className={`p-4 rounded-xl border text-sm ${data.fired ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <p className="font-bold mb-1">{data.fired ? "POTENTIEL D'ACTION !" : "PAS DE RÉPONSE"}</p>
                    <p>{data.message}</p>
                </div>
            )}
        </div>

        {/* DROITE : VISUALISATION */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Vue 3D */}
            <Neuron3D 
                isFiring={isAnimating} 
                onSignalEnd={() => setIsAnimating(false)} 
            />

            {/* Graphique (Oscilloscope) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">Oscilloscope (Voltage de la membrane)</h3>
                
                <div className="h-40 w-full bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 relative flex items-end p-4 overflow-hidden">
                    {/* Ligne de seuil */}
                    <div className="absolute top-[40%] left-0 w-full h-[1px] bg-red-400 border-t border-dashed border-red-500 opacity-50"></div>
                    <span className="absolute top-[38%] right-2 text-xs text-red-500">Seuil (-50mV)</span>

                    {/* Ligne de repos */}
                    <div className="absolute bottom-[20%] left-0 w-full h-[1px] bg-blue-400 opacity-30"></div>
                    <span className="absolute bottom-[18%] right-2 text-xs text-blue-500">-70mV</span>

                    {/* Tracé de la courbe */}
                    {data && (
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                            <polyline 
                                fill="none" 
                                stroke={data.fired ? "#22c55e" : "#ef4444"} 
                                strokeWidth="3"
                                points={data.graphData.map((pt, i) => {
                                    // Conversion simple des données en coordonnées SVG
                                    // X : temps (0 à 5) -> (0 à 500)
                                    // Y : voltage (-80 à +40) -> (100 à 0)
                                    const x = i * (500 / (data.graphData.length - 1));
                                    // Mapping approximatif pour l'affichage
                                    // -70mV = bas, +30mV = haut
                                    const y = 100 - ((pt.v + 90) * 0.8); 
                                    return `${x},${y}`;
                                }).join(" ")}
                                className="animate-draw" // Tu peux ajouter une anim CSS ici
                            />
                        </svg>
                    )}
                    {!data && <p className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">En attente de stimulation...</p>}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}