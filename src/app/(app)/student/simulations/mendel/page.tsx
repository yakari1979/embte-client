"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Html, Stars } from '@react-three/drei';
import { MendelPea } from '@/components/simulations/MendelPea';
import { getMendelSimulation, MendelData } from '@/services/api';
import Cookies from 'js-cookie';
import { Sprout, BarChart3, Info, RefreshCcw, Dna, FlaskConical } from 'lucide-react';

export default function MendelPage() {
  const [type, setType] = useState<'MONO' | 'DI' | 'TRI'>('MONO');
  const [generation, setGeneration] = useState<'P' | 'F1' | 'F2'>('P');
  const [data, setData] = useState<MendelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeaIndex, setSelectedPeaIndex] = useState<number | null>(null);

  const runSimulation = async (targetGen: 'F1' | 'F2') => {
    setLoading(true);
    setSelectedPeaIndex(null);
    setGeneration(targetGen);
    const token = Cookies.get('token');
    if (!token) return;

    try {
        const res = await getMendelSimulation(type, targetGen, token);
        setData(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const reset = () => {
      setGeneration('P');
      setData(null);
      setSelectedPeaIndex(null);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* Remplacement de <header> par <div> pour éviter les erreurs de nesting */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <Sprout className="text-green-600 dark:text-green-400" size={32}/>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Génétique Mendélienne
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Laboratoire de croisements virtuels (Pisum sativum)
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- CONTRÔLES (GAUCHE) --- */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Choix du croisement */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <FlaskConical size={18} className="text-blue-500"/> Expérience
                </h3>
                <div className="space-y-2">
                    {[
                        { id: 'MONO', label: 'Monohybridisme', sub: '1 Caractère (Couleur)' },
                        { id: 'DI', label: 'Dihybridisme', sub: '2 Caractères (+ Forme)' },
                        { id: 'TRI', label: 'Trishybridisme', sub: '3 Caractères (+ Fleur)' }
                    ].map((opt) => (
                        <button 
                            key={opt.id}
                            onClick={() => { setType(opt.id as any); reset(); }} 
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${type === opt.id ? 'bg-green-50 border-green-500 ring-1 ring-green-500 dark:bg-green-900/20' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'}`}
                        >
                            <div className={`font-bold ${type === opt.id ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>{opt.label}</div>
                            <div className="text-xs text-gray-500">{opt.sub}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Étapes de simulation */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <Dna size={18} className="text-purple-500"/> Générations
                </h3>
                
                <div className="relative space-y-6 pl-4">
                    {/* Ligne verticale */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                    {/* Étape P */}
                    <div className="relative">
                        <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${generation === 'P' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></div>
                        <div className="font-bold text-sm text-gray-800 dark:text-white">Génération P (Parents)</div>
                        <div className="text-xs text-gray-500 mb-2">Lignées Pures (Homozygotes)</div>
                        {generation === 'P' && (
                            <button onClick={() => runSimulation('F1')} className="w-full py-2 bg-gray-900 dark:bg-white dark:text-black text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                                Croiser (Fécondation)
                            </button>
                        )}
                    </div>

                    {/* Étape F1 */}
                    <div className="relative">
                        <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${generation === 'F1' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></div>
                        <div className="font-bold text-sm text-gray-800 dark:text-white">Génération F1</div>
                        <div className="text-xs text-gray-500 mb-2">100% Hybrides (Hétérozygotes)</div>
                        {generation === 'F1' && (
                            <button onClick={() => runSimulation('F2')} className="w-full py-2 bg-gray-900 dark:bg-white dark:text-black text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                                Autofécondation (F1 x F1)
                            </button>
                        )}
                    </div>

                    {/* Étape F2 */}
                    <div className="relative">
                        <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${generation === 'F2' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></div>
                        <div className="font-bold text-sm text-gray-800 dark:text-white">Génération F2</div>
                        <div className="text-xs text-gray-500 mb-2">Disjonction des allèles</div>
                        {generation === 'F2' && (
                            <button onClick={reset} className="w-full py-2 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                                <RefreshCcw size={14}/> Réinitialiser
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- VISUALISATION 3D (CENTRE) --- */}
        <div className="lg:col-span-3 flex flex-col gap-6">
            
            <div className="h-[600px] bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-xl relative border-4 border-white dark:border-gray-700">
                
                {/* Indication */}
                <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-600">
                    <Info size={16} className="text-blue-500"/>
                    {generation === 'P' ? "Observez les phénotypes parentaux purs." : "Cliquez sur un individu pour analyser son phénotype."}
                </div>

                <Canvas camera={{ position: [0, 8, 12], fov: 45 }} shadows>
                    <ambientLight intensity={0.6} />
                    <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
                    <pointLight position={[-10, 5, -10]} intensity={0.8} color="#a7f3d0" /> 
                    <Stars radius={100} depth={50} count={400} factor={4} saturation={0} fade speed={1} />

                    <Center top>
                        {/* SCÈNE PARENTS (P) */}
                        {generation === 'P' && (
                            <group>
                                <MendelPea color="YELLOW" shape="ROUND" flower="PURPLE" position={[-3, 0, 0]} onClick={()=>{}} isSelected={false} showFlower={type === 'TRI'} />
                                <Html position={[-3, -1.5, 0]} center><div className="bg-yellow-100 text-yellow-800 px-2 rounded font-bold text-xs">Dominant</div></Html>
                                
                                <Html position={[0, 1, 0]} center><div className="text-4xl font-black text-gray-400 opacity-50">×</div></Html>
                                
                                <MendelPea color="GREEN" shape="WRINKLED" flower="WHITE" position={[3, 0, 0]} onClick={()=>{}} isSelected={false} showFlower={type === 'TRI'} />
                                <Html position={[3, -1.5, 0]} center><div className="bg-green-100 text-green-800 px-2 rounded font-bold text-xs">Récessif</div></Html>
                            </group>
                        )}

                        {/* SCÈNE DESCENDANCE (F1 / F2) */}
                        {(generation === 'F1' || generation === 'F2') && data?.offspring.map((pea, i) => {
                            const cols = 8;
                            const row = Math.floor(i / cols);
                            const col = i % cols;
                            const spacing = 1.8;
                            
                            return (
                                <MendelPea 
                                    key={i} 
                                    color={pea.color} 
                                    shape={pea.shape} 
                                    flower={pea.flower}
                                    position={[(col - (cols-1)/2) * spacing, 0, (row - 1.5) * spacing]}
                                    onClick={() => setSelectedPeaIndex(i === selectedPeaIndex ? null : i)}
                                    isSelected={i === selectedPeaIndex}
                                    showFlower={type === 'TRI'}
                                />
                            );
                        })}
                    </Center>

                    <OrbitControls 
                        autoRotate={generation === 'P'} 
                        autoRotateSpeed={2}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2.2}
                    />
                </Canvas>

                {loading && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-3"></div>
                        <div className="text-green-800 dark:text-green-200 font-bold animate-pulse">Croisement en cours...</div>
                    </div>
                )}
            </div>

            {/* ANALYSE STATISTIQUE (Bas de page) */}
            {generation === 'F2' && data?.stats && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-white">
                            <BarChart3 className="text-blue-500"/> Analyse Statistique F2
                        </h3>
                        <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            Proportions Théoriques
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(data.stats).map(([key, val]) => (
                            <div key={key} className="relative overflow-hidden bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700 group hover:border-green-400 transition-colors">
                                <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-1000" style={{ width: `${val}%` }}></div>
                                <div className="flex justify-between items-end mb-2">
                                    <div className="text-3xl font-black text-gray-800 dark:text-white">{val}<span className="text-sm text-gray-400">%</span></div>
                                    <div className="text-xs font-mono text-gray-400">
                                        {val > 50 ? '9/16' : val > 18 ? '3/16' : '1/16'}
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-tight">
                                    {key}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}