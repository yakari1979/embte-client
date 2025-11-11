// "use client";

// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { getMyCourseDetails, MyCourseDetailsResponse, Classmate, SessionWithResources } from '@/services/api';
// import { Loader2, AlertCircle, Users, Book, Clock, Link as LinkIcon, ChevronDown } from 'lucide-react';

// // --- TABLEAU DE L'EMPLOI DU TEMPS ---
// const ScheduleTable: React.FC<{ sessions: SessionWithResources[] }> = ({ sessions }) => {
//     const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
//     const dayTranslations: Record<string, string> = { MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi", THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche" };
    
//     // Créer une palette de couleurs pour les matières
//     const subjectColors: Record<string, string> = {};
//     const colors = ['bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300', 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300', 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'];
//     let colorIndex = 0;
//     sessions.forEach(session => {
//         if (!subjectColors[session.subject]) {
//             subjectColors[session.subject] = colors[colorIndex % colors.length];
//             colorIndex++;
//         }
//     });

//     return (
//         <div className="bg-surface rounded-lg shadow-md overflow-hidden">
//             <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                     <thead className="bg-gray-50 dark:bg-gray-800">
//                         <tr>
//                             {dayOrder.map(day => <th key={day} className="py-3 px-2 text-center text-xs font-semibold uppercase">{dayTranslations[day]}</th>)}
//                         </tr>
//                     </thead>
//                     <tbody className="divide-x divide-gray-200 dark:divide-gray-700">
//                         {/* C'est une simplification, un vrai calendrier serait plus complexe. On affiche par créneau. */}
//                         <tr className="divide-x divide-gray-200 dark:divide-gray-700">
//                             {dayOrder.map(day => (
//                                 <td key={day} className="p-2 align-top w-[14.28%]">
//                                     <div className="space-y-2">
//                                         {sessions.filter(s => s.dayOfWeek === day).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(session => (
//                                             <div key={session.id} className={`p-2 rounded-lg text-xs ${subjectColors[session.subject]}`}>
//                                                 <p className="font-bold">{session.subject}</p>
//                                                 <p className="flex items-center"><Clock size={12} className="mr-1"/>{session.startTime} - {session.endTime}</p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </td>
//                             ))}
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // --- SECTION DÉPLIABLE POUR UNE MATIÈRE ---
// const CourseAccordion: React.FC<{ subject: string; sessions: SessionWithResources[]; classmates: Classmate[] }> = ({ subject, sessions, classmates }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const teacher = sessions[0]?.teacher;
//     const resources = sessions.flatMap(s => s.resources);
    
//     return (
//         <div className="bg-surface rounded-lg shadow-md">
//             <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
//                 <h3 className="text-xl font-bold text-primary flex items-center"><Book className="mr-3"/>{subject}</h3>
//                 <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//             </button>
//             {isOpen && (
//                 <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <h4 className="font-semibold mb-2">Informations Clés</h4>
//                             <p><strong>Professeur :</strong> {teacher.firstName} {teacher.lastName}</p>
//                             <p><strong>Camarades :</strong> {classmates.length} élèves</p>
//                             {/* On pourrait ajouter un modal ici pour afficher la liste des camarades */}
//                         </div>
//                         <div>
//                             <h4 className="font-semibold mb-2">Ressources du Cours</h4>
//                             {resources.length > 0 ? (
//                                 <ul className="space-y-2">
//                                     {resources.map(res => (
//                                         <li key={res.id}>
//                                             <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
//                                                 <LinkIcon size={14} className="mr-2"/>{res.name}
//                                             </a>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : <p className="italic text-sm text-text-subtle">Aucune ressource partagée.</p>}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };


// // --- COMPOSANT PRINCIPAL DE LA PAGE ---
// const MyCoursesPage = () => {
//     const [details, setDetails] = useState<MyCourseDetailsResponse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             const token = Cookies.get('token');
//             if (!token) { setError("Authentification requise."); setLoading(false); return; }
//             try {
//                 const response = await getMyCourseDetails(token);
//                 setDetails(response.data);
//             } catch (err) {
//                 setError("Impossible de charger les détails de vos cours.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     // Grouper les sessions par matière
//     const coursesBySubject = details?.schedule?.sessions.reduce((acc, session) => {
//         const subject = session.subject;
//         if (!acc[subject]) acc[subject] = [];
//         acc[subject].push(session);
//         return acc;
//     }, {} as Record<string, SessionWithResources[]>) || {};

//     if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
//     if (error) return <div className="container mx-auto p-4"><div className="bg-red-100 border-red-400 text-red-700 p-3 rounded"><strong className="font-bold"><AlertCircle className="inline mr-2"/>Erreur:</strong> {error}</div></div>;

//     return (
//         <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
//             <h1 className="text-3xl font-bold">Mes Cours - {details?.name}</h1>
            
//             <div>
//                 <h2 className="text-2xl font-semibold mb-4">Emploi du Temps Hebdomadaire</h2>
//                 {details?.schedule ? <ScheduleTable sessions={details.schedule.sessions} /> : <p>Emploi du temps non disponible.</p>}
//             </div>

//             <div>
//                 <h2 className="text-2xl font-semibold mb-4">Détails par Matière</h2>
//                 <div className="space-y-4">
//                     {Object.entries(coursesBySubject).map(([subject, sessions]) => (
//                         <CourseAccordion key={subject} subject={subject} sessions={sessions} classmates={details?.classmates || []} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyCoursesPage;






