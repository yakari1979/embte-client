"use client";
import React, { useState } from 'react';
import BloodType3D from '@/components/simulations/BloodType3D';
import { simulateHeredity, HeredityResult } from '@/services/api';
import Cookies from 'js-cookie';
import { Dna, ArrowRight, User } from 'lucide-react';

export default function HeredityPage() {
    // État pour les génotypes des parents
    const [father, setFather] = useState({ allele1: 'A', allele2: 'O', rh: '+' });
    const [mother, setMother] = useState({ allele1: 'B', allele2: 'O', rh: '-' });
    
    const [result, setResult] = useState<HeredityResult | null>(null);

    const calculate = async () => {
        const token = Cookies.get('token');
        if(!token) return;
        
        const payload = {
            fatherGenotype: { alleles: [father.allele1, father.allele2], rh: father.rh },
            motherGenotype: { alleles: [mother.allele1, mother.allele2], rh: mother.rh }
        };

        const res = await simulateHeredity(payload, token);
        setResult(res.data);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="mb-8">
                <h1 className="text-3xl font-bold flex gap-3 items-center text-gray-900 dark:text-white">
                    <Dna className="text-red-600" size={32} /> 
                    Hérédité : Groupes Sanguins
                </h1>
                <p className="text-gray-500 mt-2">Comprendre la transmission des allèles (A, B, O) et l'expression des antigènes.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* CONFIGURATION GÉNÉTIQUE */}
                <div className="space-y-6">
                    {/* PÈRE */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-200 dark:border-blue-900">
                        <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2"><User/> Génotype Père</h3>
                        <div className="flex gap-2 mb-4">
                            <select className="p-2 border rounded" value={father.allele1} onChange={e=>setFather({...father, allele1: e.target.value})}>
                                <option value="A">Allèle A</option><option value="B">Allèle B</option><option value="O">Allèle O</option>
                            </select>
                            <select className="p-2 border rounded" value={father.allele2} onChange={e=>setFather({...father, allele2: e.target.value})}>
                                <option value="A">Allèle A</option><option value="B">Allèle B</option><option value="O">Allèle O</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm">Rhésus :</span>
                            <div className="flex gap-2">
                                <button onClick={()=>setFather({...father, rh: '+'})} className={`px-3 py-1 rounded border ${father.rh === '+' ? 'bg-blue-600 text-white' : ''}`}>+</button>
                                <button onClick={()=>setFather({...father, rh: '-'})} className={`px-3 py-1 rounded border ${father.rh === '-' ? 'bg-blue-600 text-white' : ''}`}>-</button>
                            </div>
                        </div>
                    </div>

                    {/* MÈRE */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-pink-200 dark:border-pink-900">
                        <h3 className="font-bold text-pink-700 dark:text-pink-300 mb-4 flex items-center gap-2"><User/> Génotype Mère</h3>
                        <div className="flex gap-2 mb-4">
                            <select className="p-2 border rounded" value={mother.allele1} onChange={e=>setMother({...mother, allele1: e.target.value})}>
                                <option value="A">Allèle A</option><option value="B">Allèle B</option><option value="O">Allèle O</option>
                            </select>
                            <select className="p-2 border rounded" value={mother.allele2} onChange={e=>setMother({...mother, allele2: e.target.value})}>
                                <option value="A">Allèle A</option><option value="B">Allèle B</option><option value="O">Allèle O</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm">Rhésus :</span>
                            <div className="flex gap-2">
                                <button onClick={()=>setMother({...mother, rh: '+'})} className={`px-3 py-1 rounded border ${mother.rh === '+' ? 'bg-pink-600 text-white' : ''}`}>+</button>
                                <button onClick={()=>setMother({...mother, rh: '-'})} className={`px-3 py-1 rounded border ${mother.rh === '-' ? 'bg-pink-600 text-white' : ''}`}>-</button>
                            </div>
                        </div>
                    </div>

                    <button onClick={calculate} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                        Croisement (Probabilité)
                    </button>
                </div>

                {/* RÉSULTAT */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Visualisation 3D */}
                    <div className="bg-white rounded-xl shadow-inner border h-[400px] relative overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 space-y-1 text-xs font-bold text-gray-500">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 clip-triangle"></div> Antigène A</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Antigène B</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500"></div> Facteur Rhésus</div>
                        </div>
                        <BloodType3D data={result} />
                    </div>

                    {/* Explication */}
                    {result && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-red-500 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div>
                                    <div className="text-sm text-gray-500">Phénotype Enfant</div>
                                    <div className="text-4xl font-black text-red-600">Groupe {result.childPhenotype}</div>
                                </div>
                                <ArrowRight className="text-gray-300" size={32}/>
                                <div>
                                    <div className="text-sm text-gray-500">Génotype</div>
                                    <div className="text-2xl font-mono text-gray-800 dark:text-white">{result.childGenotype}</div>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{result.message}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}