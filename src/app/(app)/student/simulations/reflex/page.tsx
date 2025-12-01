"use client";
import React, { useState, useEffect } from 'react';
import Reflex3D from '@/components/simulations/Reflex3D';
import { simulateReflex, ReflexData } from '@/services/api';
import Cookies from 'js-cookie';
import { 
    Hammer, 
    Activity, 
    AlertOctagon, 
    ArrowRight, 
    Zap, 
    BrainCircuit, 
    Footprints,
    XCircle,
    CheckCircle2
} from 'lucide-react';

// --- NOUVEAU COMPOSANT : SCHÉMA DE L'ARC RÉFLEXE ---
const ReflexCircuitDiagram = ({ 
    isAnimating, 
    damageLocation, 
    success 
}: { 
    isAnimating: boolean, 
    damageLocation: string, 
    success: boolean 
}) => {
    // État d'avancement de l'animation (0 à 5)
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (isAnimating) {
            setStep(1); // Début : Stimulus
            
            // Séquence d'animation
            const timer1 = setTimeout(() => {
                // Si lésion sensitif, on s'arrête là
                if (damageLocation === 'SENSORY_NERVE') setStep(-2); // -2 = Erreur ici
                else setStep(2);
            }, 600);

            const timer2 = setTimeout(() => {
                if (damageLocation === 'SENSORY_NERVE') return;
                // Si lésion moelle
                if (damageLocation === 'SPINAL_CORD') setStep(-3);
                else setStep(3);
            }, 1200);

            const timer3 = setTimeout(() => {
                if (damageLocation === 'SENSORY_NERVE' || damageLocation === 'SPINAL_CORD') return;
                // Si lésion moteur
                if (damageLocation === 'MOTOR_NERVE') setStep(-4);
                else setStep(4);
            }, 1800);

            const timer4 = setTimeout(() => {
                if (damageLocation !== 'NONE') return;
                setStep(5); // Succès
            }, 2400);

            return () => {
                clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4);
            };
        } else {
            setStep(0); // Reset
        }
    }, [isAnimating, damageLocation]);

    // Fonction pour déterminer la couleur d'une étape
    const getStatusColor = (currentStepIndex: number) => {
        if (step === 0) return "bg-gray-100 text-gray-400 border-gray-200"; // Inactif
        if (step === currentStepIndex) return "bg-blue-100 text-blue-600 border-blue-500 ring-2 ring-blue-200 animate-pulse"; // Actif
        if (step > currentStepIndex) return "bg-green-100 text-green-600 border-green-500"; // Passé (Succès)
        if (step === -currentStepIndex) return "bg-red-100 text-red-600 border-red-500"; // Échec ici
        return "bg-gray-100 text-gray-400 border-gray-200"; // Futur
    };

    return (
        <div className="mt-6 space-y-3">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wide">
                Trajet de l'influx nerveux
            </h3>
            
            <div className="relative flex flex-col gap-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                
                {/* ÉTAPE 1 : STIMULUS */}
                <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStatusColor(1)}`}>
                    <div className="absolute -left-[23px] bg-white dark:bg-gray-800 p-1">
                        {step === 1 ? <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"/> : <div className="w-3 h-3 bg-gray-300 rounded-full"/>}
                    </div>
                    <Hammer size={20} />
                    <div className="flex-1">
                        <div className="font-bold text-sm">1. Stimulus</div>
                        <div className="text-xs opacity-80">Étirement du tendon</div>
                    </div>
                    {step > 1 && <CheckCircle2 size={16} className="text-green-500"/>}
                </div>

                {/* ÉTAPE 2 : NERF SENSITIF */}
                <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStatusColor(2)}`}>
                    <div className="absolute -left-[23px] bg-white dark:bg-gray-800 p-1">
                        {step === -2 ? <XCircle size={16} className="text-red-500"/> : step >= 2 ? <div className="w-3 h-3 bg-green-500 rounded-full"/> : <div className="w-3 h-3 bg-gray-300 rounded-full"/>}
                    </div>
                    <Zap size={20} />
                    <div className="flex-1">
                        <div className="font-bold text-sm">2. Voie Sensitive</div>
                        <div className="text-xs opacity-80">Message afférent vers la moelle</div>
                    </div>
                    {step === -2 && <span className="text-xs font-bold text-red-600">SECTIONNÉ !</span>}
                </div>

                {/* ÉTAPE 3 : MOELLE ÉPINIÈRE */}
                <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStatusColor(3)}`}>
                    <div className="absolute -left-[23px] bg-white dark:bg-gray-800 p-1">
                        {step === -3 ? <XCircle size={16} className="text-red-500"/> : step >= 3 ? <div className="w-3 h-3 bg-green-500 rounded-full"/> : <div className="w-3 h-3 bg-gray-300 rounded-full"/>}
                    </div>
                    <BrainCircuit size={20} />
                    <div className="flex-1">
                        <div className="font-bold text-sm">3. Centre Nerveux</div>
                        <div className="text-xs opacity-80">Traitement synaptique</div>
                    </div>
                    {step === -3 && <span className="text-xs font-bold text-red-600">DÉTRUIT !</span>}
                </div>

                {/* ÉTAPE 4 : NERF MOTEUR */}
                <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStatusColor(4)}`}>
                    <div className="absolute -left-[23px] bg-white dark:bg-gray-800 p-1">
                        {step === -4 ? <XCircle size={16} className="text-red-500"/> : step >= 4 ? <div className="w-3 h-3 bg-green-500 rounded-full"/> : <div className="w-3 h-3 bg-gray-300 rounded-full"/>}
                    </div>
                    <Activity size={20} />
                    <div className="flex-1">
                        <div className="font-bold text-sm">4. Voie Motrice</div>
                        <div className="text-xs opacity-80">Message efférent vers le muscle</div>
                    </div>
                    {step === -4 && <span className="text-xs font-bold text-red-600">SECTIONNÉ !</span>}
                </div>

                {/* ÉTAPE 5 : RÉPONSE */}
                <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStatusColor(5)}`}>
                    <div className="absolute -left-[23px] bg-white dark:bg-gray-800 p-1">
                        {step === 5 ? <div className="w-3 h-3 bg-green-500 rounded-full"/> : <div className="w-3 h-3 bg-gray-300 rounded-full"/>}
                    </div>
                    <Footprints size={20} />
                    <div className="flex-1">
                        <div className="font-bold text-sm">5. Réponse</div>
                        <div className="text-xs opacity-80">Extension de la jambe</div>
                    </div>
                    {step === 5 && <span className="text-xs font-bold text-green-600">SUCCÈS</span>}
                </div>

            </div>
        </div>
    );
};


// --- PAGE PRINCIPALE ---
export default function ReflexPage() {
    const [intensity, setIntensity] = useState(50);
    const [damage, setDamage] = useState('NONE');
    const [data, setData] = useState<ReflexData | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const hitTendon = async () => {
        if (isAnimating) return; // Empêcher le spam
        setIsAnimating(true);
        const token = Cookies.get('token');
        if(!token) return;

        const res = await simulateReflex({ stimulusIntensity: intensity, damageLocation: damage }, token);
        setData(res.data);
        
        // La durée de l'animation correspond au diagramme (environ 3s)
        setTimeout(() => setIsAnimating(false), 3000); 
    };

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex gap-2 items-center text-gray-800 dark:text-white">
                    <Activity className="text-indigo-500" /> Réflexe Myotatique (Rotulien)
                </h1>
                <p className="text-gray-500">Testez l'intégrité de l'arc réflexe en stimulant le tendon rotulien.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* COLONNE GAUCHE : CONTRÔLES & SCHÉMA */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-fit">
                    
                    {/* Contrôles */}
                    <div className="space-y-6">
                        <div>
                            <label className="font-bold block mb-2 dark:text-gray-200">Intensité du coup</label>
                            <input 
                                type="range" min="0" max="100" 
                                value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                            <div className="text-right text-sm text-gray-500">{intensity}%</div>
                        </div>

                        <div>
                            <label className="font-bold flex items-center gap-2 mb-2 dark:text-gray-200">
                                <AlertOctagon size={16} className="text-red-500"/> Lésion expérimentale
                            </label>
                            <select 
                                value={damage} onChange={(e) => setDamage(e.target.value)}
                                className="w-full p-2 border rounded bg-transparent dark:text-white dark:border-gray-600"
                                disabled={isAnimating}
                            >
                                <option value="NONE">Aucune (Sujet Sain)</option>
                                <option value="SENSORY_NERVE">Section Nerf Sensitif</option>
                                <option value="SPINAL_CORD">Destruction Moelle</option>
                                <option value="MOTOR_NERVE">Section Nerf Moteur</option>
                            </select>
                        </div>

                        <button 
                            onClick={hitTendon}
                            disabled={isAnimating}
                            className={`w-full py-4 font-bold rounded-xl flex justify-center items-center gap-2 transition-all ${isAnimating ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'}`}
                        >
                            <Hammer /> {isAnimating ? "Analyse en cours..." : "Frapper le tendon"}
                        </button>
                    </div>

                    {/* Le Schéma Animé remplace le texte simple */}
                    <div className="border-t mt-6 pt-4 dark:border-gray-700">
                        <ReflexCircuitDiagram 
                            isAnimating={isAnimating} 
                            damageLocation={damage} 
                            success={data?.success || false} 
                        />
                    </div>

                </div>

                {/* COLONNE DROITE : SIMULATION 3D */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden h-[600px] border border-gray-200 dark:border-gray-700 relative shadow-inner">
                        <Reflex3D angle={data ? data.legAngle : 0} />
                    </div>

                    {/* Légende rapide */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                        <span>💡 <strong>Astuce :</strong> Une section du nerf sensitif empêche l'information de monter, tandis qu'une section motrice empêche l'ordre de descendre.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}