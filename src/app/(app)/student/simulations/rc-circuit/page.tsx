"use client";
import React, { useState, useEffect, useRef } from 'react';
import RLCircuit3D from '@/components/simulations/RLCircuit3D';
import { simulateRL, RLConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Zap, Activity, Power, TrendingUp, Info } from 'lucide-react';

export default function RLPage() {
    const [params, setParams] = useState({ inductance: 0.1, resistance: 10, voltageE: 12 });
    const [mode, setMode] = useState('ESTABLISHMENT'); 
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [data, setData] = useState<RLConfig | null>(null);
    
    // Historique pour le graphique
    const [history, setHistory] = useState<{t: number, i: number}[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(async () => {
                setTime(prev => prev + 0.002); // Pas de temps fin
                const token = Cookies.get('token');
                if(token) {
                    const res = await simulateRL({ ...params, time, mode }, token);
                    setData(res.data);
                    
                    // Mise à jour graphique
                    setHistory(prev => [...prev.slice(-50), { t: time, i: parseFloat(res.data.i) }]);

                    // Stop conditions
                    const p = parseFloat(res.data.percent);
                    if (mode === 'ESTABLISHMENT' && p > 99) setIsRunning(false);
                    if (mode === 'RUPTURE' && p < 1) setIsRunning(false);
                }
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isRunning, time, mode, params]);

    const toggleSwitch = () => {
        const newMode = mode === 'ESTABLISHMENT' ? 'RUPTURE' : 'ESTABLISHMENT';
        setMode(newMode);
        setTime(0);
        setHistory([]); // Reset graph
        setIsRunning(true);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-amber-500">
                    <Activity size={36} /> Dipôle RL (Auto-Induction)
                </h1>
                <p className="text-gray-400 mt-2">Visualisez le retard à l'établissement du courant et la constante de temps τ.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* GAUCHE : CONTRÔLES (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Power className="text-amber-500"/> Circuit de Commande</h3>
                        <button 
                            onClick={toggleSwitch}
                            className={`w-full py-6 rounded-xl font-black text-xl shadow-lg transform transition-all active:scale-95 flex flex-col items-center gap-2 border-b-4 ${mode === 'ESTABLISHMENT' ? 'bg-green-600 border-green-800 text-white' : 'bg-red-600 border-red-800 text-white'}`}
                        >
                            <span>{mode === 'ESTABLISHMENT' ? 'FERMER (ON)' : 'OUVRIR (OFF)'}</span>
                            <span className="text-xs font-normal opacity-80">{mode === 'ESTABLISHMENT' ? 'Établissement du courant' : 'Rupture du courant'}</span>
                        </button>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-5">
                        <h3 className="font-bold border-b border-slate-600 pb-2">Composants</h3>
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Inductance (L)</span> <span className="text-white">{params.inductance} H</span>
                            </div>
                            <input type="range" min="0.01" max="1.0" step="0.01" value={params.inductance} onChange={e=>setParams({...params, inductance: Number(e.target.value)})} className="w-full accent-amber-500"/>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Résistance (R)</span> <span className="text-white">{params.resistance} Ω</span>
                            </div>
                            <input type="range" min="10" max="100" value={params.resistance} onChange={e=>setParams({...params, resistance: Number(e.target.value)})} className="w-full accent-gray-400"/>
                        </div>
                    </div>

                    {/* FORMULE INFO */}
                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-800 text-xs text-blue-200">
                        <div className="flex items-center gap-2 font-bold mb-2"><Info size={14}/> Théorie</div>
                        <p>Constante de temps : <span className="font-mono text-white">τ = L / R</span></p>
                        <p>À t = τ, le courant atteint 63% de sa valeur maximale.</p>
                        <p className="mt-2 text-yellow-400 font-mono">Calculé : τ = {(params.inductance / params.resistance * 1000).toFixed(1)} ms</p>
                    </div>
                </div>

                {/* DROITE : VISUALISATION & GRAPHIQUE (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <RLCircuit3D config={data} />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Moniteur Numérique */}
                        {data && (
                            <div className="bg-black p-5 rounded-2xl border border-gray-700 font-mono text-sm space-y-3 shadow-inner">
                                <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Multimètre</h4>
                                <div className="flex justify-between items-center text-yellow-400 border-b border-gray-800 pb-1">
                                    <span>Intensité (i)</span> <span className="text-xl">{data.i} mA</span>
                                </div>
                                <div className="flex justify-between items-center text-red-400 border-b border-gray-800 pb-1">
                                    <span>Tension Bobine (uL)</span> <span className="text-xl">{data.ul} V</span>
                                </div>
                                <div className="flex justify-between items-center text-blue-400">
                                    <span>Énergie (Em)</span> <span className="text-xl">{data.energy} mJ</span>
                                </div>
                            </div>
                        )}

                        {/* GRAPHIQUE i(t) */}
                        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 relative h-40 flex items-end overflow-hidden">
                            <div className="absolute top-2 left-2 text-xs font-bold text-gray-400 flex items-center gap-1">
                                <TrendingUp size={14}/> Courbe i(t)
                            </div>
                            {/* Grille */}
                            <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 pointer-events-none">
                                {[...Array(20)].map((_,i) => <div key={i} className="border border-slate-700/50"></div>)}
                            </div>
                            
                            {/* Tracé SVG dynamique */}
                            {history.length > 1 && (
                                <svg className="w-full h-full z-10" viewBox={`0 0 ${history.length} 100`} preserveAspectRatio="none">
                                    <path 
                                        d={`M 0,100 ${history.map((pt, i) => `L ${i}, ${100 - (pt.i / (params.voltageE/params.resistance*1000) * 80)}`).join(' ')}`}
                                        fill="none" 
                                        stroke="#fbbf24" 
                                        strokeWidth="2"
                                    />
                                    {/* Ligne asymptote (I max) */}
                                    <line x1="0" y1="20" x2="100%" y2="20" stroke="white" strokeDasharray="4" opacity="0.3" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}