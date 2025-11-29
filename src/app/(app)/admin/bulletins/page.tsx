// "use client";

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useReactToPrint } from 'react-to-print';
// // 1. IMPORTS CORRIGÉS POUR LE ROUTER
// import { useRouter, useSearchParams } from 'next/navigation';
// import { 
//     Printer, Settings, Save, Type, Palette, 
//     LayoutTemplate, CheckSquare, MousePointerClick, 
//     Phone, FileBadge, Stamp, Loader2,AlertTriangle, XCircle, ArrowLeft
// } from 'lucide-react';
// import { listClasses, generateClassBulletins, saveBulletinConfig,saveDecisions } from '@/services/api';
// import Cookies from 'js-cookie';


// // --- 1. CORRECTION DE L'INTERFACE (TYPESCRIPT) ---
// interface BuilderConfig {
//     // Style Global
//     bgType: 'SOLID' | 'GRADIENT';
//     bgColor1: string;
//     bgColor2: string;
//     borderColor: string;
//     fontFamily: string;
//     fontSize: string;
    
//     // En-tête
//     showMinistereLogos: boolean; // <--- C'était ça qui manquait
//     schoolNameSize: string;      // <--- Et ça
    
//     // Contenu
//     showRank: boolean;
//     showCoeff: boolean;
//     showAppreciation: boolean;
    
//     // Infos Manuelles
//     authNumber: string;
//     phoneNumber: string;
    
//     // Pied de page
//     directorName: string;
//     showDirectorSignature: boolean;
// }

// // --- COMPOSANT TAMPON ---
// const SchoolStamp = ({ schoolName, color }: { schoolName: string, color: string }) => (
//     <div 
//         className="absolute bottom-4 right-6 w-32 h-32 border-4 border-double rounded-full flex flex-col items-center justify-center text-center opacity-80 transform -rotate-12 pointer-events-none select-none"
//         style={{ borderColor: color, color: color }}
//     >
//         <div className="text-[8px] font-bold uppercase tracking-widest mb-1">Rép. du Sénégal</div>
//         <div className="w-24 h-[1px]" style={{ backgroundColor: color }}></div>
//         <div className="font-black text-[10px] uppercase my-1 leading-tight px-2">
//             {schoolName}
//         </div>
//         <div className="text-[8px] font-bold uppercase">Le Directeur</div>
//         <div className="text-[8px] mt-1">★ Validé ★</div>
//     </div>
// );

// // ============================================================================
// //   LE DOCUMENT UNIQUE (BULLETIN)
// // ============================================================================
// const BulletinDocument = ({ data, config, establishment, classStats, onToggleDecision }: any) => {
    
//     const backgroundStyle = config.bgType === 'SOLID' 
//         ? { backgroundColor: config.bgColor1 }
//         : { backgroundImage: `linear-gradient(135deg, ${config.bgColor1}, ${config.bgColor2})` };

//     const themeColor = config.borderColor;

//     return (
//         <div 
//             className="mx-auto relative overflow-hidden text-black print:w-full print:h-full page-break"
//             style={{ 
//                 width: '210mm', 
//                 minHeight: '297mm', 
//                 padding: '10mm', 
//                 fontFamily: config.fontFamily,
//                 fontSize: config.fontSize,
//                 ...backgroundStyle
//             }}
//         >
//             {/* --- 1. EN-TÊTE CORRIGÉ (GAUCHE - MILIEU - DROITE) --- */}
//             <div className="flex justify-between items-stretch mb-2 border-2 p-2 bg-white/50 backdrop-blur-sm" style={{ borderColor: themeColor }}>
                
//                 {/* GAUCHE : MINISTÈRE & INSPECTION */}
//                 <div className="w-1/3 text-center text-[10px] flex flex-col justify-center space-y-1 border-r border-dashed border-gray-300 pr-2">
//                     <img src="/assets/mde.png" className="h-14 mx-auto opacity-90 mix-blend-multiply" alt="Logo Ministère" />
//                     <p className="font-bold">IA : DAKAR</p>
//                     <p className="font-bold">IEF : RUFISQUE COMMUNE</p>
//                 </div>

//                 {/* CENTRE : RÉPUBLIQUE & DRAPEAU */}
//                 <div className="w-1/3 text-center pt-1 px-2">
//                     <p className="font-bold uppercase text-xs">République du Sénégal</p>
//                     <p className="text-[8px] uppercase tracking-wider mb-2">Un Peuple - Un But - Une Foi</p>
                    
//                     {/* DRAPEAU AU MILIEU */}
//                     <img src="/assets/sn.jpg" className="h-12 mx-auto shadow-sm border border-gray-200" alt="Drapeau Sénégal" />
                    
//                     <p className="font-bold uppercase text-[9px] mt-2 text-gray-600">Ministère de l'Éducation Nationale</p>
//                 </div>

//                 {/* DROITE : ÉTABLISSEMENT (Sans espace excessif à droite) */}
//                 <div className="w-1/3 text-center text-[10px] flex flex-col justify-center pl-2 border-l border-dashed border-gray-300">
//                     <div className="border-b-2 pb-1 mb-1 mx-auto w-full" style={{ borderColor: themeColor }}>
//                         <h2 className={`font-black uppercase ${config.schoolNameSize}`} style={{ color: themeColor, lineHeight: '1.1' }}>
//                             {establishment.name || "NOM ÉTABLISSEMENT"}
//                         </h2>
//                     </div>
//                     <div className="space-y-1">
//                         <p className="italic leading-tight">{establishment.address || "Adresse de l'école"}</p>
//                         <p className="font-bold flex justify-center items-center gap-1">
//                             <Phone size={10}/> {config.phoneNumber || establishment.phone || "77 000 00 00"}
//                         </p>
//                         <p className="italic text-[9px] text-gray-500 bg-gray-100 px-1 rounded inline-block mt-1">
//                             REF : {data.autReference || "En attente..."}
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* --- 2. BANDEAU TITRE --- */}
//             <div className="flex items-center mb-4 border-2 bg-white" style={{ borderColor: themeColor }}>
//                 <div className="bg-transparent px-4 py-2 flex-grow">
//                     <h1 className="font-black text-xl underline decoration-2 uppercase tracking-wide">BULLETIN DE NOTES</h1>
//                 </div>
//                 <div className="text-white px-6 py-2 font-bold text-lg flex items-center gap-2" style={{ backgroundColor: themeColor }}>
//                     <span className="text-2xl">1</span> <span className="text-sm align-top">ER</span> <span className="uppercase">Semestre</span>
//                 </div>
//                 <div className="px-4 py-2 border-l-2 font-bold bg-gray-50" style={{ borderColor: themeColor }}>
//                     2024-2025
//                 </div>
//             </div>

//             {/* --- 3. INFORMATIONS ÉLÈVE --- */}
//             <div className="flex mb-4 border-2 p-1 bg-white/80" style={{ borderColor: themeColor }}>
//                 <div className="w-2/3 border-r-2 pr-2 py-1 pl-2 space-y-2" style={{ borderColor: themeColor }}>
//                     <div className="flex items-end">
//                         <span className="font-bold w-32 underline decoration-gray-400">Elève :</span>
//                         <span className="font-black text-lg uppercase">{data.student.firstName} {data.student.lastName}</span>
//                     </div>
//                     <div className="flex items-end text-sm">
//                         <span className="font-bold w-32 underline decoration-gray-400">Date de Naiss :</span>
//                         <span className="mr-6">{data.student.birthDate || "01/01/2005"}</span>
//                         <span className="font-bold underline decoration-gray-400 mr-2">Lieu :</span>
//                         <span>{data.student.birthPlace || "Dakar"}</span>
//                     </div>
//                     <div className="flex items-end text-sm">
//                         <span className="font-bold w-32 underline decoration-gray-400">Matricule :</span>
//                         <span className="font-mono bg-white px-2 border rounded">[ {data.student.id.slice(0,6).toUpperCase()} ]</span>
//                     </div>
//                 </div>

//                 <div className="w-1/3 pl-3 py-1 flex flex-col justify-center">
//                     <div className="border-b-2 pb-1 mb-2" style={{ borderColor: themeColor }}>
//                         <span className="font-bold text-lg">Classe : </span>
//                         <span className="font-black text-xl">{classStats.name || "..."}</span>
//                     </div>
//                     <div className="text-xs space-y-1 font-medium grid grid-cols-2">
//                         <p>Total : <span className="font-bold">{classStats.total}</span></p>
//                         <p></p>
//                         <p>Garçons : <span className="font-bold">{classStats.boys}</span></p>
//                         <p>Filles : <span className="font-bold">{classStats.girls}</span></p>
//                     </div>
//                 </div>
//             </div>

//             {/* --- 4. TABLEAU DES NOTES --- */}
//             <table className="w-full border-collapse border-2 text-[11px] mb-2 bg-white" style={{ borderColor: themeColor }}>
//                 <thead>
//                     <tr className="font-bold border-b-2 text-white" style={{ borderColor: themeColor, backgroundColor: themeColor }}>
//                         <th className="border-r border-white/30 p-2 text-left uppercase w-1/4">Disciplines</th>
//                         <th className="border-r border-white/30 p-1 w-12">Devoir</th>
//                         <th className="border-r border-white/30 p-1 w-12">Compo</th>
//                         <th className="border-r border-white/30 p-1 w-12 bg-white/10">Moy./20</th>
//                         <th className="border-r border-white/30 p-1 w-10">Coeff</th>
//                         <th className="border-r border-white/30 p-1 w-12 bg-white/20">Moy*Coef</th>
//                         {config.showRank && <th className="border-r border-white/30 p-1 w-10">Rang</th>}
//                         <th className="border-r border-white/30 p-2 text-left">Appréciations</th>
//                         <th className="p-2 text-left w-24">Professeurs</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.subjects.map((sub: any, idx: number) => (
//                         <tr key={idx} className="border-b h-8 hover:bg-gray-50" style={{ borderColor: themeColor }}>
//                             <td className="border-r pl-2 font-bold text-left" style={{ borderColor: themeColor }}>{sub.subject}</td>
//                             <td className="border-r text-center" style={{ borderColor: themeColor }}>{sub.moyDevoirs}</td>
//                             <td className="border-r text-center" style={{ borderColor: themeColor }}>{sub.noteCompo}</td>
//                             <td className="border-r text-center font-bold bg-gray-50" style={{ borderColor: themeColor }}>{sub.moyenne}</td>
//                             <td className="border-r text-center" style={{ borderColor: themeColor }}>{sub.coefficient}</td>
//                             <td className="border-r text-center font-bold bg-gray-100" style={{ borderColor: themeColor }}>{sub.points}</td>
//                             {config.showRank && <td className="border-r text-center text-[10px]" style={{ borderColor: themeColor }}>{sub.rank || "-"}</td>}
//                             <td className="border-r pl-2 italic text-[10px]" style={{ borderColor: themeColor }}>{sub.appreciation}</td>
//                             <td className="pl-2 text-[9px] truncate">{sub.teacher}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//                 <tfoot>
//                     <tr className="font-bold border-t-2" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>
//                         <td className="border-r p-2 text-left" style={{ borderColor: themeColor }}>TOTAL :</td>
//                         <td colSpan={3} className="border-r bg-gray-300" style={{ borderColor: themeColor }}></td>
//                         <td className="border-r text-center text-sm" style={{ borderColor: themeColor }}>{data.summary.totalCoefs}</td>
//                         <td className="border-r text-center text-sm" style={{ borderColor: themeColor }}>{data.summary.totalPoints}</td>
//                         {config.showRank && <td className="border-r" style={{ borderColor: themeColor }}></td>}
//                         <td className="border-r text-right pr-2" style={{ borderColor: themeColor }}>Absences :</td>
//                         <td className="text-center">0h</td>
//                     </tr>
//                     <tr className="font-bold border-t" style={{ borderColor: themeColor, backgroundColor: '#ffffff' }}>
//                         <td className="border-r p-2 text-left uppercase" style={{ borderColor: themeColor }}>Moyenne :</td>
//                         <td colSpan={3} className="border-r text-center text-xl font-black border-b-2" style={{ borderColor: themeColor }}>{data.summary.generalAverage}</td>
//                         <td colSpan={2} className="border-r text-right pr-2" style={{ borderColor: themeColor }}>Moy. Classe :</td>
//                         {/* --- CORRECTION ICI : ON AFFICHE LA VARIABLE classStats.average --- */}
//                         <td className="border-r text-left pl-2 font-bold" style={{ borderColor: themeColor }}>
//                             {classStats.average || "-"}
//                         </td>
//                         {config.showRank && <td className="border-r" style={{ borderColor: themeColor }}></td>}
//                         {/* <td className="border-r text-left pl-2" style={{ borderColor: themeColor }}>-</td> */}
//                         <td className="text-right pr-2">Retards : 0</td>
//                     </tr>
//                     {config.showRank && (
//                         <tr className="border-t" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>
//                             <td className="border-r p-2 font-bold" style={{ borderColor: themeColor }}>RANG</td>
//                             <td colSpan={3} className="border-r text-center font-bold text-lg bg-white" style={{ borderColor: themeColor }}>{data.rank} <span className="text-xs align-top">ème</span></td>
//                             <td colSpan={7} className="bg-gray-300"></td>
//                         </tr>
//                     )}
//                 </tfoot>
//             </table>

//             {/* --- 5. PIED DE PAGE --- */}
//             <div className="flex gap-4 h-40">
//                 <div className="w-1/4 border-2 p-4 text-center flex flex-col justify-center items-center shadow-sm bg-white" style={{ borderColor: themeColor }}>
//                     <p className="underline font-bold mb-2">Moy. 1er Sem :</p>
//                     <p className="text-3xl font-black" style={{ color: themeColor }}>{data.summary.generalAverage}</p>
//                 </div>

//                 <div className="w-1/4">
//                     <p className="font-bold mb-1 text-[10px]">Appréciation des Professeurs</p>
//                     <div className="border-2 h-28 bg-white" style={{ borderColor: themeColor }}></div>
//                 </div>

