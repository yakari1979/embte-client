'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { managerService } from '@/services/api';
import { gsap } from 'gsap';
import { 
  HardHat, MapPin, Calendar, Phone, Mail, Briefcase, 
  ClipboardList, AlertTriangle, CloudSun, ArrowRight, Loader2, UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const container = useRef(null);

  useEffect(() => {
    managerService.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  // Si le manager n'a AUCUN projet assigné donc sa vas afficher une popup bien determiner et dynamique 
  if (data?.projects.length === 0) {
    return <UnassignedView profile={data.profile} containerRef={container} />;
  }

  // Si le manager a des projets
  return <ActiveManagerView data={data} containerRef={container} />;
}

// ============================================================================
// VUE 1 : MANAGER SANS PROJET (CARTE D'IDENTITÉ PRO)
// ============================================================================
function UnassignedView({ profile, containerRef }: any) {
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".profile-card", { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" });
            gsap.from(".info-row", { x: -20, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.4 });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-[80vh] flex flex-col items-center justify-center p-4 pt-20">
            <div className="profile-card w-full max-w-2xl bg-nexus-dark border border-nexus-gray rounded-3xl overflow-hidden shadow-2xl relative">
                
                {/* Bandeau Supérieur */}
                <div className="h-32 bg-gradient-to-r from-nexus-orange to-yellow-500 relative">
                    <div className="absolute -bottom-12 left-8 p-1 bg-nexus-dark rounded-full">
                        <div className="w-24 h-24 rounded-full bg-nexus-black border-2 border-nexus-orange flex items-center justify-center text-3xl font-bold text-nexus-text">
                            {profile.firstName[0]}{profile.lastName[0]}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-nexus-text">{profile.firstName} {profile.lastName}</h1>
                            <p className="text-nexus-concrete text-lg flex items-center gap-2">
                                <HardHat size={18} className="text-nexus-orange"/> {profile.jobTitle || "Chef de Chantier"}
                            </p>
                        </div>
                        <span className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-bold border border-green-500/20 flex items-center gap-2">
                            <UserCheck size={16}/> Compte Vérifié
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-nexus-black/30 p-6 rounded-2xl border border-nexus-gray">
                        <div className="info-row space-y-1">
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Email Professionnel</label>
                            <p className="text-nexus-text flex items-center gap-2"><Mail size={16}/> {profile.email}</p>
                        </div>
                        <div className="info-row space-y-1">
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Téléphone</label>
                            <p className="text-nexus-text flex items-center gap-2"><Phone size={16}/> {profile.phone || "Non renseigné"}</p>
                        </div>
                        <div className="info-row space-y-1">
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Date d'embauche</label>
                            <p className="text-nexus-text flex items-center gap-2"><Calendar size={16}/> {new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="info-row space-y-1">
                            <label className="text-xs font-bold text-nexus-concrete uppercase">Statut</label>
                            <p className="text-nexus-orange font-bold">En attente d'affectation</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <p className="text-blue-200 text-sm">
                            👋 Bienvenue sur NexusBTP. Votre tableau de bord s'activera automatiquement dès qu'un administrateur vous assignera un chantier.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// VUE 2 : MANAGER ACTIF (DASHBOARD OPERATIONNEL & LIVE)
// ============================================================================
function ActiveManagerView({ data, containerRef }: any) {
  // État pour la météo
  const [weather, setWeather] = useState<{temp: number, condition: string} | null>(null);

  // 1. Récupération Météo (Comme pour le client)
  useEffect(() => {
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
              try {
                  const { latitude, longitude } = position.coords;
                  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                  const weatherData = await res.json();
                  setWeather({
                      temp: weatherData.current_weather.temperature,
                      condition: "Sur site" // L'API simple donne la temp, on met un texte générique
                  });
              } catch (e) {
                  console.error("Erreur météo", e);
              }
          });
      }
  }, []);

  // 2. Animations GSAP Robustes (fromTo)
  useLayoutEffect(() => {
      const ctx = gsap.context(() => {
          // En-tête
          gsap.fromTo(".dash-header", 
              { y: -20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
          );

          // Stats
          gsap.fromTo(".stat-card", 
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
          );

          // Projets
          gsap.fromTo(".project-card", 
              { x: -20, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" }
          );
      }, containerRef);
      return () => ctx.revert();
  }, []);

  return (
      <div ref={containerRef} className="max-w-7xl mx-auto pb-20 pt-28 px-4">
          
          {/* EN-TÊTE */}
          <div className="dash-header opacity-0 flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                  <h1 className="text-4xl font-bold text-nexus-text mb-1">
                      Bonjour, {data.profile.firstName}
                  </h1>
                  <p className="text-nexus-concrete">
                      Voici le rapport opérationnel de vos chantiers aujourd'hui.
                  </p>
              </div>
              
              {/* WIDGET MÉTÉO RÉEL */}
              <div className="flex items-center gap-3 bg-nexus-dark px-5 py-3 rounded-xl border border-nexus-gray shadow-sm min-w-[200px]">
                  {weather ? (
                      <>
                          <CloudSun className="text-yellow-500 animate-pulse" size={28} />
                          <div>
                              <p className="text-xs text-nexus-concrete font-bold uppercase">Météo Locale</p>
                              <p className="text-nexus-text font-bold text-lg">{weather.temp}°C • {weather.condition}</p>
                          </div>
                      </>
                  ) : (
                      <>
                          <Loader2 className="text-nexus-orange animate-spin" size={24} />
                          <span className="text-sm text-nexus-concrete">Chargement météo...</span>
                      </>
                  )}
              </div>
          </div>

          {/* KPI RAPIDES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="stat-card opacity-0 bg-nexus-dark p-6 rounded-2xl border border-nexus-gray border-l-4 border-l-nexus-orange shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                      <p className="text-nexus-concrete text-xs uppercase font-bold">Chantiers Actifs</p>
                      <Briefcase className="text-nexus-orange" size={20}/>
                  </div>
                  <p className="text-4xl font-black text-nexus-text">{data.stats.activeProjects}</p>
              </div>
              
              <div className="stat-card opacity-0 bg-nexus-dark p-6 rounded-2xl border border-nexus-gray border-l-4 border-l-blue-500 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                      <p className="text-nexus-concrete text-xs uppercase font-bold">Tâches en cours</p>
                      <ClipboardList className="text-blue-500" size={20}/>
                  </div>
                  <p className="text-4xl font-black text-nexus-text">{data.stats.pendingTasks}</p>
              </div>

              <div className="stat-card opacity-0 bg-nexus-dark p-6 rounded-2xl border border-nexus-gray border-l-4 border-l-red-500 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                      <p className="text-nexus-concrete text-xs uppercase font-bold">Alertes / Retards</p>
                      <AlertTriangle className="text-red-500" size={20}/>
                  </div>
                  <p className="text-4xl font-black text-nexus-text">0</p>
              </div>
          </div>

          {/* LISTE DES PROJETS ASSIGNÉS */}
          <h2 className="text-2xl font-bold text-nexus-text mb-6 flex items-center gap-2">
              <HardHat className="text-nexus-orange"/> Mes Chantiers
          </h2>

          <div className="grid gap-6">
              {data.projects.map((project: any) => (
                  <div key={project.id} className="project-card opacity-0 bg-nexus-dark border border-nexus-gray rounded-2xl p-6 hover:border-nexus-orange/50 transition-all group shadow-xl">
                      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                          
                          {/* Info */}
                          <div>
                              <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                      EN COURS
                                  </span>
                                  <span className="text-nexus-concrete text-sm flex items-center gap-1">
                                      <MapPin size={14}/> {project.location}
                                  </span>
                              </div>
                              <h3 className="text-2xl font-bold text-nexus-text group-hover:text-nexus-orange transition-colors">
                                  {project.name}
                              </h3>
                              <p className="text-nexus-concrete mt-1 line-clamp-1 max-w-md">{project.description}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-4">
                              <div className="text-right hidden lg:block mr-4">
                                  <p className="text-xs text-nexus-concrete uppercase font-bold mb-1">Dernière mise à jour</p>
                                  <p className="text-nexus-text font-mono">{new Date(project.updatedAt).toLocaleDateString()}</p>
                              </div>
                              <Link 
                                  href={`/dashboard/manager/projects/${project.id}`} 
                                  className="px-6 py-3 bg-nexus-text text-nexus-black font-bold rounded-xl hover:bg-nexus-orange transition-all flex items-center gap-2 shadow-lg"
                              >
                                  Gérer le chantier <ArrowRight size={18}/>
                              </Link>
                          </div>
                      </div>
                      
                      {/* Barre progression visuelle (CONNECTÉE AUX DONNÉES) */}
                      <div className="mt-6 pt-4 border-t border-nexus-gray/50 flex items-center gap-4">
                          <span className="text-xs font-bold text-nexus-concrete uppercase">Avancement</span>
                          <div className="flex-1 h-3 bg-nexus-black rounded-full overflow-hidden border border-nexus-gray">
                              <div 
                                  className="h-full bg-gradient-to-r from-nexus-orange to-yellow-500 transition-all duration-1000 ease-out"
                                  style={{ width: `${project.progress || 0}%` }}
                              ></div>
                          </div>
                          <span className="text-sm font-bold text-nexus-text w-10 text-right">{project.progress || 0}%</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
}