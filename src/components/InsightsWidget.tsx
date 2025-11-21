// components/InsightsWidget.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getPedagogicalInsights, PedagogicalInsightsResponse } from '@/services/api';
import { Loader2, Lightbulb, TrendingDown, UserX, Info } from 'lucide-react';
import Link from 'next/link';

interface InsightsWidgetProps {
  classId: string;
}

const InsightsWidget: React.FC<InsightsWidgetProps> = ({ classId }) => {
    const [data, setData] = useState<PedagogicalInsightsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs réseau

    useEffect(() => {
        const fetchInsights = async () => {
            if (!classId) return;
            setLoading(true); // Mettre le loading ici pour les re-fetch
            const token = Cookies.get('token');
            if (token) {
                try {
                    const response = await getPedagogicalInsights(classId, token);
                    setData(response.data);
                } catch (err) { 
                    console.error(err);
                    setError("Impossible de charger les analyses de l'assistant.");
                } finally { 
                    setLoading(false); 
                }
            } else {
                setLoading(false);
                setError("Session invalide.");
            }
        };
        fetchInsights();
    }, [classId]);

    if (loading) {
        return <div className="bg-surface p-6 rounded-lg shadow-md text-center"><Loader2 className="animate-spin mx-auto text-blue-500"/></div>;
    }

    if (error) {
        return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>;
    }
    
    // Si la réponse est là mais ne contient aucune information (cas initial)
    if (!data || !data.aiSummary || data.aiSummary.length === 0) {
        return (
            <div className="bg-surface p-6 rounded-lg shadow-md flex items-center gap-4">
                <Info className="h-6 w-6 text-blue-500" />
                <div>
                    <h3 className="font-semibold">Assistant Pédagogique en attente</h3>
                    <p className="text-sm text-text-secondary">Les analyses apparaîtront ici dès que suffisamment de notes auront été enregistrées.</p>
                </div>
            </div>
        );
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
            
            {/* Données brutes - On n'affiche que si elles existent */}
            {(data.difficultSubjects.length > 0 || data.strugglingStudents.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.difficultSubjects.length > 0 && (
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><TrendingDown size={18}/>Sujets à renforcer</h4>
                            <ul className="space-y-1 text-sm">{data.difficultSubjects.map(s => <li key={s.subject} className="flex justify-between p-1"><span>{s.subject}</span> <span className="font-bold">{s.average.toFixed(2)}</span></li>)}</ul>
                        </div>
                    )}
                    {data.strugglingStudents.length > 0 && (
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><UserX size={18}/>Élèves à suivre</h4>
                            <ul className="space-y-1 text-sm">{data.strugglingStudents.map(s => <li key={s.id} className="flex justify-between p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><Link href={`/my-classes/student/${s.id}`} className="underline">{s.name}</Link> <span className="font-bold">{s.average.toFixed(2)}</span></li>)}</ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InsightsWidget;