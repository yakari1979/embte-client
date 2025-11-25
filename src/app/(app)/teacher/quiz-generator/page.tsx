// // (app)/teacher/quiz-generator/page.tsx

// "use client";

// import React, { useState } from 'react';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import { Loader2, Sparkles, Save, CheckCircle, BookOpen, GraduationCap, BrainCircuit } from 'lucide-react';
// // Ajoute ça dans tes imports en haut
// import Link from 'next/link';
// import { LayoutList } from 'lucide-react';

// const MATIERES = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie"];
// const NIVEAUX = ["Terminale S2", "Terminale L2", "Première S", "Première L", "Seconde S", "Seconde L"];

// interface Question {
//     text: string;
//     options: string[];
//     correctAnswer: string;
// }

// interface GeneratedQuiz {
//     title: string;
//     questions: Question[];
// }

// export default function QuizGeneratorPage() {
//     // États du formulaire
//     const [subject, setSubject] = useState(MATIERES[0]);
//     const [level, setLevel] = useState(NIVEAUX[0]);
//     const [topic, setTopic] = useState("");
//     const [count, setCount] = useState(5);

//     // États de l'application
//     const [loading, setLoading] = useState(false);
//     const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
//     const [saving, setSaving] = useState(false);
//     const [saved, setSaved] = useState(false);

//     const handleGenerate = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!topic.trim()) return;

//         setLoading(true);
//         setQuiz(null);
//         setSaved(false);

//         const token = Cookies.get('token');

//         try {
//             const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/quiz-gen/generate`, {
//                 subject,
//                 level,
//                 topic,
//                 questionCount: Number(count)
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             setQuiz(res.data);
//         } catch (error) {
//             console.error(error);
//             alert("Erreur lors de la génération. Réessayez.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSave = async () => {
//         if (!quiz) return;
//         setSaving(true);
//         const token = Cookies.get('token');

//         try {
//             await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/quiz-gen/save`, {
//                 title: quiz.title,
//                 subject,
//                 level,
//                 questions: quiz.questions
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSaved(true);
//         } catch (error) {
//             alert("Erreur sauvegarde");
//         } finally {
//             setSaving(false);
//         }
//     };

//     return (
//         <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-50 dark:bg-surface min-h-screen">

//                         {/* EN-TÊTE AVEC LE BOUTON */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//                         <BrainCircuit className="text-blue-600" size={36} />
//                         Générateur de Devoirs IA
//                     </h1>
//                     <p className="text-gray-500 mt-2">
//                         Créez des QCM complets en quelques secondes grâce à l'intelligence artificielle.
//                     </p>
//                 </div>

//                 {/* LE BOUTON QUE TU AS DEMANDÉ */}
//                 <Link 
//                     href="/teacher/quizzes" 
//                     className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
//                 >
//                     <LayoutList size={20} className="text-blue-600"/>
//                     Voir mes Quiz enregistrés
//                 </Link>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* COLONNE GAUCHE : CONFIGURATION */}
//                 <div className="lg:col-span-1">
//                     <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
//                         <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
//                             <Sparkles className="text-yellow-500" size={20}/> Configuration
//                         </h2>
                        
//                         <form onSubmit={handleGenerate} className="space-y-5">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matière</label>
//                                 <div className="relative">
//                                     <BookOpen className="absolute left-3 top-3 text-gray-400" size={18} />
//                                     <select 
//                                         value={subject} 
//                                         onChange={e => setSubject(e.target.value)}
//                                         className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                     >
//                                         {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
//                                     </select>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classe</label>
//                                 <div className="relative">
//                                     <GraduationCap className="absolute left-3 top-3 text-gray-400" size={18} />
//                                     <select 
//                                         value={level} 
//                                         onChange={e => setLevel(e.target.value)}
//                                         className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                     >
//                                         {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
//                                     </select>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sujet du cours (Précis)</label>
//                                 <input 
//                                     type="text" 
//                                     value={topic}
//                                     onChange={e => setTopic(e.target.value)}
//                                     placeholder="Ex: Les nombres complexes, La Guerre Froide..."
//                                     className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de questions : {count}</label>
//                                 <input 
//                                     type="range" 
//                                     min="3" max="10" 
//                                     value={count} 
//                                     onChange={e => setCount(Number(e.target.value))}
//                                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                                 />
//                             </div>

