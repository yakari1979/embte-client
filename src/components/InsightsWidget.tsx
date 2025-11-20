// components/InsightsWidget.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getPedagogicalInsights, PedagogicalInsightsResponse } from '@/services/api';
import { Loader2, Lightbulb, TrendingDown, UserX } from 'lucide-react';
import Link from 'next/link';

interface InsightsWidgetProps {
  classId: string;
}

const InsightsWidget: React.FC<InsightsWidgetProps> = ({ classId }) => {
    const [data, setData] = useState<PedagogicalInsightsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!classId) return;
            const token = Cookies.get('token');
            if (token) {
                try {
                    const response = await getPedagogicalInsights(classId, token);
                    setData(response.data);
                } catch (error) { console.error(error); } 
                finally { setLoading(false); }
            }
        };
        fetchInsights();
    }, [classId]);

    if (loading) {
        return <div className="bg-surface p-6 rounded-lg shadow-md text-center"><Loader2 className="animate-spin mx-auto"/></div>;
    }

    if (!data || !data.aiSummary) {
        return null; // Ne rien afficher si pas de données ou de message
    }

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" /> Assistant Pédagogique
            </h2>

            {/* Synthèse IA */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Synthèse de PENI :</h3>
                <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                    {data.aiSummary.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="font-bold">&bull;</span>
                            <span>{insight}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Données brutes (optionnel) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><TrendingDown size={18}/>Sujets à renforcer</h4>
                    {data.difficultSubjects.length > 0 ? (
                        <ul className="space-y-1 text-sm">{data.difficultSubjects.map(s => <li key={s.subject} className="flex justify-between p-1"><span>{s.subject}</span> <span className="font-bold">{s.average.toFixed(2)}</span></li>)}</ul>
                    ) : <p className="text-xs italic text-text-secondary">Aucun sujet difficile détecté.</p>}
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><UserX size={18}/>Élèves à suivre</h4>
                     {data.strugglingStudents.length > 0 ? (
                        <ul className="space-y-1 text-sm">{data.strugglingStudents.map(s => <li key={s.id} className="flex justify-between p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><Link href={`/users/${s.id}`} className="underline">{s.name}</Link> <span className="font-bold">{s.average.toFixed(2)}</span></li>)}</ul>
                    ) : <p className="text-xs italic text-text-secondary">Aucun élève en difficulté majeure.</p>}
                </div>
            </div>
        </div>
    );
};

export default InsightsWidget;