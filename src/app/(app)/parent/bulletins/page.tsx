"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getMyChildren, getChildReportCard } from '@/services/api'; 
import BulletinDocument from '@/components/reports/BulletinDocument';
import Cookies from 'js-cookie';
import { useReactToPrint } from 'react-to-print';
import { 
    Download, Lock, Loader2, User, 
    ArrowLeft, GraduationCap, ChevronRight 
} from 'lucide-react';

export default function ParentBulletinsPage() {
    // --- ÉTATS ---
    const [children, setChildren] = useState<any[]>([]);
    const [selectedChild, setSelectedChild] = useState<any | null>(null); 
    
    // Données du bulletin
    const [bulletin, setBulletin] = useState<any>(null);
    const [config, setConfig] = useState<any>(null);
    const [establishment, setEstablishment] = useState<any>(null);
    const [classStats, setClassStats] = useState<any>(null);
    
    const [loadingChildren, setLoadingChildren] = useState(true);
    const [loadingBulletin, setLoadingBulletin] = useState(false);

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Bulletin_${selectedChild?.lastName || 'Enfant'}`,
    });

    // 1. Charger la liste des enfants
    useEffect(() => {
        const loadChildren = async () => {
            const token = Cookies.get('token');
            try {
                const res = await getMyChildren(token!);
                // @ts-ignore
                setChildren(res.data);
            } catch (e) {
                console.error("Erreur chargement enfants", e);
            } finally {
                setLoadingChildren(false);
            }
        };
        loadChildren();
    }, []);

    // 2. Charger le bulletin
    useEffect(() => {
        if (!selectedChild) return;

        const loadBulletin = async () => {
            setLoadingBulletin(true);
            setBulletin(null);
            const token = Cookies.get('token');
            try {
                const res = await getChildReportCard(selectedChild.id, token!);
                
                if (res.data.isPublished) {
                    setBulletin(res.data.bulletin);
                    setConfig(res.data.config);
                    setEstablishment(res.data.establishment);
                    setClassStats(res.data.classStats);
                } else {
                    setBulletin(null);
                }
            } catch (e) {
                console.error("Erreur bulletin", e);
            } finally {
                setLoadingBulletin(false);
            }
        };
        loadBulletin();
    }, [selectedChild]);

    const handleBackToDashboard = () => {
        setSelectedChild(null);
        setBulletin(null);
    };

    if (loadingChildren) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (children.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-secondary px-4 text-center">
            <div className="bg-surface p-6 rounded-full shadow-sm mb-4">
                <User size={48} className="text-gray-300"/>
            </div>
            <h3 className="text-lg font-bold text-text-primary">Aucun enfant associé</h3>
            <p className="text-sm mt-2">Veuillez contacter l'administration de l'école.</p>
        </div>
    );

    // =========================================================
    //   VUE 1 : TABLEAU DE BORD (MOBILE FIRST)
    // =========================================================
    if (!selectedChild) {
        return (
            <div className="min-h-screen bg-background text-text-primary p-4 md:p-10 transition-colors duration-300">
                <div className="max-w-5xl mx-auto">
                    
                    <div className="mb-8 md:mb-10 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Mes Enfants</h1>
                        <p className="text-sm md:text-base text-text-secondary">Sélectionnez un profil pour voir les résultats.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {children.map((child, index) => (
                            <div 
                                key={child.id}
                                onClick={() => setSelectedChild(child)}
                                className="group bg-surface border border-gray-200 dark:border-gray-700 rounded-2xl p-5 cursor-pointer shadow-sm active:scale-95 md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 relative overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Bande décorative gauche */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 group-hover:bg-indigo-500 transition-colors"></div>

                                {/* Avatar */}
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex-shrink-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <User size={24} />
                                </div>

                                {/* Infos */}
                                <div className="flex-grow">
                                    <h2 className="text-lg font-bold text-text-primary leading-tight">
                                        {child.firstName} <span className="uppercase">{child.lastName}</span>
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
                                        <GraduationCap size={14}/>
                                        <span>{child.enrolledClass?.name || "Classe inconnue"}</span>
                                    </div>
                                </div>

                                {/* Flèche */}
                                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    //   VUE 2 : DÉTAIL DU BULLETIN (RESPONSIVE FIX)
    // =========================================================
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-text-primary transition-colors duration-300 flex flex-col">
            
            {/* Header Compact et Sticky */}
            <header className="bg-surface border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm h-16 flex items-center px-4 md:px-8 justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                        onClick={handleBackToDashboard}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-secondary"
                    >
                        <ArrowLeft size={22}/>
                    </button>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-sm md:text-lg font-bold truncate">
                            {selectedChild.firstName} {selectedChild.lastName}
                        </h1>
                        <p className="text-[10px] md:text-xs text-text-secondary truncate">
                            {selectedChild.enrolledClass?.name} • Semestre 1
                        </p>
                    </div>
                </div>

                {bulletin && (
                    <button 
                        onClick={() => handlePrint()} 
                        className="p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg md:rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        <Download size={18}/> 
                        <span className="hidden md:inline text-sm">PDF</span>
                    </button>
                )}
            </header>

            {/* Contenu Bulletin */}
            <main className="flex-grow w-full overflow-hidden flex flex-col items-center pt-4 pb-20 md:py-8">
                
                {loadingBulletin ? (
                    <div className="mt-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                        <p className="text-xs md:text-sm text-text-secondary">Chargement du bulletin...</p>
                    </div>
                ) : !bulletin ? (
                    <div className="mt-10 mx-4 bg-surface max-w-sm w-full p-6 md:p-8 rounded-3xl shadow-lg text-center border border-gray-200 dark:border-gray-800">
                        <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={28} className="text-gray-400"/>
                        </div>
                        <h2 className="text-lg font-bold mb-2">Non Disponible</h2>
                        <p className="text-text-secondary text-sm mb-6">
                            Le bulletin n'est pas encore publié pour cet élève.
                        </p>
                        <button onClick={handleBackToDashboard} className="text-blue-600 text-sm font-semibold hover:underline">
                            Retourner à la liste
                        </button>
                    </div>
                ) : (
                    // --- C'EST ICI LA MAGIE DU RESPONSIVE ---
                    // On utilise 'scale' pour réduire visuellement le A4 sur mobile
                    // Tout en gardant la structure originale pour l'impression PDF
                    <div className="w-full flex justify-center overflow-hidden">
                        
                        {/* Wrapper avec mise à l'échelle responsive */}
                        <div className="
                            transform 
                            origin-top 
                            scale-[0.43]      /* Mobile très petit (iPhone SE) */
                            xs:scale-[0.48]   /* Mobile standard */
                            sm:scale-[0.65]   /* Grandes phablettes */
                            md:scale-[0.80]   /* Tablettes */
                            lg:scale-100      /* Desktop */
                            transition-transform duration-300
                            mb-[-50%] md:mb-0 /* Hack pour remonter le vide créé par le scale */
                        ">
                            <div className="relative bg-white text-black shadow-2xl">
                                <div ref={componentRef} className="min-w-[210mm] min-h-[297mm]">
                                    <BulletinDocument 
                                        data={bulletin} 
                                        config={config} 
                                        establishment={establishment} 
                                        classStats={classStats}
                                        onToggleDecision={undefined} 
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}