//                             <button 
//                                 type="submit" 
//                                 disabled={loading}
//                                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
//                             >
//                                 {loading ? <Loader2 className="animate-spin"/> : <Sparkles size={20}/>}
//                                 {loading ? "L'IA réfléchit..." : "Générer le Devoir"}
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* COLONNE DROITE : RÉSULTAT */}
//                 <div className="lg:col-span-2">
//                     {!quiz && !loading && (
//                         <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 min-h-[400px]">
//                             <BrainCircuit size={64} className="mb-4 opacity-20" />
//                             <p>Configurez les paramètres à gauche pour générer un devoir.</p>
//                         </div>
//                     )}

//                     {loading && (
//                         <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
//                             <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
//                             <p className="text-gray-600 animate-pulse">Analyse du programme sénégalais en cours...</p>
//                         </div>
//                     )}

//                     {quiz && (
//                         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
//                             <div className="bg-blue-50 dark:bg-blue-900/20 p-6 border-b border-blue-100 dark:border-blue-800 flex justify-between items-center">
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{quiz.title}</h2>
//                                     <p className="text-sm text-blue-600 dark:text-blue-300">{subject} • {level}</p>
//                                 </div>
//                                 {saved ? (
//                                     <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold flex items-center gap-2">
//                                         <CheckCircle size={18} /> Enregistré
//                                     </span>
//                                 ) : (
//                                     <button 
//                                         onClick={handleSave} 
//                                         disabled={saving}
//                                         className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md flex items-center gap-2 transition-colors"
//                                     >
//                                         {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
//                                         Enregistrer dans mes classes
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="p-8 space-y-8">
//                                 {quiz.questions.map((q, idx) => (
//                                     <div key={idx} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
//                                         <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4 flex gap-3">
//                                             <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
//                                                 {idx + 1}
//                                             </span>
//                                             {q.text}
//                                         </h3>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
//                                             {q.options.map((opt, i) => (
//                                                 <div 
//                                                     key={i} 
//                                                     className={`p-3 rounded-lg border text-sm ${
//                                                         opt === q.correctAnswer 
//                                                             ? "bg-green-50 border-green-200 text-green-800 font-medium dark:bg-green-900/20 dark:border-green-800 dark:text-green-200" 
//                                                             : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
//                                                     }`}
//                                                 >
//                                                     {opt} {opt === q.correctAnswer && "✅"}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


// (app)/teacher/quiz-generator/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Loader2, Sparkles, Save, CheckCircle, BookOpen, GraduationCap, BrainCircuit, LayoutList } from 'lucide-react';
import Link from 'next/link';
// On importe getMyTeacherSchedule pour récupérer les matières du prof
import { getMyTeacherSchedule } from '@/services/api'; 

// Liste de secours si le prof n'a pas encore d'emploi du temps
const DEFAULT_MATIERES = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Histoire-Géographie", "Anglais", "Philosophie"];
const NIVEAUX = ["Terminale S2", "Terminale L2", "Première S", "Première L", "Seconde S", "Seconde L"];

interface Question {
    text: string;
    options: string[];
    correctAnswer: string;
}

interface GeneratedQuiz {
    title: string;
    questions: Question[];
}

export default function QuizGeneratorPage() {
    // États pour les matières dynamiques
    const [availableSubjects, setAvailableSubjects] = useState<string[]>(DEFAULT_MATIERES);
    const [loadingSubjects, setLoadingSubjects] = useState(true);

    // États du formulaire
    const [subject, setSubject] = useState(""); // Sera initialisé après le chargement
    const [level, setLevel] = useState(NIVEAUX[0]);
    const [topic, setTopic] = useState("");
    const [count, setCount] = useState(5);

    // États de l'application
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // --- EFFET : CHARGER LES MATIÈRES DU PROF ---
    useEffect(() => {
        const fetchTeacherSubjects = async () => {
            const token = Cookies.get('token');
            if (!token) return;

            try {
                // On récupère l'emploi du temps
                const res = await getMyTeacherSchedule(token);
                const schedule = res.data;

                // On extrait les matières uniques (Set pour éviter les doublons)
                // @ts-ignore
                const subjects = Array.from(new Set(schedule.map((s: any) => s.subject)));

                if (subjects.length > 0) {
                    // Si le prof a des cours, on affiche SES matières
                    // @ts-ignore
                    setAvailableSubjects(subjects);
                    // @ts-ignore
                    setSubject(subjects[0]); 
                } else {
                    // Sinon, on garde la liste par défaut
                    setSubject(DEFAULT_MATIERES[0]);
                }
            } catch (error) {
                console.error("Erreur chargement matières", error);
                // En cas d'erreur, fallback sur défaut
                setSubject(DEFAULT_MATIERES[0]);
            } finally {
                setLoadingSubjects(false);
            }
        };

        fetchTeacherSubjects();
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setQuiz(null);
        setSaved(false);

        const token = Cookies.get('token');

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/quiz-gen/generate`, {
                subject,
                level,
                topic,
                questionCount: Number(count)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setQuiz(res.data);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la génération. Réessayez.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!quiz) return;
        setSaving(true);
        const token = Cookies.get('token');

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/quiz-gen/save`, {
                title: quiz.title,
                subject,
                level,
                questions: quiz.questions
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSaved(true);
        } catch (error) {
            alert("Erreur sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-50 dark:bg-surface min-h-screen">
            
            {/* EN-TÊTE AVEC LE BOUTON */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <BrainCircuit className="text-blue-600" size={36} />
                        Générateur de Devoirs IA
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Créez des QCM complets en quelques secondes grâce à l'intelligence artificielle.
                    </p>
                </div>

                {/* LE BOUTON QUE TU AS DEMANDÉ */}
                <Link 
                    href="/teacher/quizzes" 
                    className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
                >
                    <LayoutList size={20} className="text-blue-600"/>
                    Voir mes Quiz enregistrés
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLONNE GAUCHE : CONFIGURATION */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8">
                        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Sparkles className="text-yellow-500" size={20}/> Configuration
                        </h2>
                        
                        <form onSubmit={handleGenerate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matière</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <select 
                                        value={subject} 
                                        onChange={e => setSubject(e.target.value)}
                                        disabled={loadingSubjects}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                                    >
                                        {loadingSubjects ? (
                                            <option>Chargement...</option>
                                        ) : (
                                            availableSubjects.map(m => <option key={m} value={m}>{m}</option>)
                                        )}
                                    </select>
                                </div>
                                {!loadingSubjects && availableSubjects === DEFAULT_MATIERES && (
                                    <p className="text-xs text-orange-500 mt-1">
                                        * Liste par défaut (emploi du temps non trouvé).
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classe</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <select 
                                        value={level} 
                                        onChange={e => setLevel(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sujet du cours (Précis)</label>
                                <input 
                                    type="text" 
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                    placeholder="Ex: Les nombres complexes, La Guerre Froide..."
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de questions : {count}</label>
                                <input 
                                    type="range" 
                                    min="3" max="10" 
                                    value={count} 
                                    onChange={e => setCount(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin"/> : <Sparkles size={20}/>}
                                {loading ? "L'IA réfléchit..." : "Générer le Devoir"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLONNE DROITE : RÉSULTAT */}
                <div className="lg:col-span-2">
                    {!quiz && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 min-h-[400px]">
                            <BrainCircuit size={64} className="mb-4 opacity-20" />
                            <p>Configurez les paramètres à gauche pour générer un devoir.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
                            <p className="text-gray-600 animate-pulse">Analyse du programme sénégalais en cours...</p>
                        </div>
                    )}

                    {quiz && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 border-b border-blue-100 dark:border-blue-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{quiz.title}</h2>
                                    <p className="text-sm text-blue-600 dark:text-blue-300">{subject} • {level}</p>
                                </div>
                                {saved ? (
                                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold flex items-center gap-2">
                                        <CheckCircle size={18} /> Enregistré
                                    </span>
                                ) : (
                                    <button 
                                        onClick={handleSave} 
                                        disabled={saving}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md flex items-center gap-2 transition-colors"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                                        Enregistrer dans mes classes
                                    </button>
                                )}
                            </div>

                            <div className="p-8 space-y-8">
                                {quiz.questions.map((q, idx) => (
                                    <div key={idx} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4 flex gap-3">
                                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            {q.text}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                                            {q.options.map((opt, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`p-3 rounded-lg border text-sm ${
                                                        opt === q.correctAnswer 
                                                            ? "bg-green-50 border-green-200 text-green-800 font-medium dark:bg-green-900/20 dark:border-green-800 dark:text-green-200" 
                                                            : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
                                                    }`}
                                                >
                                                    {opt} {opt === q.correctAnswer && "✅"}
                                                </div>
                                            ))}
                                        </div>
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