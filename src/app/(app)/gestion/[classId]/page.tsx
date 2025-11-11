"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAdminClassDetails, getAdminClassDashboardStats } from '@/services/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Loader2, ArrowLeft, BarChart2, Users, Briefcase, TrendingUp } from 'lucide-react';
// --- MODIFIÉ : On importe les nouveaux types de graphiques ---
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

// Types pour les données (inchangés)
interface Student { id: string; firstName: string; lastName: string; }
interface Teacher { id: string; firstName: string; lastName: string; }
interface ClassDetails { name: string; students: Student[]; teachers: Teacher[]; }
interface DashboardStats { successRate: number; absenceData: { month: string; absences: number }[]; }

// --- NOUVEAU : Une palette de couleurs plus riche et professionnelle ---
const CHART_COLORS = {
  primary: '#3b82f6', // Bleu
  success: '#10b981', // Vert
  danger: '#ef4444', // Rouge
  background: '#e0e7ff', // Bleu très clair pour le fond du radial
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const ClassDetailsPage = () => {
  const params = useParams();
  const classId = params.classId as string;
  
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) return;
    const fetchAllData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError("Authentification requise.");
        setLoading(false);
        return;
      }
      try {
        const [detailsResponse, statsResponse] = await Promise.all([
          getAdminClassDetails(classId, token),
          getAdminClassDashboardStats(classId, token)
        ]);
        setClassDetails(detailsResponse.data);
        setStats(statsResponse.data);
      } catch (err) {
        setError("Impossible de charger les données de la classe.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [classId]);
  
  // --- MODIFIÉ : Préparation des données pour le nouveau Graphique Radial ---
  const radialChartData = stats ? [{ name: 'Réussite', value: stats.successRate, fill: CHART_COLORS.success }] : [];

  if (loading) return (
    <div className="flex justify-center items-center p-20">
      <Loader2 className="animate-spin h-12 w-12 text-primary" />
    </div>
  );
  
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;
  if (!classDetails) return <p className="text-center p-8">Classe introuvable.</p>;

  return (
    <div>
      {/* En-tête de la page */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tableau de Bord : {classDetails.name}</h1>
          <p className="text-text-secondary">Vue d'ensemble de la performance et des membres de la classe.</p>
        </div>
        <Link href="/classes" className="btn-secondary">
          <ArrowLeft className="h-5 w-5" />
          <span>Retour aux classes</span>
        </Link>
      </div>

      {/* SECTION 1 : STATISTIQUES CLÉS (GRAPHIQUES) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BarChart2 size={20}/> Statistiques Clés</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Effectif (KPI - Indicateur Clé) */}
          <div className="bg-surface p-6 rounded-lg shadow-md flex flex-col justify-between">
            <h3 className="font-bold text-text-primary flex items-center gap-2"><Users size={18}/> Effectif de la Classe</h3>
            <div>
              <p className="text-5xl font-bold text-primary mt-4">{classDetails.students.length}</p>
              <p className="text-sm text-text-secondary">élèves inscrits</p>
            </div>
          </div>

          {/* Card 2: Taux d'absence (Graphique en Aires) */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2"><TrendingUp size={18}/> Tendance des Absences</h3>
            {stats && stats.absenceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={150}>
                {/* --- MODIFIÉ : AreaChart pour un look plus dynamique --- */}
                <AreaChart data={stats.absenceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorAbsences" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'rgba(128, 128, 128, 0.1)'}} contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)' }}/>
                  <Area type="monotone" dataKey="absences" name="Absences" stroke={CHART_COLORS.primary} fill="url(#colorAbsences)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="text-center text-text-secondary h-full flex items-center justify-center">Aucune donnée d'absence.</div>}
          </div>
          
          {/* Card 3: Taux de réussite (Graphique Radial) */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-text-primary mb-4">Taux de Réussite Global</h3>
            {stats && stats.successRate > 0 ? (
              <ResponsiveContainer width="100%" height={150}>
                 {/* --- MODIFIÉ : RadialBarChart pour un look plus moderne --- */}
                <RadialBarChart innerRadius="70%" outerRadius="85%" data={radialChartData} startAngle={90} endAngle={-270} barSize={20}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                  <Legend iconSize={10} verticalAlign="bottom" />
                  <Tooltip />
                  {/* Texte au centre du cercle */}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold" fill="var(--primary)">
                    {`${stats.successRate}%`}
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            ) : <div className="text-center text-text-secondary h-full flex items-center justify-center">Aucune note enregistrée.</div>}
          </div>
        </div>
      </section>

      {/* SECTIONS 2 & 3 : LISTES DES MEMBRES (inchangées) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Users size={20}/> Élèves ({classDetails.students.length})</h2>
          <div className="bg-surface p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
             <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {classDetails.students.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(student => (
                <li key={student.id} className="py-3 px-2">{student.firstName} {student.lastName.toUpperCase()}</li>
              ))}
            </ul>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase size={20}/> Professeurs ({classDetails.teachers.length})</h2>
          <div className="bg-surface p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {classDetails.teachers.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(teacher => (
                <li key={teacher.id} className="py-3 px-2">{teacher.firstName} {teacher.lastName.toUpperCase()}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClassDetailsPage;