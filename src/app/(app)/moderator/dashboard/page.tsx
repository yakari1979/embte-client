"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getGlobalStats, GlobalStats } from '@/services/api';
import { Home, Building, School, User, Users } from 'lucide-react';

// Un composant pour les cartes de statistiques
const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface p-6 rounded-xl shadow-md flex items-center gap-6 border border-transparent dark:border-gray-800">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-text-primary">{value.toLocaleString('fr-FR')}</p>
            <p className="text-text-secondary">{title}</p>
        </div>
    </div>
);

const ModeratorDashboardPage = () => {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setError("Session invalide. Veuillez vous reconnecter.");
                setIsLoading(false);
                return;
            }
            try {
                const { data } = await getGlobalStats(token);
                setStats(data);
            } catch (err) {
                setError("Impossible de charger les statistiques de la plateforme.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Tableau de Bord Modérateur</h1>
                <p className="text-text-secondary mt-1">Vue d'ensemble de l'activité sur toute la plateforme.</p>
            </header>

            {isLoading ? (
                <div>Chargement des données...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Établissements" value={stats.establishmentCount} icon={<Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />} />
                    <StatCard title="Classes" value={stats.classCount} icon={<School className="h-8 w-8 text-blue-600 dark:text-blue-400" />} />
                    <StatCard title="Total Utilisateurs" value={stats.adminCount + stats.teacherCount + stats.studentCount} icon={<Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />} />
                    
                    {/* Cartes détaillées par rôle */}
                    <div className="bg-surface p-6 rounded-xl shadow-md border border-transparent dark:border-gray-800 col-span-1 md:col-span-2 lg:col-span-3">
                        <h2 className="text-xl font-semibold mb-4 text-text-primary">Répartition des Utilisateurs</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-2xl font-bold">{stats.adminCount}</p>
                                <p className="text-text-secondary">Administrateurs</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-2xl font-bold">{stats.teacherCount}</p>
                                <p className="text-text-secondary">Professeurs</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-2xl font-bold">{stats.studentCount}</p>
                                <p className="text-text-secondary">Étudiants</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModeratorDashboardPage;