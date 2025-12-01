"use client";
import React, { useState } from 'react';
import Synapse3D from '@/components/simulations/Synapse3D';
import { simulateSynapse, SynapseData } from '@/services/api';
import Cookies from 'js-cookie';
import { Network, Zap, Activity, Ban } from 'lucide-react';

export default function SynapsePage() {
    const [params, setParams] = useState({ neurotransmitter: 'ACETYLCHOLINE', receptorStatus: 'NORMAL' });
    const [data, setData] = useState<SynapseData | null>(null);
    const [loading, setLoading] = useState(false);

    const run = async () => {
        setLoading(true);
        const token = Cookies.get('token');
        if(!token) return;
        try {
            const res = await simulateSynapse(params, token);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // CORRECTION ICI : On définit une valeur sûre (0 si pas de données)
    const potential = data?.membranePotentialChange ?? 0;

    // On utilise cette valeur sûre pour la couleur
    const signalColor = potential > 0 ? '#22c55e' : potential < 0 ? '#a855f7' : '#94a3b8';

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-900 text-white">
            <header className="mb-8 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-purple-400">
                    <Network size={36} /> La Synapse Chimique
                </h1>
                <p className="text-gray-400 mt-2">Expérimentez l'effet des neurotransmetteurs excitateurs et inhibiteurs sur le potentiel de membrane.</p>
            </header>

            <div className="grid lg:grid-cols-4 gap-6">
                
                {/* --- CONTRÔLES (Gauche) --- */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Choix Neurotransmetteur */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-purple-300"><Zap size={18}/> Neurotransmetteur</h3>
                        <div className="space-y-2">
                            <button 
                                onClick={() => setParams({...params, neurotransmitter: 'ACETYLCHOLINE'})} 
                                className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${params.neurotransmitter === 'ACETYLCHOLINE' ? 'bg-red-900/50 border-red-500 text-red-200' : 'border-gray-600 hover:bg-gray-700'}`}
                            >
                                <span>Acétylcholine</span>
                                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">Excitateur</span>
                            </button>
                            <button 
                                onClick={() => setParams({...params, neurotransmitter: 'GABA'})} 
                                className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${params.neurotransmitter === 'GABA' ? 'bg-purple-900/50 border-purple-500 text-purple-200' : 'border-gray-600 hover:bg-gray-700'}`}
                            >
                                <span>GABA</span>
                                <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">Inhibiteur</span>
                            </button>
                        </div>
                    </div>

                    {/* État Récepteurs */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-300"><Ban size={18}/> Récepteurs</h3>
                        <select 
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm focus:border-blue-500 outline-none"
                            value={params.receptorStatus} onChange={(e) => setParams({...params, receptorStatus: e.target.value})}
                        >
                            <option value="NORMAL">État Normal</option>
                            <option value="BLOCKED">Bloqués (ex: Curare)</option>
                        </select>
                    </div>

                    <button 
                        onClick={run}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        {loading ? "Diffusion..." : <><Activity size={18}/> Stimuler</>}
                    </button>

                    {/* Oscilloscope Virtuel */}
                    <div className="bg-black p-4 rounded-xl border border-gray-700 relative overflow-hidden h-32">
                        <div className="absolute top-2 left-2 text-xs text-gray-500 font-mono">OSCILLOSCOPE (mV)</div>
                        {/* Ligne de base */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800"></div>
                        <div className="absolute top-1/2 right-2 text-xs text-gray-600">-70mV</div>
                        
                        {/* Signal (On utilise la variable 'potential' sécurisée) */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <polyline 
                                fill="none" 
                                stroke={signalColor} 
                                strokeWidth="3"
                                points={`0,60 100,60 120,${60 - potential} 150,${60 - potential} 200,60 300,60`}
                                className="animate-draw"
                            />
                        </svg>
                    </div>
                </div>

                {/* --- VISUALISATION 3D (Droite) --- */}
                <div className="lg:col-span-3 bg-black rounded-2xl overflow-hidden h-[600px] relative border border-gray-700 shadow-2xl">
                    {/* Légende interactive */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-black/50 p-2 rounded backdrop-blur border border-white/10 text-xs">
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div> Vésicule
                        </div>
                        <div className="flex items-center gap-2 bg-black/50 p-2 rounded backdrop-blur border border-white/10 text-xs">
                            <div className="w-3 h-3 rounded bg-slate-400 border border-white/50"></div> Canal Ionique
                        </div>
                    </div>

                    <Synapse3D data={data} />
                    
                    {data && (
                        <div className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur border border-gray-600 p-4 rounded-xl">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-1">Observation</h4>
                            <p className="text-white text-sm leading-relaxed">{data.message}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}