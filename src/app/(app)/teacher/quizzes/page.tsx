// // (app)/teacher/quizzes/page.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { Send, Loader2, BookOpen, Users } from 'lucide-react';
// import { getTeacherQuizzes, getMyClasses, assignQuizToClass, Quiz } from '@/services/api'; // Import depuis api.ts

// // On définit un petit type pour les classes ici si ce n'est pas importé
// interface SimpleClass {
//     id: string;
//     name: string;
// }

// export default function TeacherQuizzesPage() {
//     // On dit à TypeScript : "quizzes est un tableau de Quiz"
//     const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//     const [classes, setClasses] = useState<SimpleClass[]>([]); 
//     const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             const token = Cookies.get('token');
//             if(!token) return;

//             try {
//                 // On utilise Promise.all pour charger les deux en même temps
//                 const [quizzesRes, classesRes] = await Promise.all([
//                     getTeacherQuizzes(token),
//                     getMyClasses(token)
//                 ]);

//                 setQuizzes(quizzesRes.data);
//                 // @ts-ignore (Parfois le format des classes varie, on force un peu ici si besoin)
//                 setClasses(classesRes.data);
//             } catch (error) {
//                 console.error("Erreur chargement", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleAssign = async (classId: string) => {
//         const token = Cookies.get('token');
//         if (!token || !selectedQuiz) return;

//         try {
//             await assignQuizToClass(selectedQuiz, classId, token);
//             alert("Quiz envoyé aux élèves avec succès !");
//             setSelectedQuiz(null);
//         } catch (error) {
//             alert("Erreur lors de l'envoi.");
//         }
//     };

//     if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-blue-600"/></div>;

//     return (
//         <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-surface min-h-screen">
//             <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
//                 <BookOpen className="text-blue-600"/> Mes Quiz Enregistrés
//             </h1>
            
//             {quizzes.length === 0 ? (
//                 <p className="text-center text-gray-500">Vous n'avez pas encore créé de quiz avec l'IA.</p>
//             ) : (
//                 <div className="grid gap-4">
//                     {quizzes.map(quiz => (
//                         <div key={quiz.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                             <div>
//                                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">{quiz.title}</h3>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                                     <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold mr-2">{quiz.subject}</span>
//                                     {quiz.level} • {quiz._count?.questions || 0} questions
//                                 </p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button 
//                                     onClick={() => setSelectedQuiz(quiz.id)} 
//                                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
//                                 >
//                                     <Send size={16}/> Envoyer aux élèves
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Modal d'envoi */}
//             {selectedQuiz && (
//                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedQuiz(null)}>
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
//                         <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
//                             <Users size={20} className="text-blue-500"/> Choisir la classe
//                         </h3>
//                         <div className="space-y-3 max-h-60 overflow-y-auto">
//                             {classes.map(cls => (
//                                 <button 
//                                     key={cls.id} 
//                                     onClick={() => handleAssign(cls.id)} 
//                                     className="w-full p-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors text-gray-700 dark:text-gray-200 font-medium"
//                                 >
//                                     {cls.name}
//                                 </button>
//                             ))}
//                         </div>
//                         <button 
//                             onClick={() => setSelectedQuiz(null)} 
//                             className="mt-6 w-full py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
//                         >
//                             Annuler
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


// (app)/teacher/quizzes/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Send, Loader2, BookOpen, Users, BarChart3, Clock, Calendar, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
// Assure-toi d'avoir ajouté getTeacherAssignments dans api.ts
import { getTeacherQuizzes, getMyClasses, assignQuizToClass, getTeacherAssignments, Quiz, QuizAssignmentSummary } from '@/services/api'; 

dayjs.extend(relativeTime);
dayjs.locale('fr');

interface SimpleClass { id: string; name: string; }

export default function TeacherQuizzesPage() {
    const router = useRouter();
    
    // États
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [assignments, setAssignments] = useState<QuizAssignmentSummary[]>([]); // Nouvel état
    const [classes, setClasses] = useState<SimpleClass[]>([]); 
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'library' | 'history'>('library'); // Onglets pour organiser

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            if(!token) return;

            try {
                const [quizzesRes, classesRes, assignmentsRes] = await Promise.all([
                    getTeacherQuizzes(token),
                    getMyClasses(token),
                    getTeacherAssignments(token) // On charge l'historique
                ]);

                setQuizzes(quizzesRes.data);
                // @ts-ignore
                setClasses(classesRes.data);
                setAssignments(assignmentsRes.data);
            } catch (error) {
                console.error("Erreur chargement", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (classId: string) => {
        const token = Cookies.get('token');
        if (!token || !selectedQuiz) return;
        try {
            await assignQuizToClass(selectedQuiz, classId, token);
            alert("Quiz envoyé aux élèves avec succès !");
            setSelectedQuiz(null);
            // Recharger l'historique après envoi
            const res = await getTeacherAssignments(token);
            setAssignments(res.data);
            setActiveTab('history'); // Basculer vers l'historique pour voir le résultat
        } catch (error) {
            alert("Erreur lors de l'envoi.");
        }
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-blue-600"/></div>;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-[--background] min-h-screen">
            
            {/* EN-TÊTE ET ONGLETS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <BookOpen className="text-blue-600"/> Gestion des Devoirs
                </h1>
                
                <div className="bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 flex">
                    <button 
                        onClick={() => setActiveTab('library')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'library' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        Mes Quiz ({quizzes.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        Historique des Envois ({assignments.length})
                    </button>
                </div>
            </div>
            
            {/* CONTENU : BIBLIOTHÈQUE DE QUIZ */}
            {activeTab === 'library' && (
                <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {quizzes.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">Vous n'avez pas encore créé de quiz.</p>
                    ) : (
                        quizzes.map(quiz => (
                            <div key={quiz.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{quiz.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{quiz.subject}</span>
                                        <span>{quiz.level}</span>
                                        <span>• {quiz._count?.questions || 0} questions</span>
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedQuiz(quiz.id)} 
                                    className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-blue-500/20"
                                >
                                    <Send size={16}/> Envoyer
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* CONTENU : HISTORIQUE DES ENVOIS (Avec le bouton Voir Résultats) */}
            {activeTab === 'history' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {assignments.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                            <p className="text-gray-500">Aucun devoir envoyé pour le moment.</p>
                        </div>
                    ) : (
                        assignments.map(assign => (
                            <div key={assign.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6 group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{assign.quiz.title}</h3>
                                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                                            {assign.class.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14}/> {dayjs(assign.createdAt).fromNow()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={14}/> {assign._count.submissions} copies rendues
                                        </span>
                                    </div>
                                </div>

                                {/* LE BOUTON COMPLET QUE TU VOULAIS */}
                                <button 
                                    onClick={() => router.push(`/teacher/quizzes/results/${assign.id}`)}
                                    className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group-hover:border-blue-400 shadow-sm"
                                >
                                    <BarChart3 size={18} />
                                    Voir Résultats
                                    <ChevronRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform"/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal d'envoi (inchangé) */}
            {selectedQuiz && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedQuiz(null)}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                            <Users size={20} className="text-blue-500"/> Choisir la classe
                        </h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {classes.map(cls => (
                                <button 
                                    key={cls.id} 
                                    onClick={() => handleAssign(cls.id)} 
                                    className="w-full p-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors text-gray-700 dark:text-gray-200 font-medium"
                                >
                                    {cls.name}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => setSelectedQuiz(null)} 
                            className="mt-6 w-full py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}