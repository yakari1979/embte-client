// (app)/parent/student/[studentId]/analytics/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getChildDetails } from '@/services/api'; // On réutilise la même API, on calcule côté client
import { 
    Loader2, ArrowLeft, TrendingUp, AlertTriangle, 
    CheckCircle, Brain, Target, Award, Frown 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend 
} from 'recharts';

// --- UTILITAIRES DE CALCUL ---

// const calculateAverage = (grades: any[]) => {
//     if (!grades || grades.length === 0) return 0;
//     const sum = grades.reduce((acc, g) => acc + (g.score || 0), 0);
//     return (sum / grades.length).toFixed(2);
// };

// --- UTILITAIRES DE CALCUL ---

const calculateAverage = (grades: any[]) => {
    // CORRECTION ICI : on retourne "0" (string) et pas 0 (nombre)
    if (!grades || grades.length === 0) return "0"; 
    
    const sum = grades.reduce((acc, g) => acc + (g.score || 0), 0);
    return (sum / grades.length).toFixed(2);
};

const calculateSuccessProbability = (average: number, absences: number) => {
    // Algorithme simple : Base sur la moyenne (x5) - Pénalité absence (-2% par absence)
    let prob = (average * 5); 
    prob = prob - (absences * 2);
    if (prob > 100) prob = 100;
    if (prob < 0) prob = 0;
    return Math.round(prob);
};

// --- COMPOSANT PAGE ---

export default function StudentAnalyticsPage() {
    const pathname = usePathname();
    // Extraction propre de l'ID : /parent/student/123/analytics -> 123
    const studentId = pathname.split('/')[3]; 
    
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) return;
            try {
                const response = await getChildDetails(studentId, token);
                setData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    // --- ANALYSE DES DONNÉES ---
    const analytics = useMemo(() => {
        if (!data) return null;

        // 1. Moyenne Générale
        // const generalAvg = parseFloat(calculateAverage(data.grades));
        // 1. Moyenne Générale
        // On force la conversion en String avant de parser, pour calmer TypeScript
        const generalAvg = parseFloat(String(calculateAverage(data.grades)));

        // 2. Moyenne par Matière (Pour le graphique)
        const subjectStats: Record<string, { sum: number, count: number }> = {};
        data.grades.forEach((g: any) => {
            if (!subjectStats[g.evaluation.subject]) {
                subjectStats[g.evaluation.subject] = { sum: 0, count: 0 };
            }
            subjectStats[g.evaluation.subject].sum += g.score;
            subjectStats[g.evaluation.subject].count += 1;
        });

        const chartData = Object.keys(subjectStats).map(subject => ({
            subject,
            moyenne: Math.round((subjectStats[subject].sum / subjectStats[subject].count) * 10) / 10,
            fullMark: 20
        }));

        // 3. Points Forts et Faibles
        const strengths = chartData.filter(d => d.moyenne >= 14).map(d => d.subject);
        const weaknesses = chartData.filter(d => d.moyenne < 10).map(d => d.subject);

        // 4. Impact des Absences
        const totalAbsences = data.attendance.length;
        const successProb = calculateSuccessProbability(generalAvg, totalAbsences);

        // 5. Conseil Automatique (IA Simulée)
        let aiAdvice = "";
        if (totalAbsences > 3) {
            aiAdvice += "⚠️ La priorité absolue est de réduire les absences. Chaque absence crée une lacune qui sera difficile à combler plus tard. ";
        }
        if (weaknesses.length > 0) {
            aiAdvice += `🎯 Il faut concentrer les efforts sur : ${weaknesses.join(', ')}. Encouragez votre enfant à refaire les exercices de ces matières. `;
        } else if (generalAvg > 14) {
            aiAdvice += "👏 Excellent travail ! Votre enfant est sur une très bonne dynamique. Encouragez-le à maintenir ce rythme.";
        } else {
            aiAdvice += "💪 Les résultats sont encourageants mais peuvent être améliorés. Une régularité dans le travail personnel le soir fera la différence.";
        }

        return { generalAvg, chartData, strengths, weaknesses, totalAbsences, successProb, aiAdvice };
    }, [data]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
    if (!data || !analytics) return <div className="p-8 text-center">Données insuffisantes pour l'analyse.</div>;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 dark:bg-surface min-h-screen">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link href={`/parent/student/${studentId}`} className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Retour au profil
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Analyse de la Réussite : <span className="text-blue-600">{data.studentInfo.firstName}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Rapport généré par l'Intelligence Artificielle PENI</p>
                </div>
                
                {/* Jauge de Probabilité de Réussite */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Probabilité de Réussite</p>
                        <p className={`text-3xl font-black ${analytics.successProb > 70 ? 'text-green-500' : analytics.successProb > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {analytics.successProb}%
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-full border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center">
                        <Target size={24} className={analytics.successProb > 70 ? 'text-green-500' : 'text-red-500'} />
                    </div>
                </div>
            </div>

            {/* Cartes KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Moyenne Générale</h3>
                        <TrendingUp size={20} className="text-blue-500"/>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.generalAvg}<span className="text-sm text-gray-400">/20</span></p>
                    <p className="text-xs text-gray-500 mt-1">Calculée sur {data.grades.length} notes</p>
                </div>

                <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 ${analytics.totalAbsences === 0 ? 'border-green-500' : 'border-red-500'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Assiduité</h3>
                        {analytics.totalAbsences === 0 ? <CheckCircle size={20} className="text-green-500"/> : <AlertTriangle size={20} className="text-red-500"/>}
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalAbsences} <span className="text-sm font-normal">Absence(s)</span></p>
                    <p className="text-xs text-gray-500 mt-1">
                        {analytics.totalAbsences > 0 ? `Impact estimé : -${analytics.totalAbsences * 2}% sur la réussite` : "Présence exemplaire !"}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-blue-100 flex items-center gap-2 mb-2">
                            <Brain size={18}/> Conseil du Coach
                        </h3>
                        <p className="text-sm leading-relaxed font-medium">
                            "{analytics.aiAdvice}"
                        </p>
                    </div>
                    <Brain className="absolute -bottom-4 -right-4 h-32 w-32 text-white/10 rotate-12" />
                </div>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Graphique Radar (Performance) */}
                <div className="bg-white dark:bg-surface p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6">Profil de Performance</h3>
                    <div className="h-[300px] w-full">
                        {analytics.chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.chartData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e5e7eb"/>
                                    <XAxis type="number" domain={[0, 20]} hide />
                                    <YAxis dataKey="subject" type="category" width={100} style={{ fontSize: '12px', fontWeight: 500 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="moyenne" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">Pas assez de données</div>
                        )}
                    </div>
                </div>

                {/* Analyse Points Forts / Faibles */}
                <div className="space-y-6">
                    {/* Forces */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                        <h3 className="font-bold text-green-800 dark:text-green-300 flex items-center gap-2 mb-4">
                            <Award size={20}/> Points Forts (Moyenne {'>'} 14)
                        </h3>
                        {analytics.strengths.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {analytics.strengths.map(s => (
                                    <span key={s} className="bg-white dark:bg-green-900 text-green-700 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-green-200 dark:border-green-700">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-green-600 dark:text-green-400">Continuez les efforts, les points forts vont apparaître !</p>
                        )}
                    </div>

                    {/* Faiblesses */}
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-800">
                        <h3 className="font-bold text-red-800 dark:text-red-300 flex items-center gap-2 mb-4">
                            <Frown size={20}/> Points à Améliorer (Moyenne {'<'} 10)
                        </h3>
                        {analytics.weaknesses.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {analytics.weaknesses.map(s => (
                                    <span key={s} className="bg-white dark:bg-red-900 text-red-700 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-red-200 dark:border-red-700">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-red-600 dark:text-red-400">Aucune faiblesse critique détectée. Bravo !</p>
                        )}
                    </div>

                    {/* Action */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Besoin d'un plan d'action ?</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            L'assistant PENI peut générer un planning de révision personnalisé basé sur ces résultats.
                        </p>
                        <button className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Demander un planning de révision (Bientôt disponible)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}