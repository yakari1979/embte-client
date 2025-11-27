"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Html } from '@react-three/drei';
import { MendelPea } from '@/components/simulations/MendelPea';
import { getMendelSimulation, MendelData } from '@/services/api';
import Cookies from 'js-cookie';
import { Sprout, BarChart3, Info } from 'lucide-react';

export default function MendelPage() {
  const [type, setType] = useState<'MONO' | 'DI' | 'TRI'>('MONO');
  const [generation, setGeneration] = useState<'P' | 'F1' | 'F2'>('P');
  const [data, setData] = useState<MendelData | null>(null);
  const [loading, setLoading] = useState(false);
  
  // État pour savoir quel pois est cliqué (null = aucun)
  const [selectedPeaIndex, setSelectedPeaIndex] = useState<number | null>(null);

  const runSimulation = async (targetGen: 'F1' | 'F2') => {
    setLoading(true);
    setSelectedPeaIndex(null); // Reset sélection
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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-surface min-h-screen">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Sprout className="text-green-600" size={36}/> 
          Les Lois de Mendel
        </h1>
        <p className="text-gray-500">Simulez des croisements et observez la transmission des caractères héréditaires.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- CONTRÔLES (GAUCHE) --- */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Choix du croisement */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Type de Croisement</h3>
                <div className="space-y-2">
                    <button onClick={() => {setType('MONO'); reset()}} className={`w-full text-left p-3 rounded-lg border transition-all ${type === 'MONO' ? 'bg-green-100 border-green-500 text-green-800' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="font-bold">Monohybridisme</div>
                        <div className="text-xs opacity-70">1 caractère (Couleur)</div>
                    </button>
                    <button onClick={() => {setType('DI'); reset()}} className={`w-full text-left p-3 rounded-lg border transition-all ${type === 'DI' ? 'bg-green-100 border-green-500 text-green-800' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="font-bold">Dihybridisme</div>
                        <div className="text-xs opacity-70">2 caractères (+ Forme)</div>
                    </button>
                    <button onClick={() => {setType('TRI'); reset()}} className={`w-full text-left p-3 rounded-lg border transition-all ${type === 'TRI' ? 'bg-green-100 border-green-500 text-green-800' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="font-bold">Trishybridisme</div>
                        <div className="text-xs opacity-70">3 caractères (+ Fleur)</div>
                    </button>
                </div>
            </div>

            {/* Étapes de simulation (Correction HTML ici pour éviter l'erreur) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Générations</h3>
                
                <div className={`relative pl-4 border-l-2 ${generation === 'P' ? 'border-green-500' : 'border-gray-300'} pb-6`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${generation === 'P' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    {/* Utilisation de div au lieu de p pour englober du texte + bouton, plus sûr */}
                    <div className="font-bold text-sm">Génération P</div>
                    <div className="text-xs text-gray-500 mb-2">Lignée Pure</div>
                    {generation === 'P' && <button onClick={() => runSimulation('F1')} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">Croiser vers F1</button>}
                </div>

                <div className={`relative pl-4 border-l-2 ${generation === 'F1' ? 'border-green-500' : 'border-gray-300'} pb-6`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${generation === 'F1' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="font-bold text-sm">Génération F1</div>
                    <div className="text-xs text-gray-500 mb-2">100% Hybrides</div>
                    {generation === 'F1' && <button onClick={() => runSimulation('F2')} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">Autofécondation vers F2</button>}
                </div>

                <div className={`relative pl-4 border-l-2 ${generation === 'F2' ? 'border-green-500' : 'border-gray-300'}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${generation === 'F2' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="font-bold text-sm">Génération F2</div>
                    <div className="text-xs text-gray-500 mb-2">Disjonction</div>
                    {generation === 'F2' && <button onClick={reset} className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300 transition-colors">Recommencer</button>}
                </div>
            </div>
        </div>

        {/* --- VISUALISATION 3D (CENTRE) --- */}
        <div className="lg:col-span-3 flex flex-col gap-6">
            
            <div className="h-[500px] bg-gradient-to-b from-sky-200 to-green-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-inner relative border-2 border-white dark:border-gray-700">
                
                {/* Indication pour l'élève */}
                <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                    <Info size={14}/> Cliquez sur un pois pour voir ses allèles
                </div>

                <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
                    {/* Lumières manuelles */}
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
                    <pointLight position={[-10, 5, -10]} intensity={0.5} />

                    <Center top>
                        {/* Parents (Non cliquables pour simplifier, ou index spéciaux) */}
                        {generation === 'P' && (
                            <>
                                <MendelPea color="YELLOW" shape="ROUND" flower="PURPLE" position={[-2, 0, 0]} onClick={()=>{}} isSelected={false} />
                                <MendelPea color="GREEN" shape="WRINKLED" flower="WHITE" position={[2, 0, 0]} onClick={()=>{}} isSelected={false} />
                                <Html position={[0, 1, 0]} center><div className="text-2xl font-bold bg-white/50 px-2 rounded">X</div></Html>
                            </>
                        )}

                        {/* Population F1/F2 */}
                        {(generation === 'F1' || generation === 'F2') && data?.offspring.map((pea, i) => {
                            const row = Math.floor(i / 8);
                            const col = i % 8;
                            return (
                                <MendelPea 
                                    key={i} 
                                    color={pea.color} 
                                    shape={pea.shape} 
                                    flower={pea.flower}
                                    position={[(col - 3.5) * 1.5, 0, (row - 2) * 1.5]}
                                    // GESTION DU CLIC
                                    onClick={() => setSelectedPeaIndex(i === selectedPeaIndex ? null : i)}
                                    isSelected={i === selectedPeaIndex}
                                />
                            );
                        })}
                    </Center>

                    <OrbitControls autoRotate={generation === 'P'} />
                </Canvas>

                {loading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                )}
            </div>

            {/* STATISTIQUES F2 */}
            {generation === 'F2' && data?.stats && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <BarChart3 className="text-blue-600"/> Résultats Statistiques (Théoriques)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(data.stats).map(([key, val]) => (
                            <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center border border-gray-100 dark:border-gray-600">
                                <div className="text-2xl font-black text-green-600 dark:text-green-400">{val}%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{key}</div>
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