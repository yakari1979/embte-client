"use client";
import { Phone } from "lucide-react";
import React from "react";

interface BulletinProps {
    data: any;
    config: any;
    establishment: any;
    classStats: any;
    onToggleDecision?: (studentId: string, decision: string) => void;
}

const SchoolStamp = ({ schoolName, color }: { schoolName: string, color: string }) => (
    <div className="absolute bottom-4 right-6 w-32 h-32 border-4 border-double rounded-full flex flex-col items-center justify-center text-center opacity-80 transform -rotate-12 pointer-events-none select-none"
        style={{ borderColor: color, color: color }}>
        <div className="text-[8px] font-bold uppercase tracking-widest mb-1">Rép. du Sénégal</div>
        <div className="w-24 h-[1px]" style={{ backgroundColor: color }}></div>
        <div className="font-black text-[10px] uppercase my-1 leading-tight px-2">{schoolName}</div>
        <div className="text-[8px] font-bold uppercase">Le Directeur</div>
        <div className="text-[8px] mt-1">★ Validé ★</div>
    </div>
);

export default function BulletinDocument({
    data,
    config,
    establishment,
    classStats,
    onToggleDecision
}: BulletinProps) {

    const backgroundStyle =
        config.bgType === "SOLID"
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
            {/* --- 1. EN-TÊTE CORRIGÉ (GAUCHE - MILIEU - DROITE) --- */}
            <div className="flex justify-between items-stretch mb-2 border-2 p-2 bg-white/50 backdrop-blur-sm" style={{ borderColor: themeColor }}>
                
                {/* GAUCHE : MINISTÈRE & INSPECTION */}
                <div className="w-1/3 text-center text-[10px] flex flex-col justify-center space-y-1 border-r border-dashed border-gray-300 pr-2">
                    <img src="/assets/mde.png" className="h-14 mx-auto opacity-90 mix-blend-multiply" alt="Logo Ministère" />
                    <p className="font-bold">IA : DAKAR</p>
                    <p className="font-bold">IEF : RUFISQUE COMMUNE</p>
                </div>

                {/* CENTRE : RÉPUBLIQUE & DRAPEAU */}
                <div className="w-1/3 text-center pt-1 px-2">
                    <p className="font-bold uppercase text-xs">République du Sénégal</p>
                    <p className="text-[8px] uppercase tracking-wider mb-2">Un Peuple - Un But - Une Foi</p>
                    
                    {/* DRAPEAU AU MILIEU */}
                    <img src="/assets/sn.jpg" className="h-12 mx-auto shadow-sm border border-gray-200" alt="Drapeau Sénégal" />
                    
                    <p className="font-bold uppercase text-[9px] mt-2 text-gray-600">Ministère de l'Éducation Nationale</p>
                </div>

                {/* DROITE : ÉTABLISSEMENT (Sans espace excessif à droite) */}
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
                        <p className="italic text-[9px] text-gray-500">
                            AUT N° : {config.authNumber || establishment.authNumber || "..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- 2. BANDEAU TITRE --- */}
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

            {/* --- 3. INFORMATIONS ÉLÈVE --- */}
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
                        <p></p>
                        <p>Garçons : <span className="font-bold">{classStats.boys}</span></p>
                        <p>Filles : <span className="font-bold">{classStats.girls}</span></p>
                    </div>
                </div>
            </div>

            {/* --- 4. TABLEAU DES NOTES --- */}
            <table className="w-full border-collapse border-2 text-[11px] mb-2 bg-white" style={{ borderColor: themeColor }}>
                <thead>
                    <tr className="font-bold border-b-2 text-white" style={{ borderColor: themeColor, backgroundColor: themeColor }}>
                        <th className="border-r border-white/30 p-2 text-left uppercase w-1/4">Disciplines</th>
                        <th className="border-r border-white/30 p-1 w-12">Devoir</th>
                        <th className="border-r border-white/30 p-1 w-12">Compo</th>
                        <th className="border-r border-white/30 p-1 w-12 bg-white/10">Moy./20</th>
                        <th className="border-r border-white/30 p-1 w-10">Coeff</th>
                        <th className="border-r border-white/30 p-1 w-12 bg-white/20">Moy*Coef</th>
                        {config.showRank && <th className="border-r border-white/30 p-1 w-10">Rang</th>}
                        <th className="border-r border-white/30 p-2 text-left">Appréciations</th>
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
                            <td className="border-r text-center" style={{ borderColor: themeColor }}>{sub.coefficient}</td>
                            <td className="border-r text-center font-bold bg-gray-100" style={{ borderColor: themeColor }}>{sub.points}</td>
                            {config.showRank && <td className="border-r text-center text-[10px]" style={{ borderColor: themeColor }}>{sub.rank || "-"}</td>}
                            <td className="border-r pl-2 italic text-[10px]" style={{ borderColor: themeColor }}>{sub.appreciation}</td>
                            <td className="pl-2 text-[9px] truncate">{sub.teacher}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold border-t-2" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>
                        <td className="border-r p-2 text-left" style={{ borderColor: themeColor }}>TOTAL :</td>
                        <td colSpan={3} className="border-r bg-gray-300" style={{ borderColor: themeColor }}></td>
                        <td className="border-r text-center text-sm" style={{ borderColor: themeColor }}>{data.summary.totalCoefs}</td>
                        <td className="border-r text-center text-sm" style={{ borderColor: themeColor }}>{data.summary.totalPoints}</td>
                        {config.showRank && <td className="border-r" style={{ borderColor: themeColor }}></td>}
                        <td className="border-r text-right pr-2" style={{ borderColor: themeColor }}>Absences :</td>
                        <td className="text-center">0h</td>
                    </tr>
                    <tr className="font-bold border-t" style={{ borderColor: themeColor, backgroundColor: '#ffffff' }}>
                        <td className="border-r p-2 text-left uppercase" style={{ borderColor: themeColor }}>Moyenne :</td>
                        <td colSpan={3} className="border-r text-center text-xl font-black border-b-2" style={{ borderColor: themeColor }}>{data.summary.generalAverage}</td>
                        <td colSpan={2} className="border-r text-right pr-2" style={{ borderColor: themeColor }}>Moy. Classe :</td>
                        {/* --- CORRECTION ICI : ON AFFICHE LA VARIABLE classStats.average --- */}
                        <td className="border-r text-left pl-2 font-bold" style={{ borderColor: themeColor }}>
                            {classStats.average || "-"}
                        </td>
                        {config.showRank && <td className="border-r" style={{ borderColor: themeColor }}></td>}
                        {/* <td className="border-r text-left pl-2" style={{ borderColor: themeColor }}>-</td> */}
                        <td className="text-right pr-2">Retards : 0</td>
                    </tr>
                    {config.showRank && (
                        <tr className="border-t" style={{ borderColor: themeColor, backgroundColor: config.bgColor2 }}>
                            <td className="border-r p-2 font-bold" style={{ borderColor: themeColor }}>RANG</td>
                            <td colSpan={3} className="border-r text-center font-bold text-lg bg-white" style={{ borderColor: themeColor }}>{data.rank} <span className="text-xs align-top">ème</span></td>
                            <td colSpan={7} className="bg-gray-300"></td>
                        </tr>
                    )}
                </tfoot>
            </table>

            {/* --- 5. PIED DE PAGE --- */}
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
            {/* Pied de page */}
            <div className="absolute bottom-2 left-0 w-full text-center text-[8px] text-gray-800">
                Document généré par PENI - Plateforme d'Éducation Numérique Intégrée
            </div>
        </div>
    );
}
