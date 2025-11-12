"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getQuantumSimulationImage, getPhysicsSimulationImage, getRLCSimulationImage, getLensSimulationImage, getDecaySimulationImage, getTitrationSimulationImage,getLeChatelierSimulationImage,getDaniellCellSimulationImages, getKineticsSimulationImage, getTimeDilationSimulation, getGeneticsSimulation, getEcologySimulation, getTranscriptionSimulation, getContinentalDriftData, getEnzymeKineticsSimulation, getFaradaySimulationImage } from '@/services/api';
import { Loader2, Beaker, ChevronsRight, Target, Atom, Zap, Eye, Radiation, FlaskConical,Scale, BatteryCharging, Timer, Hourglass, Leaf, PawPrint, Dna, Globe, Activity, Magnet } from 'lucide-react';
import { useDebounce } from 'use-debounce';

// Le type SimulationResult reste inchangé
// type SimulationResult = { title: string; dataUrl: string; result?: string; };

type SimulationResult = {
    title: string;
    result?: string;
    
    // On rend les propriétés optionnelles avec '?'
    dataUrl?: string; 
    schemaUrl?: string;
    graphUrl?: string;
    
    // 'data' peut être n'importe quel type d'objet. On le vérifiera plus tard.
    data?: any; 
    // --- NOUVEAU ---
    punnettSquare?: { parent1: string[], parent2: string[] };
    resultsImageUrl?: string;
};


// Définition des types pour les props de nos composants
interface TranscriptionData {
    dna_template_strand: string;
    dna_coding_strand: string;
    mrna_strand: string;
}

interface TranscriptionViewerProps {
    data: TranscriptionData;
}

interface BaseProps {
    base: string;
    color: string;
}


const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ data }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= data.mrna_strand.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 200);
        return () => clearInterval(interval);
    }, [data]);

    const Base: React.FC<BaseProps> = ({ base, color }) => (
        <div className={`w-8 h-8 flex items-center justify-center font-bold text-white rounded ${color}`}>
            {base}
        </div>
    );

    const baseColors: { [key: string]: string } = { 'A': 'bg-green-500', 'T': 'bg-red-500', 'C': 'bg-blue-500', 'G': 'bg-yellow-500', 'U': 'bg-orange-500' };

    return (
        <div className="font-mono text-center space-y-4 p-4 bg-gray-800 text-white rounded-lg">
            <div>
                <p className="text-sm mb-1">Brin codant (5' → 3')</p>
                <div className="flex gap-1 justify-center">
                    {data.dna_coding_strand.split('').map((base, i) => <Base key={i} base={base} color={baseColors[base]} />)}
                </div>
            </div>
            <div>
                <p className="text-sm mb-1">Brin transcrit (3' → 5')</p>
                <div className="flex gap-1 justify-center">
                    {data.dna_template_strand.split('').map((base, i) => <Base key={i} base={base} color={baseColors[base]} />)}
                </div>
            </div>
            <div className="border-t border-gray-600 pt-4">
                 <p className="text-sm mb-1">ARNm en cours de synthèse (5' → 3')</p>
                 <div className="flex gap-1 justify-center h-8">
                    {data.mrna_strand.split('').slice(0, progress).map((base, i) => <Base key={i} base={base} color={baseColors[base]} />)}
                </div>
            </div>
        </div>
    );
};


// Les types restent les mêmes
interface Coords { x: number; y: number; }
interface ContinentalDriftData { pangea: Record<string, Coords>; present: Record<string, Coords>; }
interface ContinentalDriftViewerProps { data: ContinentalDriftData; }

const ContinentalDriftViewer: React.FC<ContinentalDriftViewerProps> = ({ data }) => {
    const [time, setTime] = useState(0); // 0 = present, 100 = pangea

    const interpolate = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const continents = Object.keys(data.present);
    
    return (
        <div className="w-full text-center flex flex-col items-center">
            {/* --- NOUVEAU : Le Globe --- */}
            <div 
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full shadow-2xl overflow-hidden mb-6"
                // Ce dégradé radial simule l'éclairage sur une sphère
                style={{ background: 'radial-gradient(circle at 30% 30%, #87CEEB, #0077BE)' }}
            >
                {/* Une ombre intérieure pour donner un effet 3D */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"></div>

                {continents.map(continent => {
                    const startPos = data.pangea[continent];
                    const endPos = data.present[continent];
                    const x = interpolate(endPos.x, startPos.x, time / 100);
                    const y = interpolate(endPos.y, startPos.y, time / 100);

                    return (
                        <div 
                            key={continent} 
                            className="absolute bg-yellow-600/80 border-2 border-yellow-800/60 rounded-md p-1 text-xs text-white font-bold shadow-md flex items-center justify-center"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)',
                                transition: 'left 0.5s ease-out, top 0.5s ease-out'
                            }}
                        >
                            {continent.substring(0,2).toUpperCase()}
                        </div>
                    );
                })}
            </div>

            {/* Le slider de contrôle (inchangé, juste un peu plus large) */}
            <div className="w-full max-w-md">
                <label className="block text-sm font-medium">Remonter le temps</label>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs font-bold text-text-secondary">
                    <span>Aujourd'hui</span>
                    <span>- {Math.round(time * 3)} Millions d'années</span>
                    <span>Pangée</span>
                </div>
            </div>
        </div>
    );
};


const PhysicsLabPage = () => {
    const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    
    // --- NOUVEAU : State pour gérer l'onglet actif ---
    const [activeTab, setActiveTab] = useState<'physics' | 'chemistry'| 'svt'| 'geology'>('physics');

    // States pour chaque simulation (inchangés)
    const [projectileParams, setProjectileParams] = useState({ velocity: 50, angle: 45 });
    const [rlcParams, setRlcParams] = useState({ R: 10, L: 100, C: 100 });
    const [lensParams, setLensParams] = useState({ focalLength: 10, objectDistance: 15 });
    const [decayParams, setDecayParams] = useState({ initialNuclei: 10000, halfLife: 5 });
    const [titrationParams, setTitrationParams] = useState({ Ca: 0.1, Va: 20, Cb: 0.1 });
    const [kineticsParams, setKineticsParams] = useState({ initialConcentration: 1.0, temperature: 25 });
    const [timeDilationParams, setTimeDilationParams] = useState({ properTime: 10, percentageOfC: 90 });
    const [geneticsParams, setGeneticsParams] = useState({ parent1: 'Jv', parent2: 'Jv', offspringCount: 100 });
    const [ecologyParams, setEcologyParams] = useState({ initialPrey: 40, initialPredators: 9 });
    const [faradayParams, setFaradayParams] = useState({ position: 1.0, velocity: 0 }); 
    const [debouncedFaradayParams] = useDebounce(faradayParams, 50);
    const [measurementStep, setMeasurementStep] = useState<'initial' | 'superposition_ready' | 'measured'>('initial');


    // Fonction générique pour gérer le chargement et les erreurs
    const runSimulation = async (
        simulationFn: () => Promise<any>,
        simId: string,
        title: string,
        onSuccess: (response: any) => void
    ) => {
        setActiveSimulation(simId);
        setError(null);
        setSimulationResult(null); // On nettoie l'ancien résultat au début

        try {
            const response = await simulationFn();
            onSuccess(response);
        } catch (err) {
            setError("Le service de simulation a rencontré une erreur. Veuillez réessayer plus tard.");
        } finally {
            setActiveSimulation(null);
        }
    };


    // const handleProjectileSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getPhysicsSimulationImage(projectileParams, token),
    //         'projectile',
    //         `Trajectoire pour v₀=${projectileParams.velocity}m/s et θ=${projectileParams.angle}°`,
    //         (response) => {
    //             setSimulationResult({ title: `Trajectoire pour v₀=${projectileParams.velocity}m/s et θ=${projectileParams.angle}°`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };

    // const startMeasurementExperiment = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     setMeasurementStep('initial');
    //     runSimulation(
    //         () => getQuantumSimulationImage('superposition-bloch', token),
    //         'superposition-bloch',
    //         'Étape 1 : Qubit en Superposition',
    //         (response) => {
    //             setSimulationResult({ title: 'Étape 1 : Qubit en Superposition', dataUrl: response.data.dataUrl });
    //             setMeasurementStep('superposition_ready');
    //         }
    //     );
    // };

    // const performMeasurement = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getQuantumSimulationImage('measurement', token),
    //         'measurement',
    //         'Étape 2 : Résultat de la Mesure',
    //         (response) => {
    //             setSimulationResult({
    //                 title: 'Étape 2 : Résultat de la Mesure',
    //                 dataUrl: response.data.dataUrl,
    //                 result: response.data.result
    //             });
    //             setMeasurementStep('measured');
    //         }
    //     );
    // };
    
    // const handleEntanglementSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     setMeasurementStep('initial');
    //     runSimulation(
    //         () => getQuantumSimulationImage('entanglement-histogram', token),
    //         'entanglement',
    //         'Résultat de Mesure de Qubits Intriqués',
    //         (response) => {
    //              setSimulationResult({ title: 'Résultat de Mesure de Qubits Intriqués', dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };

    // // --- NOUVELLE FONCTION ---
    // const handleRLCSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getRLCSimulationImage(rlcParams, token),
    //         'rlc',
    //         'Courbe de Résonance RLC',
    //         (response) => {
    //             setSimulationResult({ title: `Courbe de Résonance RLC`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };

    // // --- NOUVELLE FONCTION ---
    // const handleLensSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getLensSimulationImage(lensParams, token),
    //         'lens',
    //         'Lentille Convergente',
    //         (response) => {
    //             setSimulationResult({ title: `Lentille Convergente`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };

    // // --- NOUVELLE FONCTION ---
    // const handleDecaySimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getDecaySimulationImage(decayParams, token),
    //         'decay',
    //         'Décroissance Radioactive',
    //         (response) => {
    //             setSimulationResult({ title: `Décroissance Radioactive`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };

    // // --- NOUVELLE FONCTION ---
    // const handleTitrationSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getTitrationSimulationImage(titrationParams, token),
    //         'titration',
    //         'Dosage Acide-Base',
    //         (response) => {
    //             setSimulationResult({ title: `Dosage Acide-Base`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };


    // // --- NOUVELLE FONCTION ---
    // const handleLeChatelierSimulation = (perturbation: 'add_N2' | 'add_NH3') => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     const simId = `le-chatelier-${perturbation}`;
    //     runSimulation(
    //         () => getLeChatelierSimulationImage({ perturbation }, token),
    //         simId,
    //         'add_N2',
    //         (response) => {
    //             const title = perturbation === 'add_N2' ? "Perturbation : Ajout d'un réactif (N₂)" : "Perturbation : Ajout d'un produit (NH₃)";
    //             setSimulationResult({ title, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };


    // // --- NOUVELLE FONCTION ---
    // const handleDaniellCellSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     // Cette simulation renvoie deux images, donc nous la traitons un peu différemment
    //     setActiveSimulation('daniell-cell');
    //     setError(null);
    //     setSimulationResult(null);
    //     getDaniellCellSimulationImages(token)
    //         .then(response => {
    //             // On stocke les deux URLs dans un seul objet de résultat
    //             setSimulationResult({
    //                 title: 'Simulation de la Pile Daniell (Zn-Cu)',
    //                 schemaUrl: response.data.schemaUrl, // URL de l'image 1
    //                 graphUrl: response.data.graphUrl     // URL de l'image 2
    //             });
    //         })
    //         .catch(err => {
    //             setError("Le service de simulation a rencontré une erreur.");
    //         })
    //         .finally(() => {
    //             setActiveSimulation(null);
    //         });
    // };


    // // --- NOUVELLE FONCTION ---
    // const handleKineticsSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getKineticsSimulationImage(kineticsParams, token),
    //         'kinetics',
    //         'Cinétique Chimique',
    //         (response) => {
    //             setSimulationResult({ title: `Cinétique Chimique`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };



    const handleProjectileSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getPhysicsSimulationImage(projectileParams, token),
            'projectile',
            `Trajectoire pour v₀=${projectileParams.velocity}m/s et θ=${projectileParams.angle}°`,
            (response) => {
                // MISE À JOUR : On construit le dataUrl ici
                setSimulationResult({ 
                    title: `Trajectoire pour v₀=${projectileParams.velocity}m/s et θ=${projectileParams.angle}°`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    const startMeasurementExperiment = () => {
        const token = Cookies.get('token');
        if (!token) return;
        setMeasurementStep('initial');
        runSimulation(
            () => getQuantumSimulationImage('superposition-bloch', token),
            'superposition-bloch',
            'Étape 1 : Qubit en Superposition',
            (response) => {
                 // MISE À JOUR
                setSimulationResult({ 
                    title: 'Étape 1 : Qubit en Superposition', 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
                setMeasurementStep('superposition_ready');
            }
        );
    };

    const performMeasurement = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getQuantumSimulationImage('measurement', token),
            'measurement',
            'Étape 2 : Résultat de la Mesure',
            (response) => {
                // MISE À JOUR
                setSimulationResult({
                    title: 'Étape 2 : Résultat de la Mesure',
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}`,
                    result: response.data.classical_result // Cette clé vient directement de Python
                });
                setMeasurementStep('measured');
            }
        );
    };
    
    const handleEntanglementSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        setMeasurementStep('initial');
        runSimulation(
            () => getQuantumSimulationImage('entanglement-histogram', token),
            'entanglement',
            'Résultat de Mesure de Qubits Intriqués',
            (response) => {
                 // MISE À JOUR
                 setSimulationResult({ 
                     title: 'Résultat de Mesure de Qubits Intriqués', 
                     dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                 });
            }
        );
    };

    const handleRLCSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getRLCSimulationImage(rlcParams, token),
            'rlc', 'Courbe de Résonance RLC',
            (response) => {
                // MISE À JOUR
                setSimulationResult({ 
                    title: `Courbe de Résonance RLC`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    const handleLensSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getLensSimulationImage(lensParams, token),
            'lens', 'Lentille Convergente',
            (response) => {
                // MISE À JOUR
                setSimulationResult({ 
                    title: `Lentille Convergente`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    const handleDecaySimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getDecaySimulationImage(decayParams, token),
            'decay', 'Décroissance Radioactive',
            (response) => {
                // MISE À JOUR
                setSimulationResult({ 
                    title: `Décroissance Radioactive`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };
    
    const handleTitrationSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getTitrationSimulationImage(titrationParams, token),
            'titration', 'Dosage Acide-Base',
            (response) => {
                // MISE À JOUR
                setSimulationResult({ 
                    title: `Dosage Acide-Base`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    const handleLeChatelierSimulation = (perturbation: 'add_N2' | 'add_NH3') => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getLeChatelierSimulationImage({ perturbation }, token),
            `le-chatelier-${perturbation}`, 'Principe de Le Chatelier',
            (response) => {
                const title = perturbation === 'add_N2' ? "Perturbation : Ajout d'un réactif (N₂)" : "Perturbation : Ajout d'un produit (NH₃)";
                // MISE À JOUR
                setSimulationResult({ 
                    title, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    const handleDaniellCellSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        setActiveSimulation('daniell-cell');
        // ... (le reste de cette fonction est correct, mais on met à jour le .then)
        getDaniellCellSimulationImages(token)
            .then(response => {
                // MISE À JOUR
                setSimulationResult({
                    title: 'Simulation de la Pile Daniell (Zn-Cu)',
                    schemaUrl: `data:image/png;base64,${response.data.schemaImageBase64}`,
                    graphUrl: `data:image/png;base64,${response.data.graphImageBase64}`
                });
            })
            .catch(err => {
                setError("Le service de simulation a rencontré une erreur.");
            })
            .finally(() => {
                setActiveSimulation(null);
            });
    };

    const handleKineticsSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getKineticsSimulationImage(kineticsParams, token),
            'kinetics', 'Cinétique Chimique',
            (response) => {
                // MISE À JOUR
                setSimulationResult({ 
                    title: `Cinétique Chimique`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    // --- NOUVELLE FONCTION ---
    const handleTimeDilationSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getTimeDilationSimulation(timeDilationParams, token),
            'time-dilation',
            '`Dilatation du Temps',
            (response) => {
                setSimulationResult({
                    title: `Dilatation du Temps à ${timeDilationParams.percentageOfC}% de c`,
                    data: response.data // On stocke les données numériques
                });
            }
        );
    };

    // // --- NOUVELLE FONCTION ---
    // const handleGeneticsSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getGeneticsSimulation(geneticsParams, token),
    //         'genetics',
    //         'Résultats du Croisement',
    //         (response) => {
    //             setSimulationResult({
    //                 title: `Résultats du Croisement`,
    //                 punnettSquare: response.data.punnettSquare,
    //                 resultsImageUrl: response.data.resultsImageUrl
    //             });
    //         }
    //     );
    // };

    // // --- NOUVELLE FONCTION ---
    // const handleEcologySimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getEcologySimulation(ecologyParams, token),
    //         'ecology',
    //         'Évolution Écosystème',
    //         (response) => {
    //             setSimulationResult({ title: `Évolution d'un Écosystème`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };


    const handleGeneticsSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getGeneticsSimulation(geneticsParams, token),
            'genetics', 'Résultats du Croisement',
            (response) => {
                // MISE À JOUR
                setSimulationResult({
                    title: `Résultats du Croisement`,
                    punnettSquare: response.data.punnett_square,
                    resultsImageUrl: `data:image/png;base64,${response.data.results_image_base64}`
                });
            }
        );
    };

    const handleEcologySimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getEcologySimulation(ecologyParams, token),
            'ecology', 'Évolution Écosystème',
            (response) => {
                // MISE À JOUR
                setSimulationResult({ 
                    title: `Évolution d'un Écosystème`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    const handleEnzymeSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getEnzymeKineticsSimulation(token),
            'enzyme', 'Cinétique Enzymatique',
            (response) => {
                // MISE À JOUR
                setSimulationResult({ 
                    title: `Cinétique Enzymatique`, 
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}` 
                });
            }
        );
    };

    // --- NOUVELLE FONCTION ---
    const handleTranscriptionSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getTranscriptionSimulation(token),
            'transcription',
            'Biologie Moléculaire',
            (response) => {
                setSimulationResult({
                    title: `Biologie Moléculaire : Transcription de l'ADN`,
                    data: response.data // On stocke les séquences ici
                });
            }
        );
    };

     // --- NOUVELLE FONCTION ---
    const handleDriftSimulation = () => {
        const token = Cookies.get('token');
        if (!token) return;
        runSimulation(
            () => getContinentalDriftData(token),
            'drift',
            'Tectonique des Plaques : Dérive des Continents',
            (response) => {
                setSimulationResult({
                    title: `Tectonique des Plaques : Dérive des Continents`,
                    data: response.data // On stocke les coordonnées
                });
            }
        );
    }; 

    // // --- NOUVELLE FONCTION ---
    // const handleEnzymeSimulation = () => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     runSimulation(
    //         () => getEnzymeKineticsSimulation(token),
    //         'enzyme',
    //         'Cinétique Enzymatique',
    //         (response) => {
    //             setSimulationResult({ title: `Cinétique Enzymatique`, dataUrl: response.data.dataUrl });
    //         }
    //     );
    // };


    // // --- NOUVELLE FONCTION ---
    // const handleFaradaySimulation = useCallback((params: { position: any; velocity: any; }) => {
    //     const token = Cookies.get('token');
    //     if (!token) return;
    //     // Pas d'indicateur de chargement global pour ne pas figer l'UI
    //     getFaradaySimulationImage({ magnetPosition: params.position, magnetVelocity: params.velocity }, token)
    //         .then((response) => {
    //             setSimulationResult({
    //                 title: "Induction Électromagnétique",
    //                 dataUrl: response.data.dataUrl
    //             });
    //         })
    //         .catch(err => {
    //             // On peut ignorer les petites erreurs réseau pour la fluidité
    //             console.error(err);
    //         });
    // }, []);


    const handleFaradaySimulation = useCallback((params: { position: any; velocity: any; }) => {
        const token = Cookies.get('token');
        if (!token) return;
        getFaradaySimulationImage({ magnetPosition: params.position, magnetVelocity: params.velocity }, token)
            .then((response) => {
                // MISE À JOUR
                setSimulationResult({
                    title: "Induction Électromagnétique",
                    dataUrl: `data:image/png;base64,${response.data.imageBase64}`
                });
            })
            .catch(err => {
                // On peut ignorer les petites erreurs réseau pour la fluidité
                console.error(err);
            });
    }, []);

    useEffect(() => {
        // Appelle la simulation à chaque fois que les paramètres "débouncés" changent
        if (activeTab === 'physics') {
            handleFaradaySimulation(debouncedFaradayParams);
        }
    }, [debouncedFaradayParams, activeTab, handleFaradaySimulation]);

    const handleMagnetSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPosition = Number(e.target.value);
        setFaradayParams(prev => ({
            position: newPosition,
            velocity: newPosition - prev.position // Calcul simple de la vitesse
        }));
    };

    

    function sorted(arg0: string): any {
        throw new Error('Function not implemented.');
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* En-tête de la page (inchangé) */}
            <div className="flex items-center gap-4 mb-6">
                <Beaker className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Laboratoire Virtuel</h1>
                    <p className="text-text-secondary">Explorez les concepts du programme par la simulation interactive.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- COLONNE DE GAUCHE : PANNEAU DE CONTRÔLE AVEC ONGLETS --- */}
                <div className="bg-surface rounded-lg shadow-md">
                    {/* --- NOUVEAU : Barre d'onglets --- */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex gap-4 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('physics')}
                                className={`shrink-0 border-b-2 py-4 px-1 text-lg font-medium ${
                                    activeTab === 'physics'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-text-secondary hover:border-gray-300 hover:text-text-primary'
                                }`}
                            >
                                Physique
                            </button>
                            <button
                                onClick={() => setActiveTab('chemistry')}
                                className={`shrink-0 border-b-2 py-4 px-1 text-lg font-medium ${
                                    activeTab === 'chemistry'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-text-secondary hover:border-gray-300 hover:text-text-primary'
                                }`}
                            >
                                Chimie
                            </button>
                            {/* --- NOUVEAU BOUTON D'ONGLET --- */}
                            <button
                                onClick={() => setActiveTab('svt')}
                                className={`shrink-0 border-b-2 py-4 px-1 text-lg font-medium ${
                                    activeTab === 'svt' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'
                                }`}
                            >
                                SVT
                            </button>

                            {/* --- NOUVEL ONGLET --- */}
                            <button
                                onClick={() => setActiveTab('geology')}
                                className={`shrink-0 border-b-2 py-4 px-1 text-lg font-medium ${
                                    activeTab === 'geology' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:border-gray-300'
                                }`}
                            >
                                Géologie
                            </button>
                        </nav>
                    </div>

                    {/* --- Contenu des onglets --- */}
                    <div className="p-6 space-y-8">
                        {/* --- AFFICHE LE CONTENU DE L'ONGLET PHYSIQUE --- */}
                        {activeTab === 'physics' && (
                            <>
                                {/* Section Mécanique */}
                                <SimulationSection icon={<Target />} title="Mécanique Classique">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Mouvement d'un Projectile</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Vitesse initiale ({projectileParams.velocity} m/s)</label>
                                            <input type="range" name="velocity" min="10" max="100" value={projectileParams.velocity} onChange={(e) => setProjectileParams(p => ({...p, velocity: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Angle de tir ({projectileParams.angle}°)</label>
                                            <input type="range" name="angle" min="0" max="90" value={projectileParams.angle} onChange={(e) => setProjectileParams(p => ({...p, angle: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <button onClick={handleProjectileSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'projectile' ? <Loader2 className="animate-spin mx-auto"/> : 'Lancer la Simulation'}
                                        </button>
                                    </div>
                                </SimulationSection>
                                
                                {/* Section Électricité */}
                                <SimulationSection icon={<Zap />} title="Électricité">
                                    <div>
                                        <div className="p-4 border rounded-lg space-y-4">
                                            <h3 className="font-bold">Circuit RLC Série : Résonance</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary">Résistance R ({rlcParams.R} Ω)</label>
                                                <input type="range" name="R" min="1" max="100" value={rlcParams.R} onChange={(e) => setRlcParams(p => ({...p, R: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary">Inductance L ({rlcParams.L} mH)</label>
                                                <input type="range" name="L" min="10" max="1000" step="10" value={rlcParams.L} onChange={(e) => setRlcParams(p => ({...p, L: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary">Capacité C ({rlcParams.C} µF)</label>
                                                <input type="range" name="C" min="10" max="1000" step="10" value={rlcParams.C} onChange={(e) => setRlcParams(p => ({...p, C: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                            </div>
                                            <button onClick={handleRLCSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                                {activeSimulation === 'rlc' ? <Loader2 className="animate-spin mx-auto"/> : 'Simuler la Résonance'}
                                            </button>
                                        </div>
                                    </div>
                                </SimulationSection>
                                
                                {/* Section Optique */}
                                <SimulationSection icon={<Eye />} title="Optique Géométrique">
                                    <div>
                                        <div className="p-4 border rounded-lg space-y-4">
                                            <h3 className="font-bold">Lentille Convergente</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary">Distance Focale (f') ({lensParams.focalLength} cm)</label>
                                                <input type="range" name="focalLength" min="5" max="20" value={lensParams.focalLength} onChange={(e) => setLensParams(p => ({...p, focalLength: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary">Distance Objet (p) ({lensParams.objectDistance} cm)</label>
                                                <input type="range" name="objectDistance" min="1" max="40" value={lensParams.objectDistance} onChange={(e) => setLensParams(p => ({...p, objectDistance: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                            </div>
                                            <button onClick={handleLensSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                                {activeSimulation === 'lens' ? <Loader2 className="animate-spin mx-auto"/> : 'Tracer les Rayons'}
                                            </button>
                                        </div>
                                    </div>
                                </SimulationSection>
                                
                                {/* Section Physique Nucléaire */}
                                <SimulationSection icon={<Radiation />} title="Physique Nucléaire">
                                    <div>
                                        <div className="p-4 border rounded-lg space-y-4">
                                            <h3 className="font-bold">Décroissance Radioactive</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary">Nombre de noyaux (N₀) ({decayParams.initialNuclei})</label>
                                                <input type="range" name="initialNuclei" min="1000" max="20000" step="1000" value={decayParams.initialNuclei} onChange={(e) => setDecayParams(p => ({...p, initialNuclei: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary">Période / Demi-vie (T½) ({decayParams.halfLife} s)</label>
                                                <input type="range" name="halfLife" min="1" max="20" value={decayParams.halfLife} onChange={(e) => setDecayParams(p => ({...p, halfLife: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                            </div>
                                            <button onClick={handleDecaySimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                                {activeSimulation === 'decay' ? <Loader2 className="animate-spin mx-auto"/> : 'Simuler la Décroissance'}
                                            </button>
                                        </div>
                                    </div>
                                </SimulationSection>

                                {/* --- NOUVELLE SECTION : PHYSIQUE MODERNE --- */}
                                <SimulationSection icon={<Hourglass />} title="Physique Moderne">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Relativité : Dilatation du Temps</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Temps pour le voyageur ({timeDilationParams.properTime} ans)</label>
                                            <input type="range" name="properTime" min="1" max="100" value={timeDilationParams.properTime} onChange={(e) => setTimeDilationParams(p => ({...p, properTime: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Vitesse du voyageur ({timeDilationParams.percentageOfC} % de c)</label>
                                            <input type="range" name="percentageOfC" min="0" max="99.9" step="0.1" value={timeDilationParams.percentageOfC} onChange={(e) => setTimeDilationParams(p => ({...p, percentageOfC: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <button onClick={handleTimeDilationSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'time-dilation' ? <Loader2 className="animate-spin mx-auto"/> : 'Calculer le Temps sur Terre'}
                                        </button>
                                    </div>
                                </SimulationSection>

                                {/* --- NOUVELLE SIMULATION --- */}
                                <SimulationSection icon={<Magnet />} title="Électromagnétisme">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Loi de Faraday</h3>
                                        <p className="text-sm text-text-secondary">Déplacez l'aimant avec le slider pour induire un courant dans la bobine.</p>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Position de l'aimant</label>
                                            <input type="range" min="1" max="9" step="0.1" value={faradayParams.position} onChange={handleMagnetSliderChange} className="w-full h-2 bg-gray-200 rounded-lg" />
                                            <div className="flex justify-between text-xs"><span>Loin</span><span>Près</span></div>
                                        </div>
                                    </div>
                                </SimulationSection>

                                {/* Section Physique Quantique */}
                                <SimulationSection icon={<Atom />} title="Physique Quantique">
                                    <div>
                                        <div className="p-4 border rounded-lg space-y-4">
                                            <h3 className="font-bold">Expérience : L'Effet de la Mesure</h3>
                                            <div className="flex items-center gap-2">
                                                <button onClick={startMeasurementExperiment} disabled={!!activeSimulation} className="btn-secondary flex-1">
                                                    {activeSimulation === 'superposition-bloch' ? <Loader2 className="animate-spin mx-auto"/> : '1. Préparer'}
                                                </button>
                                                <ChevronsRight className={`h-6 w-6 flex-shrink-0 ${measurementStep !== 'initial' ? 'text-primary' : 'text-gray-300'}`} />
                                                <button onClick={performMeasurement} disabled={measurementStep !== 'superposition_ready' || !!activeSimulation} className="btn-secondary flex-1">
                                                    {activeSimulation === 'measurement' ? <Loader2 className="animate-spin mx-auto"/> : '2. Mesurer'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 border rounded-lg space-y-4 mt-4">
                                            <h3 className="font-bold">Simulation : Intrication</h3>
                                            <button onClick={handleEntanglementSimulation} disabled={!!activeSimulation} className="btn-secondary w-full">
                                                {activeSimulation === 'entanglement' ? <Loader2 className="animate-spin mx-auto"/> : 'Voir l\'Histogramme'}
                                            </button>
                                        </div>
                                    </div>
                                </SimulationSection>
                            </>
                        )}
                        
                        {/* --- AFFICHE LE CONTENU DE L'ONGLET CHIMIE --- */}
                        {activeTab === 'chemistry' && (

                            <>
                                <SimulationSection icon={<FlaskConical />} title="Chimie des Solutions">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Dosage Acido-Basique</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Concentration Acide (Ca) ({titrationParams.Ca} mol/L)</label>
                                            <input type="range" name="Ca" min="0.01" max="1" step="0.01" value={titrationParams.Ca} onChange={(e) => setTitrationParams(p => ({...p, Ca: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Volume Acide (Va) ({titrationParams.Va} mL)</label>
                                            <input type="range" name="Va" min="5" max="50" value={titrationParams.Va} onChange={(e) => setTitrationParams(p => ({...p, Va: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Concentration Base (Cb) ({titrationParams.Cb} mol/L)</label>
                                            <input type="range" name="Cb" min="0.01" max="1" step="0.01" value={titrationParams.Cb} onChange={(e) => setTitrationParams(p => ({...p, Cb: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <button onClick={handleTitrationSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'titration' ? <Loader2 className="animate-spin mx-auto"/> : 'Simuler le Dosage'}
                                        </button>
                                    </div>
                                </SimulationSection>

                                {/* --- NOUVELLE SIMULATION --- */}
                                <SimulationSection icon={<Scale />} title="Équilibre Chimique">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Principe de Le Chatelier</h3>
                                        <p className="text-sm text-text-secondary">Observez comment le système N₂(g) + 3H₂(g) ⇌ 2NH₃(g) réagit à une perturbation.</p>
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => handleLeChatelierSimulation('add_N2')} disabled={!!activeSimulation} className="btn-secondary w-full">
                                                {activeSimulation === 'le-chatelier-add_N2' ? <Loader2 className="animate-spin mx-auto"/> : 'Perturber en ajoutant du N₂'}
                                            </button>
                                            <button onClick={() => handleLeChatelierSimulation('add_NH3')} disabled={!!activeSimulation} className="btn-secondary w-full">
                                                {activeSimulation === 'le-chatelier-add_NH3' ? <Loader2 className="animate-spin mx-auto"/> : 'Perturber en ajoutant du NH₃'}
                                            </button>
                                        </div>
                                    </div>
                                </SimulationSection>

                                {/* --- NOUVELLE SIMULATION --- */}
                                <SimulationSection icon={<BatteryCharging />} title="Oxydoréduction">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Pile Électrochimique (Daniell)</h3>
                                        <p className="text-sm text-text-secondary">Visualisez le fonctionnement d'une pile Zinc-Cuivre et l'évolution de sa tension.</p>
                                        <button onClick={handleDaniellCellSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'daniell-cell' ? <Loader2 className="animate-spin mx-auto"/> : 'Lancer la Simulation'}
                                        </button>
                                    </div>
                                </SimulationSection>

                                <SimulationSection icon={<Timer />} title="Cinétique Chimique">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Vitesse de Réaction</h3>
                                        <p className="text-sm text-text-secondary">Observez l'influence de la concentration et de la température sur la vitesse de la réaction A → B.</p>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Concentration Initiale [A]₀ ({kineticsParams.initialConcentration} mol/L)</label>
                                            <input type="range" name="initialConcentration" min="0.1" max="2.0" step="0.1" value={kineticsParams.initialConcentration} onChange={(e) => setKineticsParams(p => ({...p, initialConcentration: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary">Température ({kineticsParams.temperature} °C)</label>
                                            <input type="range" name="temperature" min="0" max="100" value={kineticsParams.temperature} onChange={(e) => setKineticsParams(p => ({...p, temperature: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                                        </div>
                                        <button onClick={handleKineticsSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'kinetics' ? <Loader2 className="animate-spin mx-auto"/> : 'Simuler la Vitesse'}
                                        </button>
                                    </div>
                                </SimulationSection>

                            </>

                            
                        )}

                        {/* --- NOUVEL ONGLET SVT --- */}
                        {activeTab === 'svt' && (
                            <>
                                <SimulationSection icon={<Leaf />} title="Génétique">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Lois de Mendel : Monohybridisme</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium">Parent 1 (J=Jaune, v=vert)</label>
                                                <select value={geneticsParams.parent1} onChange={(e) => setGeneticsParams(p => ({...p, parent1: e.target.value}))} className="input-field w-full">
                                                    <option value="JJ">JJ (Jaune pur)</option>
                                                    <option value="Jv">Jv (Jaune hybride)</option>
                                                    <option value="vv">vv (Vert pur)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium">Parent 2</label>
                                                <select value={geneticsParams.parent2} onChange={(e) => setGeneticsParams(p => ({...p, parent2: e.target.value}))} className="input-field w-full">
                                                    <option value="JJ">JJ (Jaune pur)</option>
                                                    <option value="Jv">Jv (Jaune hybride)</option>
                                                    <option value="vv">vv (Vert pur)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Nombre de descendants ({geneticsParams.offspringCount})</label>
                                            <input type="range" min="10" max="1000" step="10" value={geneticsParams.offspringCount} onChange={(e) => setGeneticsParams(p => ({...p, offspringCount: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg" />
                                        </div>
                                        <button onClick={handleGeneticsSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'genetics' ? <Loader2 className="animate-spin mx-auto"/> : 'Lancer le Croisement'}
                                        </button>
                                    </div>
                                </SimulationSection>

                                {/* --- NOUVELLE SIMULATION --- */}
                                <SimulationSection icon={<PawPrint />} title="Écologie">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Dynamique des Populations (Proie-Prédateur)</h3>
                                        <div>
                                            <label className="block text-sm font-medium">Population initiale de proies (lapins) ({ecologyParams.initialPrey})</label>
                                            <input type="range" min="10" max="200" value={ecologyParams.initialPrey} onChange={(e) => setEcologyParams(p => ({...p, initialPrey: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Population initiale de prédateurs (loups) ({ecologyParams.initialPredators})</label>
                                            <input type="range" min="5" max="50" value={ecologyParams.initialPredators} onChange={(e) => setEcologyParams(p => ({...p, initialPredators: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg" />
                                        </div>
                                        <button onClick={handleEcologySimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'ecology' ? <Loader2 className="animate-spin mx-auto"/> : 'Lancer la Simulation sur 100 ans'}
                                        </button>
                                    </div>
                                </SimulationSection>

                                {/* --- NOUVELLE SIMULATION --- */}
                                <SimulationSection icon={<Dna />} title="Biologie Moléculaire">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Transcription de l'ADN en ARNm</h3>
                                        <p className="text-sm text-text-secondary">Visualisez comment l'information génétique est copiée de l'ADN vers une molécule d'ARN messager.</p>
                                        <button onClick={handleTranscriptionSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'transcription' ? <Loader2 className="animate-spin mx-auto"/> : 'Lancer la Transcription'}
                                        </button>
                                    </div>
                                </SimulationSection>

                                {/* --- NOUVELLE SIMULATION --- */}
                                <SimulationSection icon={<Activity />} title="Biochimie">
                                    <div className="p-4 border rounded-lg space-y-4">
                                        <h3 className="font-bold">Action Enzymatique</h3>
                                        <p className="text-sm text-text-secondary">Visualisez comment la vitesse d'une réaction catalysée par une enzyme atteint un plateau (saturation) lorsque la concentration en substrat augmente.</p>
                                        <button onClick={handleEnzymeSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                            {activeSimulation === 'enzyme' ? <Loader2 className="animate-spin mx-auto"/> : 'Tracer la Courbe'}
                                        </button>
                                    </div>
                                </SimulationSection>
                            </>
                        )}

                        {/* --- NOUVEL ONGLET GÉOLOGIE --- */}
                        {activeTab === 'geology' && (
                            <SimulationSection icon={<Globe />} title="Tectonique des Plaques">
                                <div className="p-4 border rounded-lg space-y-4">
                                    <h3 className="font-bold">Dérive des Continents</h3>
                                    <p className="text-sm text-text-secondary">Utilisez le slider pour voyager dans le temps et observer la formation et la fracture de la Pangée.</p>
                                    <button onClick={handleDriftSimulation} disabled={!!activeSimulation} className="btn-primary w-full">
                                        {activeSimulation === 'drift' ? <Loader2 className="animate-spin mx-auto"/> : 'Charger la Simulation'}
                                    </button>
                                </div>
                            </SimulationSection>
                        )}
                    </div>
                </div>

                {/* --- COLONNE DE DROITE : ZONE D'AFFICHAGE --- VERSION CORRIGÉE ET SIMPLIFIÉE --- */}
                <div className="bg-surface p-6 rounded-lg shadow-md flex items-center justify-center min-h-[500px]">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    {activeSimulation && <Loader2 className="animate-spin h-12 w-12 text-primary" />}

                    {!error && !activeSimulation && simulationResult && (
                        <div className="text-center w-full">
                            <h3 className="font-bold mb-4 text-lg">{simulationResult.title}</h3>

                            {/* --- NOUVEL AFFICHAGE --- */}
                            {simulationResult.data && simulationResult.data.pangea && (
                                <ContinentalDriftViewer data={simulationResult.data} />
                            )}
                            
                            {/* Cas 1 : Simulation de la pile (deux images) */}
                            {simulationResult.schemaUrl && simulationResult.graphUrl && (
                                <div className="space-y-6">
                                    <img src={simulationResult.schemaUrl} alt="Schéma de la simulation" className="max-w-full h-auto rounded-md shadow-lg mx-auto" />
                                    <img src={simulationResult.graphUrl} alt="Graphique de la simulation" className="max-w-full h-auto rounded-md shadow-lg mx-auto" />
                                </div>
                            )}

                            {/* Cas 2 : Simulation de la dilatation du temps (données numériques) */}
                            {/* CORRECTION : On vérifie une propriété UNIQUE à cette simulation */}
                            {simulationResult.data && simulationResult.data.proper_time !== undefined && (
                                <div className="space-y-4 text-left max-w-md mx-auto">
                                    <div className="bg-background p-4 rounded-lg">
                                        <p className="text-text-secondary">Temps écoulé pour le voyageur :</p>
                                        <p className="text-3xl font-bold text-primary">{simulationResult.data.proper_time.toFixed(2)} ans</p>
                                    </div>
                                    <div className="bg-background p-4 rounded-lg">
                                        <p className="text-text-secondary">Temps écoulé sur Terre :</p>
                                        <p className="text-3xl font-bold text-green-500">{simulationResult.data.dilated_time.toFixed(2)} ans</p>
                                    </div>
                                    <p className="text-sm text-text-subtle text-center pt-4">Le temps s'est écoulé <strong className="text-orange-500">{simulationResult.data.lorentz_factor.toFixed(2)} fois</strong> plus vite sur Terre.</p>
                                </div>
                            )}

                            {/* Cas 3 : Simulation de transcription (composant interactif) */}
                            {/* CORRECTION : On vérifie une propriété UNIQUE à cette simulation */}
                            {simulationResult.data && simulationResult.data.mrna_strand && (
                                <TranscriptionViewer data={simulationResult.data} />
                            )}

                            {/* Cas 4 : Simulation de génétique (échiquier + image) */}
                            {simulationResult.punnettSquare && (
                                <div className="max-w-xs mx-auto mb-6">
                                    <h4 className="font-semibold mb-2">Échiquier de Croisement</h4>
                                    <div className="grid grid-cols-3 gap-1 text-center font-mono border bg-background text-lg">
                                        <div className="p-2">x</div>
                                        <div className="p-2 font-bold text-primary">{simulationResult.punnettSquare.parent2[0]}</div>
                                        <div className="p-2 font-bold text-primary">{simulationResult.punnettSquare.parent2[1]}</div>
                                        <div className="p-2 font-bold text-primary">{simulationResult.punnettSquare.parent1[0]}</div>
                                        <div className="p-2 border">{[simulationResult.punnettSquare.parent1[0], simulationResult.punnettSquare.parent2[0]].sort().join('')}</div>
                                        <div className="p-2 border">{[simulationResult.punnettSquare.parent1[0], simulationResult.punnettSquare.parent2[1]].sort().join('')}</div>
                                        <div className="p-2 font-bold text-primary">{simulationResult.punnettSquare.parent1[1]}</div>
                                        <div className="p-2 border">{[simulationResult.punnettSquare.parent1[1], simulationResult.punnettSquare.parent2[0]].sort().join('')}</div>
                                        <div className="p-2 border">{[simulationResult.punnettSquare.parent1[1], simulationResult.punnettSquare.parent2[1]].sort().join('')}</div>
                                    </div>
                                </div>
                            )}
                            {simulationResult.resultsImageUrl && <img src={simulationResult.resultsImageUrl} alt="Graphique des résultats" className="max-w-full h-auto rounded-md shadow-lg mx-auto" />}


                            {/* Cas 5 : Simulation standard (une seule image) - DOIT ÊTRE À LA FIN */}
                            {simulationResult.dataUrl && (
                                <img src={simulationResult.dataUrl} alt={simulationResult.title} className="max-w-full h-auto rounded-md shadow-lg mx-auto" />
                            )}

                            {/* Affichage additionnel pour la mesure quantique (s'il est présent) */}
                            {simulationResult.result !== undefined && (
                                <div className="mt-4 p-3 bg-primary/10 rounded-lg max-w-sm mx-auto">
                                    <p>Résultat de la mesure : <span className="font-bold text-2xl text-primary">{simulationResult.result}</span></p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {!error && !activeSimulation && !simulationResult && (
                        <div className="text-center text-text-secondary">
                            <Beaker size={48} className="mx-auto mb-4"/>
                            <p>Choisissez une simulation et lancez-la.</p>
                            <p>Le résultat s'affichera ici.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- NOUVEAU : Un composant pour structurer les sections ---
const SimulationSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">{icon} {title}</h2>
            {children}
        </div>
    );
};


export default PhysicsLabPage;