"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMyCourseDetails, MyCourseDetailsResponse, Classmate, SessionWithResources } from '@/services/api';
import { Loader2, AlertCircle, Users, Book, Clock, Link as LinkIcon, ChevronDown, UserCircle } from 'lucide-react';

// =======================================================
//   SOUS-COMPOSANTS (ILS RESTENT PRESQUE LES MÊMES)
// =======================================================

const ScheduleTable: React.FC<{ sessions: SessionWithResources[] }> = ({ sessions }) => {
    // ... (Le code de ce composant ne change pas)
    const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    const dayTranslations: Record<string, string> = { MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi", THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche" };
    const subjectColors: Record<string, string> = {};
    const colors = ['bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300', 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300', 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'];
    let colorIndex = 0;
    sessions.forEach(session => {
        if (!subjectColors[session.subject]) {
            subjectColors[session.subject] = colors[colorIndex % colors.length];
            colorIndex++;
        }
    });
    return (
        <div className="bg-surface rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800"><tr>{dayOrder.map(day => <th key={day} className="py-3 px-2 text-center text-xs font-semibold uppercase">{dayTranslations[day]}</th>)}</tr></thead>
                    <tbody className="divide-x divide-gray-200 dark:divide-gray-700"><tr className="divide-x divide-gray-200 dark:divide-gray-700">{dayOrder.map(day => (<td key={day} className="p-2 align-top w-[14.28%]"><div className="space-y-2">{sessions.filter(s => s.dayOfWeek === day).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(session => (<div key={session.id} className={`p-2 rounded-lg text-xs ${subjectColors[session.subject]}`}><p className="font-bold">{session.subject}</p><p className="flex items-center"><Clock size={12} className="mr-1"/>{session.startTime} - {session.endTime}</p></div>))}</div></td>))}</tr></tbody>
                </table>
            </div>
        </div>
    );
};

const CourseAccordion: React.FC<{ subject: string; sessions: SessionWithResources[]; }> = ({ subject, sessions }) => {
    // On retire la logique des camarades d'ici, elle sera dans sa propre carte
    const [isOpen, setIsOpen] = useState(false);
    const teacher = sessions[0]?.teacher;
    const resources = sessions.flatMap(s => s.resources);
    return (
        <div className="bg-surface rounded-lg shadow-md">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left"><h3 className="text-xl font-bold text-primary flex items-center"><Book className="mr-3"/>{subject}</h3><ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
            {isOpen && (<div className="p-4 border-t border-gray-200 dark:border-gray-700"><div><h4 className="font-semibold mb-2">Ressources du Cours</h4>{resources.length > 0 ? (<ul className="space-y-2">{resources.map(res => (<li key={res.id}><a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center"><LinkIcon size={14} className="mr-2"/>{res.name}</a></li>))}</ul>) : <p className="italic text-sm text-text-subtle">Aucune ressource partagée.</p>}</div></div>)}
        </div>
    );
};

// =======================================================
//   NOUVEAU COMPOSANT : CARTE DES CAMARADES DE CLASSE
// =======================================================
const ClassmatesCard: React.FC<{ classmates: Classmate[] }> = ({ classmates }) => {
    return (
        <div className="bg-surface rounded-lg shadow-md sticky top-24"> {/* sticky top-24 pour qu'elle suive le scroll */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold flex items-center">
                    <Users className="mr-2"/>
                    Mes Camarades de Classe 
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {classmates.length}
                    </span>
                </h3>
            </div>
            {/* Zone avec défilement interne */}
            <div className="max-h-96 overflow-y-auto p-4">
                <ul className="space-y-3">
                    {classmates.map(classmate => (
                        <li key={classmate.id} className="flex items-center gap-3">
                            <UserCircle className="h-8 w-8 text-gray-400 flex-shrink-0" />
                            <p className="font-medium text-sm">{classmate.firstName} {classmate.lastName}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// =======================================================
//   COMPOSANT PRINCIPAL DE LA PAGE (MODIFIÉ)
// =======================================================
const MyCoursesPage = () => {
    const [details, setDetails] = useState<MyCourseDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) { setError("Authentification requise."); setLoading(false); return; }
            try {
                const response = await getMyCourseDetails(token);
                setDetails(response.data);
            } catch (err) {
                setError("Impossible de charger les détails de vos cours.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const coursesBySubject = details?.schedule?.sessions.reduce((acc, session) => {
        const subject = session.subject;
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(session);
        return acc;
    }, {} as Record<string, SessionWithResources[]>) || {};

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (error) return <div className="container mx-auto p-4"><div className="bg-red-100 border-red-400 text-red-700 p-3 rounded"><strong className="font-bold"><AlertCircle className="inline mr-2"/>Erreur:</strong> {error}</div></div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-8">Mes Cours - {details?.name}</h1>
            
            {/* --- NOUVELLE STRUCTURE EN GRILLE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Colonne Principale (Gauche) --- */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Emploi du Temps Hebdomadaire</h2>
                        {details?.schedule ? <ScheduleTable sessions={details.schedule.sessions} /> : <p>Emploi du temps non disponible.</p>}
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Détails par Matière</h2>
                        <div className="space-y-4">
                            {Object.entries(coursesBySubject).map(([subject, sessions]) => (
                                <CourseAccordion key={subject} subject={subject} sessions={sessions} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Colonne Latérale (Droite) --- */}
                <div className="lg:col-span-1">
                    {details?.classmates && <ClassmatesCard classmates={details.classmates} />}
                </div>
            </div>
        </div>
    );
};

export default MyCoursesPage;