//                 <div className="w-1/4 border-2 flex flex-col bg-white" style={{ borderColor: themeColor }}>
//                     <div className="text-center font-bold border-b-2 py-1 text-xs uppercase" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>Avis du Conseil</div>
//                     <div className="flex-grow flex flex-col justify-around p-2 text-xs font-bold">
//                         {["Félicitations", "Encouragements", "Tableau d'Honneur", "Avertissement", "Blâme"].map((avis) => (
//                             <div 
//                                 key={avis} 
//                                 className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
//                                 onClick={() => onToggleDecision && onToggleDecision(data.student.id, avis)}
//                             >
//                                 <span>{avis}</span>
//                                 <div className={`w-3 h-3 border-2 flex items-center justify-center ${data.decision === avis ? 'bg-black' : 'bg-white'}`} style={{ borderColor: 'black' }}>
//                                     {data.decision === avis && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="w-1/4 relative text-center">
//                     <p className="text-[9px] italic mb-6">Fait à {establishment.address?.split(',')[0] || "Dakar"}, le {new Date().toLocaleDateString()}</p>
//                     <p className="text-[10px] font-bold underline mb-10">Le Directeur</p>
//                     <p className="text-[10px]">{config.directorName}</p>
                    
//                     {config.showDirectorSignature && (
//                         <SchoolStamp schoolName={establishment.name} color={themeColor} />
//                     )}
//                 </div>
//             </div>
//             {/* Pied de page */}
//             <div className="absolute bottom-2 left-0 w-full text-center text-[8px] text-gray-800">
//                 Document généré par PENI - Plateforme d'Éducation Numérique Intégrée
//             </div>
//         </div>
//     );
// };


// // ============================================================================
// //   PAGE BUILDER (CONTRÔLEUR) - CORRIGÉE
// // ============================================================================
// export default function BulletinBuilderPage() {
//     // 2. INITIALISATION DU ROUTER
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const classIdFromUrl = searchParams.get('classId'); // On récupère l'ID depuis l'URL

//     // Config
//     const [config, setConfig] = useState<any>({
//         bgType: 'SOLID',
//         bgColor1: '#fdfdfd',
//         bgColor2: '#e6f0ff',
//         borderColor: '#000000',
//         fontFamily: 'ui-sans-serif',
//         fontSize: '11px',
//         showMinistereLogos: true,
//         schoolNameSize: 'text-lg',
//         showRank: true,
//         showCoeff: true,
//         showAppreciation: true,
//         authNumber: "",
//         phoneNumber: "",
//         directorName: "M. Le Directeur",
//         showDirectorSignature: true
//     });

//     const [classes, setClasses] = useState([]);
//     const [selectedClass, setSelectedClass] = useState("");
//     const [loading, setLoading] = useState(false);
    
//     // États données
//     const [bulletins, setBulletins] = useState<any[]>([]);
//     const [establishment, setEstablishment] = useState<any>({});
//     const [classStats, setClassStats] = useState<any>({});

//     // États erreur
//     const [missingData, setMissingData] = useState<any[]>([]);
//     const [showMissingModal, setShowMissingModal] = useState(false);

//     const componentRef = useRef(null);
//     const handlePrint = useReactToPrint({
//         contentRef: componentRef,
//         documentTitle: `Bulletins_${selectedClass}`,
//     });

//     // 3. FONCTION DE GÉNÉRATION (Extraite pour être réutilisée)
//     const performGeneration = useCallback(async (targetClassId: string) => {
//         if (!targetClassId) return;
//         setLoading(true);
//         setMissingData([]);
//         setShowMissingModal(false);

//         const token = Cookies.get('token');
//         try {
           

//             // 1. On sauvegarde ce que l'utilisateur voit à l'écran
//             await saveBulletinConfig(config, token!);

//             // 2. On génère les bulletins
//             const res = await generateClassBulletins(targetClassId, token!);
            
//             // @ts-ignore
//             setBulletins(res.data.bulletins);
//             // @ts-ignore
//             setEstablishment(res.data.establishment);
//             // @ts-ignore
//             setClassStats(res.data.classStats);
            
//             // 3. ON RECUPÈRE LA CONFIG QUI VIENT DE LA BDD
//             // @ts-ignore
//             const savedConfig = res.data.config; 


//             setConfig((prev: {
//                 borderColor: any; phoneNumber: any; authNumber: any; directorName: any; schoolMotto: any; primaryColor: any; bgType: any; bgColor1: any; bgColor2: any; fontFamily: any; 
// }) => {
//                 // On prépare les valeurs.
//                 // Si savedConfig.phoneNumber existe (non vide), c'est LUI le chef.
//                 // Sinon, on prend prev.phoneNumber (ce qu'on vient de taper).
//                 // Sinon, on prend le téléphone par défaut de l'école.
                
//                 const finalPhone = savedConfig?.phoneNumber 
//                                    || prev.phoneNumber 
//                                    // @ts-ignore
//                                    || res.data.establishment.phone 
//                                    || "";

//                 const finalAuth = savedConfig?.authNumber 
//                                   || prev.authNumber 
//                                   // @ts-ignore
//                                   || res.data.establishment.authNumber 
//                                   || "";

//                 return { 
//                     ...prev,
//                     phoneNumber: savedConfig?.phoneNumber || prev.phoneNumber || "",
//                     authNumber: savedConfig?.authNumber || prev.authNumber || "",
                    
//                     directorName: savedConfig?.directorName || prev.directorName,
//                     schoolMotto: savedConfig?.schoolMotto || prev.schoolMotto,
//                     primaryColor: savedConfig?.primaryColor || prev.primaryColor,
//                     bgType: savedConfig?.bgType || prev.bgType,
//                     bgColor1: savedConfig?.bgColor1 || prev.bgColor1,
//                     bgColor2: savedConfig?.bgColor2 || prev.bgColor2,
//                     borderColor: savedConfig?.borderColor || prev.borderColor, // Important pour la bordure
//                     fontFamily: savedConfig?.fontFamily || prev.fontFamily,
//                 };
//             });

//         } catch (error: any) {
//             console.error(error);
//             if (error.response && error.response.status === 400 && error.response.data.code === 'MISSING_GRADES') {
//                 setMissingData(error.response.data.details);
//                 setShowMissingModal(true);
//             } else {
//                 alert("Erreur technique lors de la génération.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     }, [config]); // Dépend de config pour sauvegarder


    

//     // 4. CHARGEMENT INITIAL + GESTION URL
//     useEffect(() => {
//         const init = async () => {
//             const token = Cookies.get('token');
//             if (token) {
//                 // a. Charger la liste des classes
//                 const res = await listClasses(token);
//                 // @ts-ignore
//                 setClasses(res.data);

//                 // b. Si l'URL contient un ID (on vient des archives), on charge tout de suite
//                 if (classIdFromUrl) {
//                     setSelectedClass(classIdFromUrl);
//                     // On déclenche la génération automatiquement
//                     // Note: On appelle directement l'API ici ou via performGeneration
//                     // Pour éviter les soucis de dépendance useEffect, on peut le faire ici :
//                     performGeneration(classIdFromUrl);
//                 }
//             }
//         };
//         init();
//     }, [classIdFromUrl]); // On recharge si l'URL change

//     // Gestion du bouton "GO"
//     const handleGenerateClick = () => {
//         performGeneration(selectedClass);
//     };

//     // 5. FONCTION DE SAUVEGARDE CORRIGÉE
//     const handleSave = async () => {
//         if (bulletins.length === 0) return;
//         setLoading(true);
//         const token = Cookies.get('token');
        
//         const decisions = bulletins.map(b => ({
//             studentId: b.student.id,
//             decision: b.decision
//         }));
    
