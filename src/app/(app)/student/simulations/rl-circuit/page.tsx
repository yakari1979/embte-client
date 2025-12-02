"use client";
import React, { useState, useEffect } from 'react';
import RLCircuit3D from '@/components/simulations/RLCircuit3D';
import { simulateRL, RLConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Zap, Activity, Power, Timer } from 'lucide-react';

export default function RLPage() {
    const [params, setParams] = useState({ inductance: 0.1, resistance: 10, voltageE: 12 });
    const [mode, setMode] = useState('ESTABLISHMENT'); // ESTABLISHMENT ou RUPTURE
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [data, setData] = useState<RLConfig | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(async () => {
                setTime(prev => prev + 0.001); // Pas de temps très fin (ms)
                const token = Cookies.get('token');
                if(token) {
                    const res = await simulateRL({ ...params, time, mode }, token);
                    setData(res.data);
                    
                    // Stop si stabilisé
                    const p = parseFloat(res.data.percent);
                    if (mode === 'ESTABLISHMENT' && p > 99) setIsRunning(false);
                    if (mode === 'RUPTURE' && p < 1) setIsRunning(false);
                }
            }, 50); // Vitesse animation
        }
        return () => clearInterval(interval);
    }, [isRunning, time, mode, params]);

    const toggleSwitch = () => {
        const newMode = mode === 'ESTABLISHMENT' ? 'RUPTURE' : 'ESTABLISHMENT';
        setMode(newMode);
        setTime(0);
        setIsRunning(true);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-amber-500">
                    <Activity size={36} /> Dipôle RL (Auto-Induction)
                </h1>
                <p className="text-gray-400 mt-2">Visualisez le retard à l'établissement du courant causé par la bobine.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                
                <div className="space-y-6">
                    {/* Interrupteur */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center">
                        <button 
                            onClick={toggleSwitch}
                            className={`w-full py-6 rounded-xl font-black text-xl shadow-lg transform transition-all active:scale-95 flex flex-col items-center gap-2 ${mode === 'ESTABLISHMENT' ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-red-600 text-white shadow-red-500/20'}`}
                        >
                            <Power size={32}/>
                            {mode === 'ESTABLISHMENT' ? 'FERMER CIRCUIT (ON)' : 'OUVRIR CIRCUIT (OFF)'}
                        </button>
                        <p className="text-xs text-gray-400 mt-3">Cliquez pour basculer l'interrupteur K</p>
                    </div>

                    {/* Paramètres */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 block">Inductance L ({params.inductance} H)</label>
                            <input type="range" min="0.01" max="1.0" step="0.01" value={params.inductance} onChange={e=>setParams({...params, inductance: Number(e.target.value)})} className="w-full accent-amber-500"/>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block">Résistance R ({params.resistance} Ω)</label>
                            <input type="range" min="10" max="100" value={params.resistance} onChange={e=>setParams({...params, resistance: Number(e.target.value)})} className="w-full accent-gray-400"/>
                        </div>
                    </div>

                    {/* Mesures */}
                    {data && (
                        <div className="bg-black p-4 rounded-xl border border-gray-700 font-mono text-sm space-y-2">
                            <div className="flex justify-between text-yellow-400"><span>i (Intensité)</span> <span>{data.i} mA</span></div>
                            <div className="flex justify-between text-red-400"><span>uL (Tension Bobine)</span> <span>{data.ul} V</span></div>
                            <div className="flex justify-between text-blue-400"><span>Em (Énergie)</span> <span>{data.energy} mJ</span></div>
                            <div className="border-t border-gray-800 pt-2 text-gray-500 text-xs">Constante de temps τ = L/R = {data.tau} ms</div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <RLCircuit3D config={data} />
                    {data && (
                        <div className="mt-4 p-4 rounded-xl border border-amber-500/30 bg-amber-900/10 text-amber-200 text-sm">
                            {data.message}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}