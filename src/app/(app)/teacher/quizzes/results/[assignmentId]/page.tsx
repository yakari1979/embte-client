"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
    BarChart3, Users, CheckCircle, AlertCircle, 
    ArrowLeft, Search, Download, Trophy, 
    TrendingUp, Loader2, Calendar
} from 'lucide-react';
import { getQuizAssignmentResults, QuizSubmissionResult } from '@/services/api';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

export default function QuizResultsPage() {
    const pathname = usePathname();
    const assignmentId = pathname.split('/').slice(-1)[0] || ''; // Récupère l'ID depuis l'URL
    const router = useRouter();

    const [results, setResults] = useState<QuizSubmissionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Statistiques calculées
    const [stats, setStats] = useState({
        average: 0,
        passRate: 0,
        highest: 0,
        lowest: 0,
        total: 0
    });

    useEffect(() => {
        if (!assignmentId) return;
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) return;

            try {
                const res = await getQuizAssignmentResults(assignmentId, token);
                const data = res.data;
                setResults(data);
                calculateStats(data);
            } catch (error) {
                console.error("Erreur chargement résultats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [assignmentId]);

    const calculateStats = (data: QuizSubmissionResult[]) => {
        if (data.length === 0) return;

        const scores = data.map(r => r.score);
        const total = scores.length;
        const sum = scores.reduce((a, b) => a + b, 0);
        const average = sum / total;
        const passed = scores.filter(s => s >= 10).length;
        const passRate = (passed / total) * 100;

        setStats({
            average,
            passRate,
            highest: Math.max(...scores),
            lowest: Math.min(...scores),
            total
        });
    };

    const filteredResults = results.filter(r => 
        `${r.student.firstName} ${r.student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fonction utilitaire pour la couleur de la note
    const getScoreColor = (score: number) => {
        if (score >= 16) return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
        if (score >= 10) return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[--background]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600"/>
                <p className="text-text-secondary">Analyse des copies en cours...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[--background] p-4 sm:p-8">
            {/* --- HEADER --- */}
            <div className="max-w-7xl mx-auto mb-8">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
                >
                    <ArrowLeft size={18}/> Retour aux quiz
                </button>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Résultats du Devoir</h1>
                        <p className="text-text-secondary flex items-center gap-2 mt-1">
                            <CheckCircle size={16} className="text-green-500"/> 
                            Devoir corrigé automatiquement • {stats.total} copies rendues
                        </p>
                    </div>
                    <button className="btn-secondary w-auto" onClick={() => alert("Fonctionnalité d'export CSV à implémenter")}>
                        <Download size={18}/> Exporter CSV
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* --- CARTES STATISTIQUES --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<TrendingUp className="text-blue-600"/>}
                        title="Moyenne de classe"
                        value={`${stats.average.toFixed(2)}/20`}
                        subtext={stats.average >= 10 ? "Niveau satisfaisant" : "Niveau fragile"}
                        color="blue"
                    />
                    <StatCard 
                        icon={<Users className="text-purple-600"/>}
                        title="Taux de réussite"
                        value={`${stats.passRate.toFixed(0)}%`}
                        subtext={`${Math.round(stats.total * (stats.passRate/100))} élèves ont la moyenne`}
                        color="purple"
                    />
                    <StatCard 
                        icon={<Trophy className="text-yellow-600"/>}
                        title="Meilleure note"
                        value={`${stats.highest}/20`}
                        subtext="Excellent travail"
                        color="yellow"
                    />
                    <StatCard 
                        icon={<AlertCircle className="text-red-600"/>}
                        title="Note la plus basse"
                        value={`${stats.lowest}/20`}
                        subtext="Besoin de soutien"
                        color="red"
                    />
                </div>

                {/* --- SECTION LISTE DES ÉLÈVES --- */}
                <div className="bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <BarChart3 size={20}/> Détail des notes
                        </h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                            <input 
                                type="text" 
                                placeholder="Rechercher un élève..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {filteredResults.length === 0 ? (
                        <div className="p-12 text-center text-text-secondary">
                            Aucun résultat trouvé pour cette recherche.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 text-text-secondary text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Rang</th>
                                        <th className="p-4 font-semibold">Élève</th>
                                        <th className="p-4 font-semibold">Date de remise</th>
                                        <th className="p-4 font-semibold text-center">Note / 20</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredResults
                                        .sort((a, b) => b.score - a.score)
                                        .map((result, index) => (
                                        <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                            <td className="p-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-200 text-gray-700' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-transparent text-text-secondary'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-text-primary">
                                                    {result.student.firstName} {result.student.lastName}
                                                </div>
                                            </td>
                                            <td className="p-4 text-text-secondary text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14}/>
                                                    {dayjs(result.submittedAt).format('DD MMM à HH:mm')}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(result.score)}`}>
                                                    {result.score.toFixed(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors opacity-0 group-hover:opacity-100">
                                                    Voir copie
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Composant Carte Statistique (Local)
const StatCard = ({ icon, title, value, subtext, color }: any) => {
    const bgColors: any = {
        blue: 'bg-blue-50 dark:bg-blue-900/20',
        purple: 'bg-purple-50 dark:bg-purple-900/20',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
        red: 'bg-red-50 dark:bg-red-900/20'
    };

    return (
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-start gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-3 rounded-xl ${bgColors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-text-secondary">{title}</p>
                <h3 className="text-2xl font-bold text-text-primary mt-1">{value}</h3>
                <p className="text-xs text-text-subtle mt-1">{subtext}</p>
            </div>
        </div>
    );
};