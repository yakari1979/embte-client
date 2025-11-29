// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { getMyReportCard } from '@/services/api'; 
// import BulletinDocument from '@/components/reports/BulletinDocument';
// import Cookies from 'js-cookie';
// import { useReactToPrint } from 'react-to-print';
// import { Download, Lock, Loader2, FileText, CheckCircle2 } from 'lucide-react';

// export default function StudentBulletinsPage() {
//     const [bulletin, setBulletin] = useState<any>(null);
//     const [config, setConfig] = useState<any>(null);
//     const [establishment, setEstablishment] = useState<any>(null);
//     const [classStats, setClassStats] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     const componentRef = useRef(null);
//     const handlePrint = useReactToPrint({
//         contentRef: componentRef,
//         documentTitle: `Mon_Bulletin_${new Date().getFullYear()}`,
//     });

//     useEffect(() => {
//         const load = async () => {
//             const token = Cookies.get('token');
//             try {
//                 const res = await getMyReportCard(token!); 
//                 if (res.data.isPublished) {
//                     setBulletin(res.data.bulletin);
//                     setConfig(res.data.config);
//                     setEstablishment(res.data.establishment);
//                     setClassStats(res.data.classStats);
//                 }
//             } catch (e) {
//                 console.error(e);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         load();
//     }, []);

//     // --- 1. ÉCRAN DE CHARGEMENT ÉLÉGANT ---
//     if (loading) return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-background transition-colors duration-300">
//             <div className="bg-surface p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-4 border border-gray-200 dark:border-gray-800">
//                 <Loader2 className="animate-spin text-blue-600" size={48} />
//                 <p className="text-text-secondary font-medium animate-pulse">Récupération de votre bulletin...</p>
//             </div>
//         </div>
//     );

//     // --- 2. ÉTAT VIDE (PAS DE BULLETIN) ---
//     if (!bulletin || !establishment) return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary p-6 transition-colors duration-300">
//             <div className="bg-surface max-w-md w-full p-8 rounded-3xl shadow-xl text-center border border-gray-200 dark:border-gray-800 relative overflow-hidden">
//                 {/* Décoration d'arrière-plan */}
//                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"></div>
                
//                 <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//                     <Lock size={40} className="text-gray-400 dark:text-gray-500"/>
//                 </div>
                
//                 <h2 className="text-2xl font-bold mb-2">Bulletin non disponible</h2>
//                 <p className="text-text-secondary mb-6 text-sm leading-relaxed">
//                     Le bulletin de ce semestre n'a pas encore été publié par l'administration ou votre dossier est en cours de traitement.
//                 </p>
                
//                 <div className="inline-flex items-center gap-2 text-xs text-text-subtle bg-background px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
//                     <CheckCircle2 size={12} className="text-blue-500"/>
//                     Revenez vérifier plus tard
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-background text-text-primary transition-colors duration-300 flex flex-col">
            
//             {/* --- 3. EN-TÊTE PROFESSIONNEL (Sticky) --- */}
//             <header className="bg-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
//                             <FileText size={24} />
//                         </div>
//                         <div>
//                             <h1 className="text-xl font-bold tracking-tight">Mon Bulletin Scolaire</h1>
//                             <p className="text-xs text-text-secondary font-medium uppercase tracking-wide">
//                                 {establishment.name} • Semestre 1
//                             </p>
//                         </div>
//                     </div>
                    
//                     <button 
//                         onClick={() => handlePrint()} 
//                         className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all"
//                     >
//                         <Download size={18}/> 
//                         <span className="hidden sm:inline">Télécharger PDF</span>
//                     </button>
//                 </div>
//             </header>

//             {/* --- 4. ZONE DE VISUALISATION DU DOCUMENT --- */}
//             <main className="flex-grow p-4 md:p-8 overflow-auto flex justify-center items-start">
                
//                 {/* Conteneur "Papier" */}
//                 {/* Note : On force bg-white et text-black ici car c'est une simulation de papier physique */}
//                 <div className="relative group perspective-1000">
                    
//                     {/* Ombre portée stylisée derrière le papier */}
//                     <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    
//                     <div className="relative bg-white text-black rounded-sm shadow-2xl overflow-hidden ring-1 ring-gray-900/5">
                        
//                         {/* Zone imprimable */}
//                         <div className="min-w-[210mm] min-h-[297mm]" ref={componentRef}>
//                             <BulletinDocument 
//                                 data={bulletin} 
//                                 config={config} 
//                                 establishment={establishment} 
//                                 classStats={classStats}
//                                 onToggleDecision={undefined} // Lecture seule
//                             />
//                         </div>

//                     </div>
                    
//                     {/* Indicateur de page */}
//                     <div className="absolute top-0 -right-12 hidden xl:flex flex-col gap-2 items-center text-text-subtle">
//                         <span className="text-xs font-mono rotate-90 origin-left translate-y-8">PAGE 1/1</span>
//                     </div>
//                 </div>
//             </main>

//             {/* Pied de page discret */}
//             <footer className="py-6 text-center text-xs text-text-subtle">
//                 Document certifié par la plateforme PENI • {new Date().getFullYear()}
//             </footer>
//         </div>
//     );
// }




