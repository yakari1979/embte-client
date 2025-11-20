// components/LearningProfileWidget.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMyLearningProfile, LearningProfile } from '@/services/api';
import { Loader2, Star, TrendingDown, TrendingUp } from 'lucide-react';

const LearningProfileWidget = () => {
    const [profile, setProfile] = useState<LearningProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const response = await getMyLearningProfile(token);
                    setProfile(response.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="bg-surface p-6 rounded-lg shadow-md text-center"><Loader2 className="animate-spin mx-auto"/></div>;
    }

    if (!profile || (!profile.strengths && !profile.weaknesses)) {
        return (
             <div className="bg-surface p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2">Mon Profil d'Apprenant</h3>
                <p className="text-sm text-text-secondary">Tes premières analyses apparaîtront ici dès que tu auras reçu quelques notes. Continue tes efforts !</p>
            </div>
        );
    }

    return (
        <div className="bg-surface p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">Mon Profil d'Apprenant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Points Forts */}
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-green-600 mb-2"><TrendingUp size={18} /> Points Forts</h4>
                    {profile.strengths.length > 0 ? (
                        <ul className="space-y-2">
                            {profile.strengths.map(s => (
                                <li key={s.subject} className="flex justify-between items-center text-sm p-2 bg-green-50 dark:bg-green-900/30 rounded-md">
                                    <span>{s.subject}</span>
                                    <span className="font-bold">{s.average}/20</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-xs italic text-text-secondary">Aucun point fort majeur détecté pour le moment. Continue !</p>}
                </div>

                {/* Points à Améliorer */}
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-yellow-600 mb-2"><TrendingDown size={18} /> À Améliorer</h4>
                     {profile.weaknesses.length > 0 ? (
                        <ul className="space-y-2">
                            {profile.weaknesses.map(s => (
                                <li key={s.subject} className="flex justify-between items-center text-sm p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
                                    <span>{s.subject}</span>
                                    <span className="font-bold">{s.average}/20</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-xs italic text-text-secondary">Excellent travail ! Aucun point faible majeur détecté.</p>}
                </div>
            </div>
        </div>
    );
};

export default LearningProfileWidget;