//         try {
//             await saveDecisions(selectedClass, "SEMESTRE_1", decisions, token!);
//             alert("Bulletins enregistrés avec succès !");
//             // CORRECTION ICI : Utilisation du router importé de next/navigation
//             router.push('/admin/bulletins/archives'); 
//         } catch (e) {
//             console.error(e);
//             alert("Erreur sauvegarde");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleDecision = (studentId: string, decision: string) => {
//         setBulletins(prev => prev.map(b => {
//             if (b.student.id === studentId) {
//                 return { ...b, decision: b.decision === decision ? "" : decision };
//             }
//             return b;
//         }));
//     };

//     // Calcul de la moyenne de classe globale pour l'affichage
//     const calculateClassGlobalAverage = () => {
//         if (bulletins.length === 0) return "-";
//         const total = bulletins.reduce((acc, b) => acc + parseFloat(b.summary.generalAverage), 0);
//         return (total / bulletins.length).toFixed(2);
//     };
//     const classGlobalAvg = calculateClassGlobalAverage();


//     return (
//         <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
            
//             {/* SIDEBAR */}
//             <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col h-full shadow-2xl z-20">
//                 <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
//                     <div>
//                         <h1 className="font-bold text-lg flex items-center gap-2 text-blue-400">
//                             <LayoutTemplate size={20} /> Bulletin Builder
//                         </h1>
//                     </div>
//                     {/* Bouton retour si on vient des archives */}
//                     {classIdFromUrl && (
//                         <button onClick={() => router.push('/admin/bulletins/archives')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
//                             <ArrowLeft size={12}/> Retour
//                         </button>
//                     )}
//                 </div>

//                 <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    
//                     {/* 1. SELECTION */}
//                     <div className="space-y-2">
//                         <label className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
//                             <CheckSquare size={14}/> 1. Classe
//                         </label>
//                         <div className="flex gap-2">
//                             <select 
//                                 className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
//                                 value={selectedClass}
//                                 onChange={(e) => setSelectedClass(e.target.value)}
//                             >
//                                 <option value="">-- Choisir --</option>
//                                 {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
//                             </select>
//                             <button 
//                                 onClick={handleGenerateClick}
//                                 disabled={loading || !selectedClass}
//                                 className="px-3 py-2 bg-blue-600 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
//                             >
//                                 {loading ? <Loader2 className="animate-spin" size={16}/> : "GO"}
//                             </button>
//                         </div>
//                     </div>

//                     <hr className="border-gray-700"/>

//                     {/* 2. DESIGN */}
//                     <div className="space-y-3">
//                         <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
//                             <Palette size={14}/> 2. Apparence
//                         </h3>
//                         <div className="grid grid-cols-2 gap-3">
//                             <div>
//                                 <label className="text-[10px] text-gray-400 block mb-1">Fond</label>
//                                 <select 
//                                     className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-xs"
//                                     value={config.bgType}
//                                     onChange={(e: any) => setConfig({...config, bgType: e.target.value})}
//                                 >
//                                     <option value="SOLID">Uni</option>
//                                     <option value="GRADIENT">Dégradé</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="text-[10px] text-gray-400 block mb-1">Couleur 1</label>
//                                 <input type="color" className="w-full h-6 cursor-pointer rounded bg-transparent" value={config.bgColor1} onChange={e => setConfig({...config, bgColor1: e.target.value})} />
//                             </div>
//                             <div>
//                                 <label className="text-[10px] text-gray-400 block mb-1">Bordures</label>
//                                 <input type="color" className="w-full h-6 cursor-pointer rounded bg-transparent" value={config.borderColor} onChange={e => setConfig({...config, borderColor: e.target.value})} />
//                             </div>
//                         </div>
//                     </div>

//                     <hr className="border-gray-700"/>

//                     {/* 3. DONNÉES MANUELLES */}
//                     <div className="space-y-3">
//                         <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
//                             <FileBadge size={14}/> 3. Données École
//                         </h3>
//                         <div className="space-y-2">
//                             <input type="text" className="w-full p-2 bg-gray-700 border-gray-600 rounded text-xs" value={config.authNumber} onChange={e => setConfig({...config, authNumber: e.target.value})} placeholder="Numéro AUT" />
//                             <input type="text" className="w-full p-2 bg-gray-700 border-gray-600 rounded text-xs" value={config.phoneNumber} onChange={e => setConfig({...config, phoneNumber: e.target.value})} placeholder="Téléphone" />
//                             <input type="text" className="w-full p-2 bg-gray-700 border-gray-600 rounded text-xs" value={config.directorName} onChange={e => setConfig({...config, directorName: e.target.value})} placeholder="Nom Directeur" />
//                         </div>
//                     </div>

//                     <hr className="border-gray-700"/>

//                     {/* 4. OPTIONS */}
//                     <div className="space-y-2">
//                         <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-700 p-2 rounded">
//                             <input type="checkbox" checked={config.showRank} onChange={e => setConfig({...config, showRank: e.target.checked})} className="rounded text-blue-500 bg-gray-700 border-gray-500"/>
//                             Afficher le Rang
//                         </label>
//                         <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-700 p-2 rounded">
//                             <input type="checkbox" checked={config.showDirectorSignature} onChange={e => setConfig({...config, showDirectorSignature: e.target.checked})} className="rounded text-blue-500 bg-gray-700 border-gray-500"/>
//                             Afficher le Cachet
//                         </label>
//                     </div>

//                 </div>

//                 <div className="p-4 border-t border-gray-700 bg-gray-800 space-y-3">
//                     <button 
//                         onClick={handleSave} 
//                         disabled={bulletins.length === 0}
//                         className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//                     >
//                         <Save size={18} /> ENREGISTRER
//                     </button>

//                     <button 
//                         onClick={() => handlePrint()} 
//                         disabled={bulletins.length === 0}
//                         className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 flex items-center justify-center gap-2"
//                     >
//                         <Printer size={18} /> IMPRIMER (PDF)
//                     </button>
//                 </div>
//             </div>

//             {/* APERÇU */}
//             <div className="flex-grow bg-gray-900 overflow-auto p-8 flex justify-center relative">
//                 <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none z-10">
//                     <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 border border-gray-700 flex items-center gap-2">
//                         <MousePointerClick size={14}/> Conseil : Cliquez sur "Avis du Conseil" sur les bulletins pour cocher les cases.
//                     </div>
//                 </div>

//                 {bulletins.length > 0 ? (
//                     <div className="space-y-8 pb-20 transform scale-[0.85] origin-top">
//                         <div ref={componentRef}>
//                             {bulletins.map((b, i) => (
//                                 <div key={i} className="print-break-inside-avoid mb-8 print:mb-0 shadow-2xl relative group">
//                                     <BulletinDocument 
//                                         data={b} 
//                                         config={config} 
//                                         establishment={establishment} 
//                                         // classStats={classStats}
//                                         classStats={{ ...classStats, average: classGlobalAvg }} 
//                                         onToggleDecision={toggleDecision}
//                                     />
//                                     <div className="absolute -right-12 top-0 text-gray-500 font-mono text-xs rotate-90 origin-top-left hidden md:block">
//                                         Page {i+1}
//                                     </div>
//                                     <div className="hidden print:block page-break" style={{ pageBreakAfter: 'always' }}></div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                         <LayoutTemplate size={64} className="mb-4 opacity-20"/>
//                         <p>Sélectionnez une classe à gauche pour commencer.</p>
//                     </div>
//                 )}
//             </div>

//             {/* --- MODAL D'ERREUR (POPUP NOTES MANQUANTES) --- */}
//             {showMissingModal && (
//                 <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//                     <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        
//                         {/* En-tête Rouge */}
//                         <div className="bg-red-600 text-white p-6 flex items-center gap-4">
//                             <div className="bg-white/20 p-3 rounded-full">
//                                 <AlertTriangle size={32} />
//                             </div>
//                             <div>
//                                 <h2 className="text-xl font-black uppercase">Génération Bloquée</h2>
//                                 <p className="text-red-100 text-sm">Le calcul des moyennes est impossible car des notes sont manquantes.</p>
//                             </div>
//                             <button onClick={() => setShowMissingModal(false)} className="ml-auto text-white/70 hover:text-white">
//                                 <XCircle size={28} />
//                             </button>
//                         </div>

//                         {/* Corps du message */}
//                         <div className="p-6">
//                             <p className="mb-4 text-gray-600">
//                                 Veuillez contacter les professeurs suivants pour qu'ils saisissent les évaluations manquantes avant de générer les bulletins :
//                             </p>

//                             <div className="overflow-y-auto max-h-60 border border-gray-200 rounded-xl">
//                                 <table className="w-full text-left text-sm">
//                                     <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
//                                         <tr>
//                                             <th className="p-3">Matière</th>
//                                             <th className="p-3">Professeur</th>
//                                             <th className="p-3 text-red-600">Notes Manquantes</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         {missingData.map((item, idx) => (
//                                             <tr key={idx} className="hover:bg-red-50 transition-colors">
//                                                 <td className="p-3 font-bold">{item.subject}</td>
//                                                 <td className="p-3">{item.teacher}</td>
//                                                 <td className="p-3">
//                                                     {item.missingTypes.map((type: string) => (
//                                                         <span key={type} className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold mr-1 border border-red-200">
//                                                             {type}
//                                                         </span>
//                                                     ))}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             <div className="mt-6 flex justify-end">
//                                 <button 
//                                     onClick={() => setShowMissingModal(false)}
//                                     className="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
//                                 >
//                                     Compris, je vais les relancer
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//         </div>
//     );
// }



"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Printer, Save, Palette, LayoutTemplate, 
    CheckSquare, MousePointerClick, Phone, FileBadge, 
    Loader2, AlertTriangle, XCircle, ArrowLeft
} from 'lucide-react';
import { listClasses, generateClassBulletins, saveBulletinConfig, saveDecisions } from '@/services/api';
import Cookies from 'js-cookie';

// --- INTERFACES ---

interface BuilderConfig {
    // Style Global
    bgType: 'SOLID' | 'GRADIENT';
    bgColor1: string;
    bgColor2: string;
    borderColor: string;
    fontFamily: string;
    fontSize: string;
    
    // En-tête
    showMinistereLogos: boolean;
    schoolNameSize: string;
    
    // Contenu
    showRank: boolean;
    showCoeff: boolean;
    showAppreciation: boolean;
    
    // Infos Manuelles
    authNumber: string;
    phoneNumber: string;
    
    // Pied de page
    directorName: string;
    showDirectorSignature: boolean;
    
    // Ajout pour compatibilité API
    primaryColor?: string;
    schoolMotto?: string;
}

// --- COMPOSANT TAMPON ---
const SchoolStamp = ({ schoolName, color }: { schoolName: string, color: string }) => (
    <div 
        className="absolute bottom-4 right-6 w-32 h-32 border-4 border-double rounded-full flex flex-col items-center justify-center text-center opacity-80 transform -rotate-12 pointer-events-none select-none"
        style={{ borderColor: color, color: color }}
    >
        <div className="text-[8px] font-bold uppercase tracking-widest mb-1">Rép. du Sénégal</div>
        <div className="w-24 h-[1px]" style={{ backgroundColor: color }}></div>
        <div className="font-black text-[10px] uppercase my-1 leading-tight px-2">
            {schoolName}
        </div>
        <div className="text-[8px] font-bold uppercase">Le Directeur</div>
        <div className="text-[8px] mt-1">★ Validé ★</div>
    </div>
);