"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getMyReportCard } from '@/services/api'; 
import BulletinDocument from '@/components/reports/BulletinDocument';
import Cookies from 'js-cookie';
import { useReactToPrint } from 'react-to-print';
import { Download, Lock, Loader2, FileText, CheckCircle2 } from 'lucide-react';

export default function StudentBulletinsPage() {
    const [bulletin, setBulletin] = useState<any>(null);
    const [config, setConfig] = useState<any>(null);
    const [establishment, setEstablishment] = useState<any>(null);
    const [classStats, setClassStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Mon_Bulletin_${new Date().getFullYear()}`,
    });

    useEffect(() => {
        const load = async () => {
            const token = Cookies.get('token');
            try {
                const res = await getMyReportCard(token!); 
                if (res.data.isPublished) {
                    setBulletin(res.data.bulletin);
                    setConfig(res.data.config);
                    setEstablishment(res.data.establishment);
                    setClassStats(res.data.classStats);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // --- 1. ÉCRAN DE CHARGEMENT ÉLÉGANT ---
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background transition-colors duration-300">
            <div className="bg-surface p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-4 border border-gray-200 dark:border-gray-800">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-text-secondary font-medium animate-pulse">Récupération de votre bulletin...</p>
            </div>
        </div>
    );

    // --- 2. ÉTAT VIDE (PAS DE BULLETIN) ---
    if (!bulletin || !establishment) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary p-6 transition-colors duration-300">
            <div className="bg-surface max-w-md w-full p-8 rounded-3xl shadow-xl text-center border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                {/* Décoration d'arrière-plan */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"></div>
                
                <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Lock size={40} className="text-gray-400 dark:text-gray-500"/>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Bulletin non disponible</h2>
                <p className="text-text-secondary mb-6 text-sm leading-relaxed">
                    Le bulletin de ce semestre n'a pas encore été publié par l'administration ou votre dossier est en cours de traitement.
                </p>
                
                <div className="inline-flex items-center gap-2 text-xs text-text-subtle bg-background px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                    <CheckCircle2 size={12} className="text-blue-500"/>
                    Revenez vérifier plus tard
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-text-primary transition-colors duration-300 flex flex-col">
            
            {/* --- 3. EN-TÊTE PROFESSIONNEL (Sticky) --- */}
            <header className="bg-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
                            <FileText size={24} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg md:text-xl font-bold tracking-tight truncate">Mon Bulletin</h1>
                            <p className="text-xs text-text-secondary font-medium uppercase tracking-wide truncate">
                                {establishment.name} • Semestre 1
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => handlePrint()} 
                        className="btn-primary flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all flex-shrink-0"
                    >
                        <Download size={18}/> 
                        <span className="hidden sm:inline">Télécharger PDF</span>
                    </button>
                </div>
            </header>

            {/* --- 4. ZONE DE VISUALISATION DU DOCUMENT (Responsive Fix) --- */}
            <main className="flex-grow w-full overflow-hidden flex flex-col items-center pt-4 pb-20 md:py-8">
                
                {/* Conteneur de mise à l'échelle */}
                <div className="w-full flex justify-center overflow-hidden">
                        
                    {/* 
                        Wrapper avec mise à l'échelle responsive.
                        Sur mobile (scale-[0.43]), le document A4 (210mm) est réduit 
                        pour tenir dans la largeur d'un téléphone.
                    */}
                    <div className="
                        transform 
                        origin-top 
                        scale-[0.43]      /* Mobile très petit */
                        xs:scale-[0.48]   /* Mobile standard */
                        sm:scale-[0.65]   /* Grandes phablettes */
                        md:scale-[0.80]   /* Tablettes */
                        lg:scale-100      /* Desktop */
                        transition-transform duration-300
                        mb-[-50%] md:mb-0 /* Hack CSS pour remonter le vide créé par le scale */
                    ">
                        
                        {/* Cadre Papier (Ombre et Fond Blanc) */}
                        <div className="relative bg-white text-black rounded-sm shadow-2xl overflow-hidden ring-1 ring-gray-900/5">
                            
                            {/* Zone imprimable (Taille réelle fixe) */}
                            <div className="min-w-[210mm] min-h-[297mm]" ref={componentRef}>
                                <BulletinDocument 
                                    data={bulletin} 
                                    config={config} 
                                    establishment={establishment} 
                                    classStats={classStats}
                                    onToggleDecision={undefined} // Lecture seule
                                />
                            </div>

                        </div>
                        
                        {/* Indicateur de page (Décoratif) */}
                        <div className="absolute top-0 -right-12 hidden xl:flex flex-col gap-2 items-center text-text-subtle">
                            <span className="text-xs font-mono rotate-90 origin-left translate-y-8">PAGE 1/1</span>
                        </div>

                    </div>
                </div>
            </main>

            {/* Pied de page discret */}
            <footer className="py-6 text-center text-xs text-text-subtle">
                Document certifié par la plateforme PENI • {new Date().getFullYear()}
            </footer>
        </div>
    );
}