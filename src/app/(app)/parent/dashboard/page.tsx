// (app)/parent/dashboard/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { User, School, Loader2, UserPlus } from 'lucide-react';
import { getMyChildren, ChildSummary, getMyProfile } from '@/services/api';

interface UserProfile { firstName: string; }

const ParentDashboard = () => {
    const [children, setChildren] = useState<ChildSummary[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            if (!token) { setError("Session expirée."); setLoading(false); return; }
            try {
                const [profileRes, childrenRes] = await Promise.all([ getMyProfile(token), getMyChildren(token) ]);
                setProfile(profileRes.data);
                setChildren(childrenRes.data);
            } catch (err) {
                setError("Impossible de charger les informations.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center p-8"><Loader2 className="animate-spin mx-auto h-8 w-8 text-blue-500" /></div>;
    if (error) return <div className="text-center p-4 bg-red-100 text-red-600 rounded-lg">{error}</div>;

    return (
        <div className="space-y-8">
            <div className="bg-surface p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-text-primary">Espace Parent</h1>
                {profile && <p className="text-lg text-text-secondary">Bienvenue, {profile.firstName}</p>}
            </div>
            
            <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-4">Mes Enfants</h2>
                {children.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map(child => (
                            <Link key={child.id} href={`/parent/student/${child.id}`} className="block">
                                <div className="bg-surface p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200 h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <p className="text-xl font-bold text-text-primary">{child.firstName} {child.lastName}</p>
                                    </div>
                                    <div className="flex items-center text-text-secondary">
                                        <School className="h-5 w-5 mr-2" />
                                        <span>{child.enrolledClass?.name || "Classe non assignée"}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 px-6 bg-surface rounded-lg">
                        <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-text-secondary">Aucun élève n'est encore associé à votre compte.</p>
                        <p className="text-sm text-text-subtle mt-1">Veuillez contacter l'administration de l'établissement.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;