"use client";

import React, { useState, useEffect } from 'react';
import { getAdminDashboardSummary, AdminDashboardData } from '@/services/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Users, School, UserPlus, GraduationCap, Briefcase, Clock, Building2 } from 'lucide-react';

// --- Sous-composant pour les cartes de statistiques ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-surface p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);


interface UserProfile {
  firstName: string;
  lastName: string;
  establishment: { name: string };
}


// --- Composant principal du tableau de bord ---
const AdminDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError("Authentification requise."); setLoading(false); return;
      }
      try {
        const response = await getAdminDashboardSummary(token);
        setData(response.data);
      } catch (err) {
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-center p-8">Chargement du tableau de bord...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;
  if (!data) return <p>Aucune donnée disponible.</p>;

  const { stats, recentUsers } = data;

  return (
    <div className="space-y-8">
      {/* <h1 className="text-3xl font-bold text-text-primary">Tableau de Bord Administrateur</h1> */}

      <div className="bg-surface p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tableau de Bord Administrateur</h1>
          {profile && (
            <p className="text-lg text-text-secondary">
              Bienvenue, {profile.firstName} {profile.lastName}
            </p>
          )}
        </div>
        {profile && (
          <div className="flex items-center gap-3 bg-background p-3 rounded-md text-sm text-text-secondary border border-gray-200 dark:border-gray-700">
            <Building2 className="h-5 w-5 text-text-subtle" />
            <span className="font-semibold">{profile.establishment.name}</span>
          </div>
        )}
      </div>
      
      {/* --- Section 1: Indicateurs Clés --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Élèves Inscrits" value={stats.studentCount} icon={<GraduationCap className="h-6 w-6 text-blue-500" />} />
        <StatCard title="Enseignants" value={stats.teacherCount} icon={<Briefcase className="h-6 w-6 text-blue-500" />} />
        <StatCard title="Classes Créées" value={stats.classCount} icon={<School className="h-6 w-6 text-blue-500" />} />
      </div>

      {/* --- Grille à 2 colonnes pour l'activité et les actions --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne de gauche (plus large) : Activité Récente */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-text-primary mb-4">Activité Récente</h2>
          {recentUsers.length > 0 ? (
            <ul className="space-y-4">
              {recentUsers.map(user => (
                <li key={user.id} className="flex items-center justify-between p-3 bg-background rounded-md">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${user.role === 'STUDENT' ? 'bg-purple-100 dark:bg-purple-900' : 'bg-green-100 dark:bg-green-900'}`}>
                      {user.role === 'STUDENT' ? <GraduationCap className="h-5 w-5 text-purple-600" /> : <Briefcase className="h-5 w-5 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-text-secondary">{user.role === 'STUDENT' ? 'Nouvel élève ajouté' : 'Nouvel enseignant ajouté'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-text-subtle flex items-center"><Clock size={12} className="mr-1"/>Récente</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-text-secondary italic py-8">Aucune activité récente.</p>
          )}
        </div>
        
        {/* Colonne de droite : Actions Rapides */}
        <div className="bg-surface p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-text-primary mb-4">Actions Rapides</h2>
          <div className="flex flex-col gap-4">
            <Link href="/users/new" className="btn-primary w-full flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span>Ajouter un Utilisateur</span>
            </Link>
            <Link href="/classes/new" className="btn-secondary w-full flex items-center justify-center gap-2">
              <School className="h-5 w-5" />
              <span>Créer une Classe</span>
            </Link>
            {/* Vous pourriez ajouter un lien vers la gestion de l'emploi du temps ici */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;