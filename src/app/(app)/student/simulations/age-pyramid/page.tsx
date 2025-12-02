"use client";
import React, { useState, useEffect } from 'react';
import AgePyramid3D from '@/components/simulations/AgePyramid3D';
import { simulatePyramid, PyramidConfig } from '@/services/api';
import Cookies from 'js-cookie';
import { Users, Globe, Activity, AlertTriangle } from 'lucide-react';

export default function AgePyramidPage() {
    const [country, setCountry] = useState('SENEGAL');
    const [birthRate, setBirthRate] = useState(1);
    const [lifeExp, setLifeExp] = useState(1);
    const [data, setData] = useState<PyramidConfig | null>(null);
    const [loading, setLoading] = useState(true); // État de chargement

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            setLoading(true);
            simulatePyramid({ country, birthModifier: birthRate, lifeModifier: lifeExp }, token)
                .then(res => {
                    setData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [country, birthRate, lifeExp]);

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-blue-400">
                    <Users size={36} /> Démographie : Pyramide des Âges
                </h1>
                <p className="text-gray-400 mt-2">Analysez la structure de la population et la transition démographique.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* GAUCHE : CONTRÔLES (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Carte Pays */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-200"><Globe size={18}/> Modèle de Pays</h3>
                        <div className="flex bg-slate-900 p-1 rounded-lg mb-6">
                            <button onClick={()=>setCountry('SENEGAL')} className={`flex-1 py-3 rounded-md font-bold text-sm transition-all ${country==='SENEGAL'?'bg-green-600 text-white shadow':'text-gray-500 hover:text-white'}`}>
                                Sénégal
                            </button>
                            <button onClick={()=>setCountry('FRANCE')} className={`flex-1 py-3 rounded-md font-bold text-sm transition-all ${country==='FRANCE'?'bg-blue-600 text-white shadow':'text-gray-500 hover:text-white'}`}>
                                France
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-blue-400 font-bold">Natalité</span>
                                    <span className="text-white">{birthRate > 1 ? 'Forte (Baby Boom)' : birthRate < 1 ? 'Faible (Dénatalité)' : 'Moyenne'}</span>
                                </div>
                                <input type="range" min="0.5" max="1.5" step="0.1" value={birthRate} onChange={e=>setBirthRate(Number(e.target.value))} className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg cursor-pointer"/>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-pink-400 font-bold">Espérance de vie</span>
                                    <span className="text-white">{lifeExp > 1 ? 'Longue' : 'Courte'}</span>
                                </div>
                                <input type="range" min="0.8" max="1.2" step="0.05" value={lifeExp} onChange={e=>setLifeExp(Number(e.target.value))} className="w-full accent-pink-500 h-2 bg-slate-700 rounded-lg cursor-pointer"/>
                            </div>
                        </div>
                    </div>

                    {/* Carte Analyse */}
                    {data && (
                        <div className="bg-black p-5 rounded-2xl border border-slate-700 animate-in fade-in">
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                                <Activity size={12}/> Diagnostic Démographique
                            </h4>
                            <div className="text-lg font-bold text-white mb-2">{data.type.split(':')[0]}</div>
                            <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-blue-500 pl-3">
                                {data.type.split(':')[1]}
                            </p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Population Totale</span>
                                <span className="font-mono font-bold text-yellow-400 text-lg">{data.totalPop.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* DROITE : VISUALISATION 3D (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                    {loading ? (
                        <div className="h-[600px] w-full bg-slate-900 rounded-xl border-4 border-slate-700 flex flex-col items-center justify-center text-slate-500 animate-pulse">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            Calcul du recensement...
                        </div>
                    ) : (
                        <AgePyramid3D config={data} />
                    )}
                    
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={20}/>
                        <div className="text-sm text-gray-300">
                            <strong>Interprétation :</strong> Une base large (Triangle) indique une population jeune et une forte croissance. Une base étroite (Urne) indique un vieillissement de la population.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}