// ============================================================================
//   LE DOCUMENT UNIQUE (BULLETIN)
// ============================================================================
const BulletinDocument = ({ data, config, establishment, classStats, onToggleDecision }: any) => {
    
    const backgroundStyle = config.bgType === 'SOLID' 
        ? { backgroundColor: config.bgColor1 }
        : { backgroundImage: `linear-gradient(135deg, ${config.bgColor1}, ${config.bgColor2})` };

    const themeColor = config.borderColor;

    return (
        <div 
            className="mx-auto relative overflow-hidden text-black print:w-full print:h-full page-break"
            style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                padding: '10mm', 
                fontFamily: config.fontFamily,
                fontSize: config.fontSize,
                ...backgroundStyle
            }}
        >
            {/* EN-TÊTE */}
            <div className="flex justify-between items-stretch mb-2 border-2 p-2 bg-white/50 backdrop-blur-sm" style={{ borderColor: themeColor }}>
                
                {/* GAUCHE */}
                <div className="w-1/3 text-center text-[10px] flex flex-col justify-center space-y-1 border-r border-dashed border-gray-300 pr-2">
                    {config.showMinistereLogos && <img src="/assets/mde.png" className="h-14 mx-auto opacity-90 mix-blend-multiply" alt="Logo Ministère" />}
                    <p className="font-bold">IA : DAKAR</p>
                    <p className="font-bold">IEF : RUFISQUE COMMUNE</p>
                    {config.authNumber && (
                         <p className="text-[9px] mt-1 font-mono bg-gray-100 rounded px-1 inline-block border border-gray-300">
                             AUT: {config.authNumber}
                         </p>
                    )}
                </div>

                {/* CENTRE */}
                <div className="w-1/3 text-center pt-1 px-2">
                    <p className="font-bold uppercase text-xs">République du Sénégal</p>
                    <p className="text-[8px] uppercase tracking-wider mb-2">Un Peuple - Un But - Une Foi</p>
                    <img src="/assets/sn.jpg" className="h-12 mx-auto shadow-sm border border-gray-200" alt="Drapeau Sénégal" />
                    <p className="font-bold uppercase text-[9px] mt-2 text-gray-600">Ministère de l'Éducation Nationale</p>
                </div>

                {/* DROITE */}
                <div className="w-1/3 text-center text-[10px] flex flex-col justify-center pl-2 border-l border-dashed border-gray-300">
                    <div className="border-b-2 pb-1 mb-1 mx-auto w-full" style={{ borderColor: themeColor }}>
                        <h2 className={`font-black uppercase ${config.schoolNameSize}`} style={{ color: themeColor, lineHeight: '1.1' }}>
                            {establishment.name || "NOM ÉTABLISSEMENT"}
                        </h2>
                    </div>
                    <div className="space-y-1">
                        <p className="italic leading-tight">{establishment.address || "Adresse de l'école"}</p>
                        <p className="font-bold flex justify-center items-center gap-1">
                            <Phone size={10}/> {config.phoneNumber || establishment.phone || "77 000 00 00"}
                        </p>
                        <p className="italic text-[9px] text-gray-500 bg-gray-100 px-1 rounded inline-block mt-1">
                            REF : {data.autReference || "..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* BANDEAU TITRE */}
            <div className="flex items-center mb-4 border-2 bg-white" style={{ borderColor: themeColor }}>
                <div className="bg-transparent px-4 py-2 flex-grow">
                    <h1 className="font-black text-xl underline decoration-2 uppercase tracking-wide">BULLETIN DE NOTES</h1>
                </div>
                <div className="text-white px-6 py-2 font-bold text-lg flex items-center gap-2" style={{ backgroundColor: themeColor }}>
                    <span className="text-2xl">1</span> <span className="text-sm align-top">ER</span> <span className="uppercase">Semestre</span>
                </div>
                <div className="px-4 py-2 border-l-2 font-bold bg-gray-50" style={{ borderColor: themeColor }}>
                    2024-2025
                </div>
            </div>

            {/* INFO ÉLÈVE */}
            <div className="flex mb-4 border-2 p-1 bg-white/80" style={{ borderColor: themeColor }}>
                <div className="w-2/3 border-r-2 pr-2 py-1 pl-2 space-y-2" style={{ borderColor: themeColor }}>
                    <div className="flex items-end">
                        <span className="font-bold w-32 underline decoration-gray-400">Elève :</span>
                        <span className="font-black text-lg uppercase">{data.student.firstName} {data.student.lastName}</span>
                    </div>
                    <div className="flex items-end text-sm">
                        <span className="font-bold w-32 underline decoration-gray-400">Date de Naiss :</span>
                        <span className="mr-6">{data.student.birthDate || "01/01/2005"}</span>
                        <span className="font-bold underline decoration-gray-400 mr-2">Lieu :</span>
                        <span>{data.student.birthPlace || "Dakar"}</span>
                    </div>
                    <div className="flex items-end text-sm">
                        <span className="font-bold w-32 underline decoration-gray-400">Matricule :</span>
                        <span className="font-mono bg-white px-2 border rounded">[ {data.student.id.slice(0,6).toUpperCase()} ]</span>
                    </div>
                </div>

                <div className="w-1/3 pl-3 py-1 flex flex-col justify-center">
                    <div className="border-b-2 pb-1 mb-2" style={{ borderColor: themeColor }}>
                        <span className="font-bold text-lg">Classe : </span>
                        <span className="font-black text-xl">{classStats.name || "..."}</span>
                    </div>
                    <div className="text-xs space-y-1 font-medium grid grid-cols-2">
                        <p>Total : <span className="font-bold">{classStats.total}</span></p>
                        <p>Garçons : <span className="font-bold">{classStats.boys}</span></p>
                        <p>Filles : <span className="font-bold">{classStats.girls}</span></p>
                    </div>
                </div>
            </div>

            {/* TABLEAU DES NOTES */}
            <table className="w-full border-collapse border-2 text-[11px] mb-2 bg-white" style={{ borderColor: themeColor }}>
                <thead>
                    <tr className="font-bold border-b-2 text-white" style={{ borderColor: themeColor, backgroundColor: themeColor }}>
                        <th className="border-r border-white/30 p-2 text-left uppercase w-1/4">Disciplines</th>
                        <th className="border-r border-white/30 p-1 w-12">Devoir</th>
                        <th className="border-r border-white/30 p-1 w-12">Compo</th>
                        <th className="border-r border-white/30 p-1 w-12 bg-white/10">Moy./20</th>
                        {config.showCoeff && <th className="border-r border-white/30 p-1 w-10">Coeff</th>}
                        <th className="border-r border-white/30 p-1 w-12 bg-white/20">Moy*Coef</th>
                        {config.showRank && <th className="border-r border-white/30 p-1 w-10">Rang</th>}
                        {config.showAppreciation && <th className="border-r border-white/30 p-2 text-left">Appréciations</th>}
                        <th className="p-2 text-left w-24">Professeurs</th>
                    </tr>
                </thead>
                <tbody>
                    {data.subjects.map((sub: any, idx: number) => (
                        <tr key={idx} className="border-b h-8 hover:bg-gray-50" style={{ borderColor: themeColor }}>
                            <td className="border-r pl-2 font-bold text-left" style={{ borderColor: themeColor }}>{sub.subject}</td>
                            <td className="border-r text-center" style={{ borderColor: themeColor }}>{sub.moyDevoirs}</td>
                            <td className="border-r text-center" style={{ borderColor: themeColor }}>{sub.noteCompo}</td>
                            <td className="border-r text-center font-bold bg-gray-50" style={{ borderColor: themeColor }}>{sub.moyenne}</td>
                            {config.showCoeff && <td className="border-r text-center" style={{ borderColor: themeColor }}>{sub.coefficient}</td>}
                            <td className="border-r text-center font-bold bg-gray-100" style={{ borderColor: themeColor }}>{sub.points}</td>
                            {config.showRank && <td className="border-r text-center text-[10px]" style={{ borderColor: themeColor }}>{sub.rank || "-"}</td>}
                            {config.showAppreciation && <td className="border-r pl-2 italic text-[10px]" style={{ borderColor: themeColor }}>{sub.appreciation}</td>}
                            <td className="pl-2 text-[9px] truncate">{sub.teacher}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold border-t-2" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>
                        <td className="border-r p-2 text-left" style={{ borderColor: themeColor }}>TOTAL :</td>
                        <td colSpan={3} className="border-r bg-gray-300" style={{ borderColor: themeColor }}></td>
                        {config.showCoeff && <td className="border-r text-center text-sm" style={{ borderColor: themeColor }}>{data.summary.totalCoefs}</td>}
                        <td className="border-r text-center text-sm" style={{ borderColor: themeColor }}>{data.summary.totalPoints}</td>
                        {config.showRank && <td className="border-r" style={{ borderColor: themeColor }}></td>}
                        {config.showAppreciation && <td className="border-r" style={{ borderColor: themeColor }}></td>}
                        <td className="text-center">0h</td>
                    </tr>
                    <tr className="font-bold border-t" style={{ borderColor: themeColor, backgroundColor: '#ffffff' }}>
                        <td className="border-r p-2 text-left uppercase" style={{ borderColor: themeColor }}>Moyenne :</td>
                        <td colSpan={3} className="border-r text-center text-xl font-black border-b-2" style={{ borderColor: themeColor }}>{data.summary.generalAverage}</td>
                        {config.showCoeff && <td className="border-r" style={{ borderColor: themeColor }}></td>}
                        <td className="border-r text-right pr-2 text-[10px]" style={{ borderColor: themeColor }}>Moy. Classe:</td>
                        <td className="border-r text-center font-bold" style={{ borderColor: themeColor }}>{classStats.average || "-"}</td>
                        {config.showAppreciation && <td className="border-r" style={{ borderColor: themeColor }}></td>}
                        <td className="text-right pr-2 text-[10px]">Retards: 0</td>
                    </tr>
                    {config.showRank && (
                        <tr className="border-t" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>
                            <td className="border-r p-2 font-bold" style={{ borderColor: themeColor }}>RANG</td>
                            <td colSpan={3} className="border-r text-center font-bold text-lg bg-white" style={{ borderColor: themeColor }}>{data.rank} <span className="text-xs align-top">ème</span></td>
                            <td colSpan={config.showAppreciation ? 6 : 5} className="bg-gray-300"></td>
                        </tr>
                    )}
                </tfoot>
            </table>

            {/* PIED DE PAGE */}
            <div className="flex gap-4 h-40">
                <div className="w-1/4 border-2 p-4 text-center flex flex-col justify-center items-center shadow-sm bg-white" style={{ borderColor: themeColor }}>
                    <p className="underline font-bold mb-2">Moy. 1er Sem :</p>
                    <p className="text-3xl font-black" style={{ color: themeColor }}>{data.summary.generalAverage}</p>
                </div>

                <div className="w-1/4">
                    <p className="font-bold mb-1 text-[10px]">Appréciation des Professeurs</p>
                    <div className="border-2 h-28 bg-white" style={{ borderColor: themeColor }}></div>
                </div>

                <div className="w-1/4 border-2 flex flex-col bg-white" style={{ borderColor: themeColor }}>
                    <div className="text-center font-bold border-b-2 py-1 text-xs uppercase" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>Avis du Conseil</div>
                    <div className="flex-grow flex flex-col justify-around p-2 text-xs font-bold">
                        {["Félicitations", "Encouragements", "Tableau d'Honneur", "Avertissement", "Blâme"].map((avis) => (
                            <div 
                                key={avis} 
                                className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
                                onClick={() => onToggleDecision && onToggleDecision(data.student.id, avis)}
                            >
                                <span>{avis}</span>
                                <div className={`w-3 h-3 border-2 flex items-center justify-center ${data.decision === avis ? 'bg-black' : 'bg-white'}`} style={{ borderColor: 'black' }}>
                                    {data.decision === avis && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-1/4 relative text-center">
                    <p className="text-[9px] italic mb-6">Fait à {establishment.address?.split(',')[0] || "Dakar"}, le {new Date().toLocaleDateString()}</p>
                    <p className="text-[10px] font-bold underline mb-10">Le Directeur</p>
                    <p className="text-[10px]">{config.directorName}</p>
                    
                    {config.showDirectorSignature && (
                        <SchoolStamp schoolName={establishment.name} color={themeColor} />
                    )}
                </div>
            </div>
            <div className="absolute bottom-2 left-0 w-full text-center text-[8px] text-gray-800">
                Document généré par PENI - Plateforme d'Éducation Numérique Intégrée
            </div>
        </div>
    );
};


// ============================================================================
//   PAGE BUILDER (CONTRÔLEUR)
// ============================================================================
export default function BulletinBuilderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const classIdFromUrl = searchParams.get('classId'); 

    // Config avec valeurs par défaut
    const [config, setConfig] = useState<BuilderConfig>({
        bgType: 'SOLID',
        bgColor1: '#fdfdfd',
        bgColor2: '#e6f0ff',
        borderColor: '#000000',
        fontFamily: 'ui-sans-serif',
        fontSize: '11px',
        showMinistereLogos: true,
        schoolNameSize: 'text-lg',
        showRank: true,
        showCoeff: true,
        showAppreciation: true,
        authNumber: "",
        phoneNumber: "",
        directorName: "M. Le Directeur",
        showDirectorSignature: true,
        primaryColor: '#000000' // synchro avec borderColor
    });

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [loading, setLoading] = useState(false);
    
    // États données
    const [bulletins, setBulletins] = useState<any[]>([]);
    const [establishment, setEstablishment] = useState<any>({});
    const [classStats, setClassStats] = useState<any>({});

    // États erreur
    const [missingData, setMissingData] = useState<any[]>([]);
    const [showMissingModal, setShowMissingModal] = useState(false);

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Bulletins_${selectedClass}`,
    });

    // 3. FONCTION DE GÉNÉRATION
    const performGeneration = useCallback(async (targetClassId: string) => {
        if (!targetClassId) return;
        setLoading(true);
        setMissingData([]);
        setShowMissingModal(false);

        const token = Cookies.get('token');
        try {
            // 1. Sauvegarde préventive
            await saveBulletinConfig({
                ...config,
                primaryColor: config.borderColor // On s'assure que primaryColor suit borderColor
            }, token!);

            // 2. Génération
            const res = await generateClassBulletins(targetClassId, token!);
            
            // @ts-ignore
            setBulletins(res.data.bulletins);
            // @ts-ignore
            setEstablishment(res.data.establishment);
            // @ts-ignore
            setClassStats(res.data.classStats);
            
            // 3. Chargement Config BDD
            // @ts-ignore
            const savedConfig = res.data.config; 

            if (savedConfig) {
                setConfig(prev => ({
                    ...prev,
                    phoneNumber: savedConfig.phoneNumber || prev.phoneNumber || "",
                    authNumber: savedConfig.authNumber || prev.authNumber || "",
                    directorName: savedConfig.directorName || prev.directorName,
                    schoolMotto: savedConfig.schoolMotto || prev.schoolMotto,
                    
                    // Style
                    bgType: savedConfig.bgType || prev.bgType,
                    bgColor1: savedConfig.bgColor1 || prev.bgColor1,
                    bgColor2: savedConfig.bgColor2 || prev.bgColor2,
                    borderColor: savedConfig.borderColor || prev.borderColor,
                    fontFamily: savedConfig.fontFamily || prev.fontFamily,
                    
                    // Options
                    showRank: savedConfig.showRank ?? prev.showRank,
                    showCoeff: savedConfig.showCoeff ?? prev.showCoeff,
                    showAppreciation: savedConfig.showAppreciation ?? prev.showAppreciation,
                    showDirectorSignature: savedConfig.showDirectorSignature ?? prev.showDirectorSignature,
                }));
            }

        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.status === 400 && error.response.data.code === 'MISSING_GRADES') {
                setMissingData(error.response.data.details);
                setShowMissingModal(true);
            } else {
                alert("Erreur technique lors de la génération.");
            }
        } finally {
            setLoading(false);
        }
    }, [config]); 


    // 4. CHARGEMENT INITIAL
    useEffect(() => {
        const init = async () => {
            const token = Cookies.get('token');
            if (token) {
                const res = await listClasses(token);
                // @ts-ignore
                setClasses(res.data);
                if (classIdFromUrl) {
                    setSelectedClass(classIdFromUrl);
                    performGeneration(classIdFromUrl);
                }
            }
        };
        init();
    }, [classIdFromUrl]);

    const handleGenerateClick = () => {
        performGeneration(selectedClass);
    };

    // 5. FONCTION DE SAUVEGARDE (CORRIGÉE : Sauvegarde Style + Décisions)
    const handleSave = async () => {
        if (bulletins.length === 0) return;
        setLoading(true);
        const token = Cookies.get('token');
        
        const decisions = bulletins.map(b => ({
            studentId: b.student.id,
            decision: b.decision
        }));
    
        try {
            // A. On sauvegarde d'abord la CONFIG VISUELLE (Couleurs, Numéros, etc.)
            await saveBulletinConfig({
                ...config,
                primaryColor: config.borderColor
            }, token!);

            // B. Ensuite on sauvegarde les DÉCISIONS
            await saveDecisions(selectedClass, "SEMESTRE_1", decisions, token!);
            
            alert("Configuration et Bulletins enregistrés avec succès !");
            router.push('/admin/bulletins/archives'); 
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };

    const toggleDecision = (studentId: string, decision: string) => {
        setBulletins(prev => prev.map(b => {
            if (b.student.id === studentId) {
                return { ...b, decision: b.decision === decision ? "" : decision };
            }
            return b;
        }));
    };

    const calculateClassGlobalAverage = () => {
        if (bulletins.length === 0) return "-";
        const total = bulletins.reduce((acc, b) => acc + parseFloat(b.summary.generalAverage), 0);
        return (total / bulletins.length).toFixed(2);
    };
    const classGlobalAvg = calculateClassGlobalAverage();


    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
            
            {/* SIDEBAR */}
            <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col h-full shadow-2xl z-20">
                <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-lg flex items-center gap-2 text-blue-400">
                            <LayoutTemplate size={20} /> Bulletin Builder
                        </h1>
                    </div>
                    {classIdFromUrl && (
                        <button onClick={() => router.push('/admin/bulletins/archives')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                            <ArrowLeft size={12}/> Retour
                        </button>
                    )}
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    
                    {/* 1. SELECTION */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                            <CheckSquare size={14}/> 1. Classe
                        </label>
                        <div className="flex gap-2">
                            <select 
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">-- Choisir --</option>
                                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button 
                                onClick={handleGenerateClick}
                                disabled={loading || !selectedClass}
                                className="px-3 py-2 bg-blue-600 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16}/> : "GO"}
                            </button>
                        </div>
                    </div>

                    <hr className="border-gray-700"/>

                    {/* 2. DESIGN */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                            <Palette size={14}/> 2. Apparence
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-gray-400 block mb-1">Fond</label>
                                <select 
                                    className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-xs"
                                    value={config.bgType}
                                    onChange={(e: any) => setConfig({...config, bgType: e.target.value})}
                                >
                                    <option value="SOLID">Uni</option>
                                    <option value="GRADIENT">Dégradé</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 block mb-1">Couleur 1</label>
                                <input type="color" className="w-full h-6 cursor-pointer rounded bg-transparent" value={config.bgColor1} onChange={e => setConfig({...config, bgColor1: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 block mb-1">Bordures</label>
                                <input type="color" className="w-full h-6 cursor-pointer rounded bg-transparent" value={config.borderColor} onChange={e => setConfig({...config, borderColor: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-700"/>

                    {/* 3. DONNÉES MANUELLES */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
                            <FileBadge size={14}/> 3. Données École
                        </h3>
                        <div className="space-y-2">
                            <input type="text" className="w-full p-2 bg-gray-700 border-gray-600 rounded text-xs" value={config.authNumber} onChange={e => setConfig({...config, authNumber: e.target.value})} placeholder="Numéro AUT" />
                            <input type="text" className="w-full p-2 bg-gray-700 border-gray-600 rounded text-xs" value={config.phoneNumber} onChange={e => setConfig({...config, phoneNumber: e.target.value})} placeholder="Téléphone" />
                            <input type="text" className="w-full p-2 bg-gray-700 border-gray-600 rounded text-xs" value={config.directorName} onChange={e => setConfig({...config, directorName: e.target.value})} placeholder="Nom Directeur" />
                        </div>
                    </div>

                    <hr className="border-gray-700"/>

                    {/* 4. OPTIONS */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-700 p-2 rounded">
                            <input type="checkbox" checked={config.showRank} onChange={e => setConfig({...config, showRank: e.target.checked})} className="rounded text-blue-500 bg-gray-700 border-gray-500"/>
                            Afficher le Rang
                        </label>
                        <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-700 p-2 rounded">
                            <input type="checkbox" checked={config.showDirectorSignature} onChange={e => setConfig({...config, showDirectorSignature: e.target.checked})} className="rounded text-blue-500 bg-gray-700 border-gray-500"/>
                            Afficher le Cachet
                        </label>
                        <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-700 p-2 rounded">
                            <input type="checkbox" checked={config.showCoeff} onChange={e => setConfig({...config, showCoeff: e.target.checked})} className="rounded text-blue-500 bg-gray-700 border-gray-500"/>
                            Afficher Coefficients
                        </label>
                        <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-700 p-2 rounded">
                            <input type="checkbox" checked={config.showAppreciation} onChange={e => setConfig({...config, showAppreciation: e.target.checked})} className="rounded text-blue-500 bg-gray-700 border-gray-500"/>
                            Afficher Appréciations
                        </label>
                    </div>

                </div>

                <div className="p-4 border-t border-gray-700 bg-gray-800 space-y-3">
                    <button 
                        onClick={handleSave} 
                        disabled={bulletins.length === 0}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> ENREGISTRER
                    </button>

                    <button 
                        onClick={() => handlePrint()} 
                        disabled={bulletins.length === 0}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                        <Printer size={18} /> IMPRIMER (PDF)
                    </button>
                </div>
            </div>

            {/* APERÇU */}
            <div className="flex-grow bg-gray-900 overflow-auto p-8 flex justify-center relative">
                <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none z-10">
                    <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-300 border border-gray-700 flex items-center gap-2">
                        <MousePointerClick size={14}/> Conseil : Cliquez sur "Avis du Conseil" sur les bulletins pour cocher les cases.
                    </div>
                </div>

                {bulletins.length > 0 ? (
                    <div className="space-y-8 pb-20 transform scale-[0.85] origin-top">
                        <div ref={componentRef}>
                            {bulletins.map((b, i) => (
                                <div key={i} className="print-break-inside-avoid mb-8 print:mb-0 shadow-2xl relative group">
                                    <BulletinDocument 
                                        data={b} 
                                        config={config} 
                                        establishment={establishment} 
                                        // classStats={classStats}
                                        classStats={{ ...classStats, average: classGlobalAvg }} 
                                        onToggleDecision={toggleDecision}
                                    />
                                    <div className="absolute -right-12 top-0 text-gray-500 font-mono text-xs rotate-90 origin-top-left hidden md:block">
                                        Page {i+1}
                                    </div>
                                    <div className="hidden print:block page-break" style={{ pageBreakAfter: 'always' }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <LayoutTemplate size={64} className="mb-4 opacity-20"/>
                        <p>Sélectionnez une classe à gauche pour commencer.</p>
                    </div>
                )}
            </div>

            {/* --- MODAL D'ERREUR --- */}
            {showMissingModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        
                        <div className="bg-red-600 text-white p-6 flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase">Génération Bloquée</h2>
                                <p className="text-red-100 text-sm">Le calcul des moyennes est impossible car des notes sont manquantes.</p>
                            </div>
                            <button onClick={() => setShowMissingModal(false)} className="ml-auto text-white/70 hover:text-white">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="mb-4 text-gray-600">
                                Veuillez contacter les professeurs suivants :
                            </p>

                            <div className="overflow-y-auto max-h-60 border border-gray-200 rounded-xl">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-3">Matière</th>
                                            <th className="p-3">Professeur</th>
                                            <th className="p-3 text-red-600">Notes Manquantes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {missingData.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-red-50 transition-colors">
                                                <td className="p-3 font-bold">{item.subject}</td>
                                                <td className="p-3">{item.teacher}</td>
                                                <td className="p-3">
                                                    {item.missingTypes.map((type: string) => (
                                                        <span key={type} className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold mr-1 border border-red-200">
                                                            {type}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={() => setShowMissingModal(false)}
                                    className="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Compris
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}