// (app)/student/quiz/[assignmentId]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { CheckCircle, XCircle, Award, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStudentQuiz, submitStudentQuiz, Quiz, QuizResult, QuizSubmissionDetail } from '@/services/api'; // Import types

export default function TakeQuizPage() {
    const pathname = usePathname();
    const assignmentId = pathname.split('/').pop() || '';
    const router = useRouter();

    // Typage explicite des états
    const [quizData, setQuizData] = useState<{ quiz: Quiz } | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({}); 
    
    // C'est ici que tu avais l'erreur "never". On dit que ça peut être QuizResult OU null.
    const [result, setResult] = useState<QuizResult | null>(null); 
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!assignmentId) return;
        const fetchQuiz = async () => {
            const token = Cookies.get('token');
            if (!token) return;
            try {
                // @ts-ignore - L'API renvoie une structure complexe parfois, on simplifie
                const res = await getStudentQuiz(assignmentId, token);
                setQuizData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [assignmentId]);

    // On type les paramètres pour éviter l'erreur TS7006
    const handleSelect = (questionId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        if (!confirm("Es-tu sûr de vouloir envoyer tes réponses ?")) return;
        
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await submitStudentQuiz(assignmentId, answers, token);
            
            setResult(res.data);
            
            if (res.data.score >= 10) {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
            
            window.scrollTo(0, 0);
        } catch (error) {
            alert("Erreur lors de l'envoi du devoir.");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600"/></div>;
    if (!quizData || !quizData.quiz) return <div className="p-10 text-center">Devoir introuvable.</div>;

    // --- AFFICHAGE RÉSULTATS ---
    if (result) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center mb-8 animate-in zoom-in duration-500 border border-gray-200 dark:border-gray-700">
                    <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                        <Award className={`w-16 h-16 ${result.score >= 10 ? 'text-green-600' : 'text-orange-500'}`} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Devoir Terminé !</h1>
                    <p className="text-gray-500 mb-6">Voici ton résultat</p>
                    <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-2">
                        {result.score.toFixed(1)} <span className="text-2xl text-gray-400">/ 20</span>
                    </div>
                    
                    <div className="mt-10 text-left space-y-6">
                        {/* On type "item" ici explicitement */}
                        {result.details.map((item: QuizSubmissionDetail, idx: number) => (
                            <div key={idx} className={`p-5 rounded-xl border ${item.isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800'}`}>
                                <p className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-lg">{idx + 1}. {item.question}</p>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
                                        <span className="font-semibold text-gray-500">Ta réponse :</span>
                                        <span className={item.isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>{item.studentAnswer || "(Aucune)"}</span>
                                        {item.isCorrect ? <CheckCircle size={18} className="text-green-600 ml-auto"/> : <XCircle size={18} className="text-red-600 ml-auto"/>}
                                    </div>
                                    {!item.isCorrect && (
                                        <div className="text-green-700 dark:text-green-400 mt-1 flex items-center gap-2 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                            <CheckCircle size={16} />
                                            <span className="font-semibold">Bonne réponse :</span> {item.correctAnswer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={() => router.push('/dashboard')} className="mt-10 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02]">
                        Retour au Tableau de Bord
                    </button>
                </div>
            </div>
        );
    }

    // --- AFFICHAGE QUESTIONNAIRE ---
    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-gray-50 dark:bg-surface min-h-screen">
            <header className="mb-8 text-center sm:text-left">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">{quizData.quiz.subject}</span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{quizData.quiz.title}</h1>
                <p className="text-gray-500 mt-1">Niveau : {quizData.quiz.level}</p>
            </header>

            <div className="space-y-6">
                {quizData.quiz.questions?.map((q, idx) => (
                    <div key={q.id} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                        <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-6 flex gap-4">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg shadow-blue-500/30">{idx + 1}</span>
                            {q.text}
                        </h3>
                        <div className="space-y-3 pl-0 sm:pl-12">
                            {q.options.map((opt, i) => (
                                <label 
                                    key={i} 
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                                        answers[q.id] === opt 
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                                            : 'border-gray-100 hover:border-blue-200 dark:border-gray-700 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-900'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'border-blue-500' : 'border-gray-400'}`}>
                                        {answers[q.id] === opt && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                    </div>
                                    <input 
                                        type="radio" 
                                        name={`q-${q.id}`} 
                                        value={opt}
                                        checked={answers[q.id] === opt}
                                        onChange={() => handleSelect(q.id, opt)}
                                        className="hidden"
                                    />
                                    <span className={`text-base ${answers[q.id] === opt ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {opt}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-end pb-10">
                <button 
                    onClick={handleSubmit} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-blue-500/30 transform hover:scale-105 transition-all flex items-center gap-3"
                >
                    Envoyer ma copie <ArrowRight className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
}