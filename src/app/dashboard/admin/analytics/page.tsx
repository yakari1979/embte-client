'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { adminService } from '@/services/api';
import { gsap } from 'gsap';
import { useTheme } from 'next-themes'; // Pour détecter le mode
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { Loader2, TrendingUp, PieChart as PieIcon, Activity, DollarSign, Info } from 'lucide-react';

// Couleurs Nexus (Restent vibrantes dans les deux modes)
const COLORS = ['#FF6B00', '#3B82F6', '#22C55E', '#EF4444', '#A855F7'];

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const container = useRef(null);
  const { theme } = useTheme(); // Récupère le thème actuel
  const [isDark, setIsDark] = useState(true);

  // Synchroniser le thème pour Recharts
  useEffect(() => {
    setIsDark(theme === 'dark');
  }, [theme]);

  // Couleurs dynamiques pour les graphiques
  const chartConfig = {
    grid: isDark ? '#333' : '#e5e7eb', // Gris foncé vs Gris clair
    text: isDark ? '#9ca3af' : '#4b5563', // Texte gris clair vs gris foncé
    tooltipBg: isDark ? '#121212' : '#ffffff',
    tooltipBorder: isDark ? '#333' : '#e5e7eb',
    tooltipText: isDark ? '#fff' : '#000',
  };

  useEffect(() => {
    adminService.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      // Animation Header
      gsap.fromTo(".header-anim", 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      
      // Animation Cartes (Effet élastique)
      gsap.fromTo(".chart-card", 
        { scale: 0.9, opacity: 0, y: 50 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" }
      );
    }, container);
    return () => ctx.revert();
  }, [loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  // Préparation des données
  const statusData = data.projectStatus.map((s: any) => ({ name: s.status, value: s._count.id }));
  const taskData = data.taskStats.map((t: any) => ({ name: t.status, count: t._count.id }));

  // Calculs pour les "Insights" (Phrases d'aide)
  const totalBudget = data.budgetData.reduce((acc: number, curr: any) => acc + curr.budget, 0);
  const totalSpent = data.budgetData.reduce((acc: number, curr: any) => acc + curr.spent, 0);
  const budgetHealth = Math.round((totalSpent / totalBudget) * 100) || 0;

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
      
      {/* HEADER */}
      <div className="header-anim mb-12 border-b border-nexus-gray pb-8">
        <h1 className="text-4xl font-bold text-nexus-text mb-2">Analytique & Performance</h1>
        <p className="text-nexus-concrete text-lg max-w-2xl">
            Analysez la santé de votre entreprise en un coup d'œil. Ces données sont mises à jour en temps réel à partir des rapports de chantier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. GRAPHIQUE BUDGET (Bar Chart) */}
        <div className="chart-card bg-nexus-dark border border-nexus-gray rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-nexus-orange/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-nexus-black rounded-xl text-green-500 group-hover:scale-110 transition-transform"><DollarSign size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-nexus-text">Santé Financière</h3>
                        <p className="text-xs text-nexus-concrete uppercase font-bold">Top 5 Projets</p>
                    </div>
                </div>
                {/* Insight Badge */}
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={12}/> {budgetHealth}% Consommé
                </div>
            </div>
            
            {/* Description pédagogique */}
            <p className="text-sm text-nexus-concrete mb-6 bg-nexus-black/30 p-3 rounded-lg border border-nexus-gray/30 flex gap-2">
                <Info size={16} className="shrink-0 text-nexus-orange"/>
                Comparaison entre le budget initial (Bleu) et les dépenses estimées (Orange) basées sur l'avancement.
            </p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.budgetData} barGap={0}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.grid} vertical={false} />
                        <XAxis dataKey="name" stroke={chartConfig.text} fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke={chartConfig.text} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                        <Tooltip content={<CustomTooltip config={chartConfig} />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                        <Bar dataKey="budget" name="Budget Initial" fill="#3B82F6" radius={[4, 4, 0, 0]} animationDuration={1500} />
                        <Bar dataKey="spent" name="Consommé" fill="#FF6B00" radius={[4, 4, 0, 0]} animationDuration={1500} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 2. GRAPHIQUE STATUT PROJETS (Pie Chart) */}
        <div className="chart-card bg-nexus-dark border border-nexus-gray rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-nexus-orange/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-nexus-black rounded-xl text-blue-500 group-hover:scale-110 transition-transform"><PieIcon size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-nexus-text">État des Chantiers</h3>
                        <p className="text-xs text-nexus-concrete uppercase font-bold">Répartition globale</p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-nexus-concrete mb-6 bg-nexus-black/30 p-3 rounded-lg border border-nexus-gray/30 flex gap-2">
                <Info size={16} className="shrink-0 text-nexus-orange"/>
                Survolez les sections pour voir le nombre exact de projets par statut (Actif, En attente, Terminé).
            </p>

            <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {statusData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip config={chartConfig} />} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 3. GRAPHIQUE ACTIVITÉ OUVRIERS (Area Chart) */}
        <div className="chart-card bg-nexus-dark border border-nexus-gray rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-nexus-orange/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-nexus-black rounded-xl text-nexus-orange group-hover:scale-110 transition-transform"><Activity size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-nexus-text">Présence sur Site</h3>
                        <p className="text-xs text-nexus-concrete uppercase font-bold">7 derniers jours</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-nexus-orange/10 border border-nexus-orange/20 text-nexus-orange text-xs font-bold">
                    Pic d'activité : Jeudi
                </div>
            </div>

            <p className="text-sm text-nexus-concrete mb-6 bg-nexus-black/30 p-3 rounded-lg border border-nexus-gray/30 flex gap-2">
                <Info size={16} className="shrink-0 text-nexus-orange"/>
                Volume des effectifs présents sur l'ensemble des chantiers. Utile pour la gestion RH.
            </p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.activityData}>
                        <defs>
                            <linearGradient id="colorWorkers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.grid} vertical={false} />
                        <XAxis dataKey="day" stroke={chartConfig.text} axisLine={false} tickLine={false} fontSize={12} />
                        <YAxis stroke={chartConfig.text} axisLine={false} tickLine={false} fontSize={12} />
                        <Tooltip content={<CustomTooltip config={chartConfig} />} />
                        <Area type="monotone" dataKey="workers" name="Ouvriers" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#colorWorkers)" animationDuration={2000} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 4. GRAPHIQUE TÂCHES (Bar Chart Horizontal) */}
        <div className="chart-card bg-nexus-dark border border-nexus-gray rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:border-nexus-orange/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-nexus-black rounded-xl text-purple-500 group-hover:scale-110 transition-transform"><TrendingUp size={24}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-nexus-text">Productivité</h3>
                        <p className="text-xs text-nexus-concrete uppercase font-bold">Volume de tâches</p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-nexus-concrete mb-6 bg-nexus-black/30 p-3 rounded-lg border border-nexus-gray/30 flex gap-2">
                <Info size={16} className="shrink-0 text-nexus-orange"/>
                Indique le goulot d'étranglement. Trop de tâches "En cours" peut signaler un blocage.
            </p>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskData} layout="vertical" margin={{ left: 20 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.grid} horizontal={false} />
                         <XAxis type="number" stroke={chartConfig.text} hide />
                         <YAxis dataKey="name" type="category" stroke={chartConfig.text} width={100} tick={{fontSize: 11, fontWeight: 'bold'}} />
                         <Tooltip content={<CustomTooltip config={chartConfig} />} cursor={{fill: chartConfig.grid, opacity: 0.2}} />
                         <Bar dataKey="count" name="Tâches" fill="#A855F7" radius={[0, 10, 10, 0]} barSize={30} animationDuration={1500}>
                            {taskData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'DONE' ? '#22C55E' : entry.name === 'IN_PROGRESS' ? '#3B82F6' : '#64748B'} />
                            ))}
                         </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
}

// --- TOOLTIP PERSONNALISÉ (ADAPTATIF LIGHT/DARK) ---
const CustomTooltip = ({ active, payload, label, config }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: config.tooltipBg, borderColor: config.tooltipBorder, color: config.tooltipText }} className="p-4 border rounded-xl shadow-xl">
        {label && <p className="font-bold mb-2 border-b border-gray-500/20 pb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};