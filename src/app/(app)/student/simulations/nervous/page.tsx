"use client";
import React, { useState } from 'react';
import Neuron3D from '@/components/simulations/Neuron3D';
import { stimulateNeuron, NeuronData } from '@/services/api';
import Cookies from 'js-cookie';
import { Activity, Zap, Info, Settings2 } from 'lucide-react';

export default function NervousSystemPage() {
    const [intensity, setIntensity] = useState(20);
    const [data, setData] = useState<NeuronData | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleStimulate = async () => {
        if (isAnimating) return;
        setLoading(true);
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await stimulateNeuron(intensity, token);
            setData(res.data);
            if (res.data.fired) {
                setIsAnimating(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calcul pour l'affichage de l'oscilloscope
    const threshold = -50; // Seuil théorique
    const resting = -70; // Repos

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-900 text-white">
            <header className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-yellow-400">
                    <Activity size={36} /> Le Message Nerveux
                </h1>
                <p className="text-gray-400 mt-2">Comprendre la loi du "Tout ou Rien" et la propagation du Potentiel d'Action.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-6">
                
                {/* --- CONTRÔLES (Gauche - 3 cols) --- */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Stimulateur */}
                    <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-yellow-300">
                            <Zap size={20}/> Stimulateur
                        </h3>
                        
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Intensité</span>
                                <span className="font-mono font-bold text-yellow-400">{intensity} mV</span>
                            </div>
                            <input 
                                type="range" 
                                min="10" max="80" step="5"
                                value={intensity}
                                onChange={(e) => setIntensity(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">
                                <span>Infraliminaire</span>
                                <span>Supraliminaire</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleStimulate}
                            disabled={isAnimating || loading}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isAnimating ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-orange-500/20 active:scale-95'}`}
                        >
                            {loading ? "Calcul..." : "⚡ STIMULER"}
                        </button>
                    </div>

                    {/* Oscilloscope */}
                    <div className="bg-black p-4 rounded-2xl border border-gray-700 relative overflow-hidden h-48 shadow-inner">
                        <div className="absolute top-3 left-3 text-xs text-green-500 font-mono flex items-center gap-2">
                            <Activity size={12}/> OSCILLOSCOPE
                        </div>
                        
                        {/* Grille */}
                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                            {[...Array(16)].map((_, i) => <div key={i} className="border border-green-900/20"></div>)}
                        </div>

                        {/* Lignes de référence */}
                        <div className="absolute top-[45%] left-0 w-full h-[1px] bg-red-500/50 border-t border-dashed border-red-500"></div> {/* Seuil */}
                        <span className="absolute top-[40%] right-1 text-[9px] text-red-400">Seuil (-50mV)</span>
                        
                        <div className="absolute bottom-[20%] left-0 w-full h-[1px] bg-blue-500/50"></div> {/* Repos */}
                        <span className="absolute bottom-[15%] right-1 text-[9px] text-blue-400">-70mV</span>

                        {/* Courbe */}
                        {data ? (
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                                <polyline 
                                    fill="none" 
                                    stroke={data.fired ? "#22c55e" : "#ef4444"} 
                                    strokeWidth="3"
                                    points={data.graphData.map((pt, i) => {
                                        const x = i * (500 / (data.graphData.length - 1));
                                        // Mapping: -70mV = 80px (bas), +30mV = 20px (haut)
                                        const y = 80 - ((pt.v + 70) * 0.6); 
                                        return `${x},${y}`;
                                    }).join(" ")}
                                    className="animate-draw"
                                />
                            </svg>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-green-900/50 font-mono text-sm animate-pulse">
                                EN ATTENTE DE SIGNAL...
                            </div>
                        )}
                    </div>

                </div>

                {/* --- VISUALISATION 3D (Droite - 9 cols) --- */}
                <div className="lg:col-span-9 space-y-4">
                    <div className="bg-black rounded-2xl overflow-hidden h-[600px] relative border border-gray-700 shadow-2xl">
                        <Neuron3D isFiring={isAnimating} onSignalEnd={() => setIsAnimating(false)} />
                    </div>

                    {/* Analyse */}
                    {data && (
                        <div className={`p-5 rounded-xl border-l-4 animate-in slide-in-from-bottom-2 ${data.fired ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                            <h4 className={`font-bold text-lg mb-1 ${data.fired ? 'text-green-400' : 'text-red-400'}`}>
                                {data.fired ? "POTENTIEL D'ACTION DÉCLENCHÉ" : "STIMULATION INEFFICACE"}
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {data.message}
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}