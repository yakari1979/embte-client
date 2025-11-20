// components/RecommendationWidget.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Loader2, Sparkles, Video, FileText } from 'lucide-react';
import axios from 'axios'; // Assurez-vous d'avoir une fonction dans api.ts pour cette nouvelle route

// --- Dans services/api.ts, ajoutez : ---
/*
export interface RecommendedResource { id: string; title: string; type: 'VIDEO' | 'PDF'; url: string; source: string; }
export interface RecommendationResponse { aiMessage: string; recommendedResources: RecommendedResource[]; }
export const getMyRecommendations = (token: string) => {
    return apiClient.post<RecommendationResponse>('/ai/recommendations/for-student', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
*/
import { getMyRecommendations, RecommendationResponse, trackResourceClick } from '@/services/api';

const handleResourceClick = (resourceId: string, resourceUrl: string) => {
    const token = Cookies.get('token');
    if (token) {
        // On envoie le "ping" de tracking en arrière-plan
        trackResourceClick(resourceId, token).catch(console.error);
    }
    // On ouvre le lien dans un nouvel onglet
    window.open(resourceUrl, '_blank', 'noopener,noreferrer');
};


const RecommendationWidget = () => {
    const [data, setData] = useState<RecommendationResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const response = await getMyRecommendations(token);
                    setData(response.data);
                } catch (error) { console.error(error); } 
                finally { setLoading(false); }
            }
        };
        fetchRecs();
    }, []);

    if (loading) return null; // Ne rien afficher pendant le chargement pour ne pas alourdir l'UI

    if (!data || !data.aiMessage) return null; // Si pas de message, on n'affiche rien

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Sparkles size={20} className="text-blue-500" />
                Ton Assistant PENI a un conseil pour toi
            </h3>

            <p className="text-text-secondary mb-4 italic">"{data.aiMessage}"</p>

            {data.recommendedResources && data.recommendedResources.length > 0 && (
                <div>
                    <h4 className="font-semibold text-sm mb-2">Ressources suggérées :</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* {data.recommendedResources.map(res => (
                            <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white/50 dark:bg-black/20 rounded-md hover:bg-white dark:hover:bg-black/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    {res.type === 'VIDEO' ? <Video className="h-5 w-5 text-red-500"/> : <FileText className="h-5 w-5 text-blue-500"/>}
                                    <div>
                                        <p className="font-semibold text-sm">{res.title}</p>
                                        <p className="text-xs text-text-subtle">Source: {res.source}</p>
                                    </div>
                                </div>
                            </a>
                        ))} */}

                        {data.recommendedResources.map(res => (
                            // On remplace la balise <a> par un <button> ou un <div> qui appelle notre fonction
                            <button 
                                key={res.id} 
                                onClick={() => handleResourceClick(res.id, res.url)}
                                className="block w-full text-left p-3 bg-white/50 dark:bg-black/20 rounded-md hover:bg-white dark:hover:bg-black/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {res.type === 'VIDEO' ? <Video className="h-5 w-5 text-red-500"/> : <FileText className="h-5 w-5 text-blue-500"/>}
                                    <div>
                                        <p className="font-semibold text-sm">{res.title}</p>
                                        <p className="text-xs text-text-subtle">Source: {res.source}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendationWidget;