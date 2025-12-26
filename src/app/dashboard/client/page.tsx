'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { 
  MapPin, Calendar, DollarSign, FileText, Send, Ruler, Home, Hammer,
  Loader2, CheckCircle2, TrendingUp, CreditCard, ArrowUpRight, 
  Building, Phone, ShieldCheck, HardHat, Users, CloudSun, ImageIcon, Mail, ArrowLeft, ArrowRight, Clock, X
} from 'lucide-react';
import { clientService } from '@/services/api';
import dynamic from 'next/dynamic';

const ConstructionScene = dynamic(() => import('@/components/ConstructionScene'), { ssr: false });

// --- TYPES POUR LE DASHBOARD ---
export default function SmartClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const data = await clientService.getMyProject();
        setProject(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-nexus-black"><Loader2 className="animate-spin text-nexus-orange w-12 h-12"/></div>;

  if (!project) return <MultiStepOrderForm onProjectCreated={(p) => setProject(p)} />;
  if (project.status === 'PENDING') return <PendingProjectView />;
  return <ActiveDashboard project={project} />;
}

// ============================================================================
// COMPOSANT 1 : FORMULAIRE MULTI-ÉTAPES (WIZARD)
// ============================================================================
function MultiStepOrderForm({ onProjectCreated }: { onProjectCreated: (p:any)=>void }) {
  const container = useRef(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  // État géant pour tout le formulaire
  const [formData, setFormData] = useState({
    // Étape 1 : Général & Foncier
    projectType: 'Résidentiel',
    objective: 'Habitation personnelle',
    urgency: 'Immédiat',
    location: '',
    surface: '',
    legalStatus: 'Titre Foncier',
    isOwner: 'Oui',
    
    // Étape 2 : Urbanisme & Technique
    zoneType: 'Urbaine',
    accessType: 'Route goudronnée',
    utilities: [] as string[],
    soilStudy: 'Non',
    
    // Étape 3 : Bâtiment & Finition
    buildingType: 'Maison basse',
    floors: '0',
    standing: 'Standard',
    budget: '',
    startDate: '',
    
    // Étape 4 : Contact & Description
    clientPhone: '',
    contactPref: 'Whatsapp',
    description: ''
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".step-anim", { x: 50, opacity: 0, duration: 0.5, ease: "power2.out" });
    }, container);
    return () => ctx.revert();
  }, [step]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleUtility = (utility: string) => {
    setFormData(prev => {
      const current = prev.utilities;
      if (current.includes(utility)) return { ...prev, utilities: current.filter(u => u !== utility) };
      return { ...prev, utilities: [...current, utility] };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        isOwner: formData.isOwner === 'Oui',
        soilStudy: formData.soilStudy === 'Oui',
        hasElevator: false
      };
      const newProject = await clientService.createOrder(payload);
      onProjectCreated(newProject);
    } catch (err) {
      alert("Erreur lors de l'envoi. Vérifiez votre connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    // CORRECTION : pt-28 pour pousser le contenu sous la Navbar
    <div ref={container} className="max-w-4xl mx-auto pb-20 pt-28 px-4">
      
      {/* Barre de progression */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-nexus-text mb-2 text-center">Configuration du Projet</h1>
        <div className="flex justify-center items-center gap-4 text-sm font-medium text-nexus-concrete mb-6">
            <span className={step >= 1 ? "text-nexus-orange" : ""}>1. Général</span>
            <span className="w-8 h-[2px] bg-nexus-gray"/>
            <span className={step >= 2 ? "text-nexus-orange" : ""}>2. Terrain</span>
            <span className="w-8 h-[2px] bg-nexus-gray"/>
            <span className={step >= 3 ? "text-nexus-orange" : ""}>3. Bâtiment</span>
            <span className="w-8 h-[2px] bg-nexus-gray"/>
            <span className={step >= 4 ? "text-nexus-orange" : ""}>4. Validation</span>
        </div>
        <div className="w-full h-2 bg-nexus-dark rounded-full overflow-hidden">
            <div 
                className="h-full bg-nexus-orange transition-all duration-500 ease-out" 
                style={{ width: `${step * 25}%` }}
            />
        </div>
      </div>

      <div className="bg-nexus-dark p-6 md:p-10 rounded-3xl border border-nexus-gray shadow-2xl step-anim min-h-[500px] flex flex-col justify-between">
        
        {/* --- ETAPE 1 : GÉNÉRAL & FONCIER --- */}
        {step === 1 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-nexus-text flex items-center gap-2">
                    <Home className="text-nexus-orange"/> Objectifs & Foncier
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <SelectField label="Type de projet" value={formData.projectType} onChange={(v) => handleChange('projectType', v)} options={['Résidentiel', 'Commercial', 'Rénovation', 'Industriel']} />
                    <SelectField label="Objectif" value={formData.objective} onChange={(v) => handleChange('objective', v)} options={['Habitation personnelle', 'Investissement Locatif', 'Vente', 'Mixte']} />
                    <SelectField label="Urgence" value={formData.urgency} onChange={(v) => handleChange('urgency', v)} options={['Immédiat (< 1 mois)', 'Court terme (3 mois)', 'Moyen terme (6 mois+)', 'Indéfini']} />
                    <InputField label="Localisation (Ville/Quartier)" value={formData.location} onChange={(v) => handleChange('location', v)} placeholder="Ex: Dakar, Almadies" />
                </div>

                <div className="border-t border-nexus-gray pt-6">
                    <h3 className="text-lg font-bold text-nexus-text mb-4">Statut Juridique (Important)</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <SelectField label="Nature du titre" value={formData.legalStatus} onChange={(v) => handleChange('legalStatus', v)} options={['Titre Foncier (TF)', 'Bail', 'Délibération Mairie', 'Acte Administratif', 'Pas encore de papiers']} />
                        <SelectField label="Êtes-vous propriétaire ?" value={formData.isOwner} onChange={(v) => handleChange('isOwner', v)} options={['Oui', 'Non', 'En cours d\'acquisition']} />
                        <InputField label="Superficie Terrain (m²)" value={formData.surface} onChange={(v) => handleChange('surface', v)} type="number" placeholder="300" />
                    </div>
                </div>
            </div>
        )}

        {/* --- ETAPE 2 : URBANISME & TECHNIQUE --- */}
        {step === 2 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-nexus-text flex items-center gap-2">
                    <MapPin className="text-blue-500"/> Urbanisme & Terrain
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <SelectField label="Zone" value={formData.zoneType} onChange={(v) => handleChange('zoneType', v)} options={['Urbaine (Ville)', 'Périurbaine (Banlieue)', 'Rurale', 'Bord de mer']} />
                    <SelectField label="Type d'accès" value={formData.accessType} onChange={(v) => handleChange('accessType', v)} options={['Route goudronnée', 'Piste carrossable', 'Sable / Difficile', 'Pas d\'accès véhicule']} />
                    <SelectField label="Étude de sol réalisée ?" value={formData.soilStudy} onChange={(v) => handleChange('soilStudy', v)} options={['Oui', 'Non', 'Je ne sais pas']} />
                </div>

                <div className="border-t border-nexus-gray pt-6">
                    <h3 className="text-lg font-bold text-nexus-text mb-4">Réseaux disponibles</h3>
                    <div className="flex flex-wrap gap-3">
                        {['Eau (SDE)', 'Électricité (Senelec)', 'Assainissement (ONAS)', 'Fibre Optique'].map(u => (
                            <button 
                                key={u}
                                onClick={() => toggleUtility(u)}
                                className={`px-4 py-2 rounded-full border transition-all ${
                                    formData.utilities.includes(u) 
                                    ? 'bg-nexus-orange text-black border-nexus-orange font-bold' 
                                    : 'bg-transparent text-nexus-concrete border-nexus-gray hover:border-nexus-text hover:text-nexus-text'
                                }`}
                            >
                                {u}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* --- ETAPE 3 : BÂTIMENT & FINITIONS --- */}
        {step === 3 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-nexus-text flex items-center gap-2">
                    <Building className="text-green-500"/> Le Bâtiment
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <SelectField label="Type de construction" value={formData.buildingType} onChange={(v) => handleChange('buildingType', v)} options={['Maison basse', 'Villa R+1', 'Immeuble R+2', 'Immeuble R+3', 'Immeuble R+4 ou plus']} />
                    <SelectField label="Standing (Finitions)" value={formData.standing} onChange={(v) => handleChange('standing', v)} options={['Économique', 'Standard', 'Haut Standing (Luxe)']} />
                    <InputField label="Nombre de niveaux (Étages)" value={formData.floors} onChange={(v) => handleChange('floors', v)} type="number" placeholder="1" />
                </div>

                <div className="border-t border-nexus-gray pt-6">
                    <h3 className="text-lg font-bold text-nexus-text mb-4">Planification</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="Budget Estimatif (FCFA)" value={formData.budget} onChange={(v) => handleChange('budget', v)} type="number" placeholder="50 000 000" />
                        <InputField label="Date de démarrage souhaitée" value={formData.startDate} onChange={(v) => handleChange('startDate', v)} type="date" placeholder="" />
                    </div>
                </div>
            </div>
        )}

        {/* --- ETAPE 4 : CONTACT & VALIDATION --- */}
        {step === 4 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-nexus-text flex items-center gap-2">
                    <Phone className="text-purple-500"/> Contact & Détails
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Numéro de Téléphone" value={formData.clientPhone} onChange={(v) => handleChange('clientPhone', v)} placeholder="+221 77 ..." />
                    <SelectField label="Préférence de contact" value={formData.contactPref} onChange={(v) => handleChange('contactPref', v)} options={['Whatsapp', 'Appel Téléphonique', 'Email', 'Rendez-vous physique']} />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-bold text-nexus-concrete uppercase mb-2">Description libre & Besoins spécifiques</label>
                    <textarea 
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Parlez-nous de votre projet : nombre de chambres, piscine, style architectural..."
                        className="w-full bg-nexus-black border border-nexus-gray rounded-xl p-4 text-nexus-text focus:border-nexus-orange outline-none transition-colors"
                    />
                </div>

                <div className="bg-nexus-orange/10 p-4 rounded-xl border border-nexus-orange/30 mt-4">
                    <p className="text-sm text-nexus-orange flex gap-2">
                        <ShieldCheck className="shrink-0"/>
                        Vos données sont confidentielles. En cliquant sur valider, un ingénieur de NexusBTP analysera votre dossier sous 24h.
                    </p>
                </div>
            </div>
        )}

        {/* --- BOUTONS DE NAVIGATION --- */}
        <div className="flex justify-between mt-8 pt-6 border-t border-nexus-gray">
            {step > 1 ? (
                <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-nexus-gray text-nexus-text hover:bg-nexus-text/10 flex items-center gap-2 font-bold">
                    <ArrowLeft size={18}/> Précédent
                </button>
            ) : <div/>}

            {step < 4 ? (
                <button onClick={nextStep} className="bg-nexus-text text-nexus-black px-8 py-3 rounded-xl font-bold hover:bg-nexus-orange transition-colors flex items-center gap-2">
                    Suivant <ArrowRight size={18}/>
                </button>
            ) : (
                <button 
                    onClick={handleSubmit} 
                    disabled={submitting}
                    className="bg-nexus-orange text-black px-10 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Traitement..." : <>Valider la commande <Send size={18}/></>}
                </button>
            )}
        </div>

      </div>
    </div>
  );
}


// ============================================================================
// COMPOSANT 2 : VUE "EN ATTENTE"
// ============================================================================
function PendingProjectView() {
  return (
    // CORRECTION : Padding top augmenté pour la Navbar fixe
    <div className="h-screen flex flex-col lg:flex-row items-center justify-center gap-10 p-4 pt-20">
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative rounded-3xl overflow-hidden border border-nexus-gray/50 shadow-2xl bg-nexus-dark">
            <ConstructionScene />
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-nexus-orange font-mono text-xs animate-pulse">
                STATUS: ANALYZING_DATA...
            </div>
        </div>
        <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/20 mb-6">
                <Loader2 className="animate-spin" size={18}/>
                <span className="font-bold text-sm uppercase tracking-wide">Dossier technique reçu</span>
            </div>
            {/* CORRECTION : text-nexus-text au lieu de text-white */}
            <h1 className="text-4xl lg:text-6xl font-black text-nexus-text mb-6">Projet<br/>en cours d'étude.</h1>
            <p className="text-lg text-nexus-concrete leading-relaxed max-w-lg mb-8">
                Vos informations foncières et techniques ont bien été transmises. Nos ingénieurs vérifient actuellement la faisabilité et préparent votre devis estimatif.
            </p>
            <div className="flex flex-col gap-4 text-sm text-nexus-concrete bg-nexus-dark p-6 rounded-2xl border border-nexus-gray">
                <div className="flex justify-between items-center">
                    <span>Vérification Titre Foncier</span>
                    <span className="text-yellow-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> En cours</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Analyse Urbanisme</span>
                    <span className="text-nexus-concrete/50">En attente</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Chiffrage Matériaux</span>
                    <span className="text-nexus-concrete/50">En attente</span>
                </div>
            </div>
        </div>
    </div>
  );
}


// ============================================================================
// VUE DASHBOARD ACTIF (LIVE & INTERACTIVE)
// ============================================================================
function ActiveDashboard({ project }: { project: any }) {
  const container = useRef(null);
  
  // États pour la météo et la popup
  const [weather, setWeather] = useState<{temp: number, condition: string} | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // 1. Détection Météo Automatique (Open-Meteo API gratuite)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const data = await res.json();
          setWeather({
            temp: data.current_weather.temperature,
            condition: "En direct" // L'API simple ne donne pas toujours la condition texte, on simplifie
          });
        } catch (e) {
          console.error("Erreur météo", e);
        }
      });
    }
  }, []);

  // 2. Animations GSAP
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".dash-header", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(".dash-card", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  // 3. Calculs Vraies Données
  const paidAmount = 0; // À connecter plus tard
  const progress = project.progress || 0; // Vraie donnée de la DB
  
  // Calcul date de fin estimée (Basé sur startDate + 6 mois par défaut)
  const startDate = new Date(project.startDate);
  const estimatedEndDate = new Date(startDate);
  estimatedEndDate.setMonth(startDate.getMonth() + 6);
  
  const daysRemaining = Math.ceil((estimatedEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  // Filtrer uniquement les rapports VALIDÉS
  const validatedReports = project.reports?.filter((r: any) => r.status === 'REVIEWED') || [];

  return (
    <div ref={container} className="max-w-7xl mx-auto pb-20 pt-28 px-4 relative">
      
      {/* 1. HEADER */}
      <div className="dash-header flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Chantier Actif
             </span>
             <span className="text-nexus-concrete text-sm flex items-center gap-1">
                <MapPin size={14}/> {project.location}
             </span>
          </div>
          <h1 className="text-4xl font-bold text-nexus-text mb-2">{project.name}</h1>
          <p className="text-nexus-concrete max-w-xl">
            Suivez l'avancement de votre construction en temps réel.
          </p>
        </div>
        
        {/* --- BLOC CORRIGÉ : PROFIL CLIENT --- */}
        <div className="flex items-center gap-4 bg-nexus-dark p-2 pr-6 rounded-full border border-nexus-gray shadow-lg hover:border-nexus-orange/50 transition-all cursor-default">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nexus-orange to-yellow-500 flex items-center justify-center text-black font-bold text-lg shadow-md border-2 border-nexus-black uppercase">
                {/* Initiales du client */}
                {project.client?.firstName?.[0]}{project.client?.lastName?.[0]}
            </div>
            <div>
                <p className="text-xs text-nexus-concrete font-bold uppercase tracking-wider mb-0.5">Propriétaire</p>
                <p className="text-nexus-text font-bold text-sm truncate max-w-[150px]">
                    {/* Nom complet du client */}
                    {project.client ? `${project.client.firstName} ${project.client.lastName}` : "Client"}
                </p>
            </div>
        </div>
        {/* ----------------------------------- */}
      </div>

      {/* 2. GRILLE PRINCIPALE */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* A. PROGRESSION (Données Réelles) */}
        <div className="dash-card col-span-1 md:col-span-2 bg-nexus-dark border border-nexus-gray rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
            <TrendingUp size={150} />
          </div>
          <h3 className="text-nexus-concrete font-bold uppercase tracking-wider text-xs mb-6">Avancement Global</h3>
          
          <div className="flex items-end gap-4 mb-6">
            <span className="text-7xl font-black text-nexus-text">{progress}%</span>
            <div className="mb-2">
                <span className="text-green-500 font-bold flex items-center gap-1 text-sm bg-green-500/10 px-2 py-1 rounded">
                    <ArrowUpRight size={14} /> Phase active
                </span>
            </div>
          </div>
          
          <div className="w-full h-4 bg-nexus-black rounded-full overflow-hidden border border-nexus-gray/50">
            <div 
                className="h-full bg-gradient-to-r from-nexus-orange to-yellow-500 transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-4 text-sm text-nexus-concrete">
            Date de fin estimée : <span className="text-nexus-text font-bold">{estimatedEndDate.toLocaleDateString()}</span> 
            <span className="opacity-50"> ({daysRemaining > 0 ? `${daysRemaining} jours restants` : "Terminé"})</span>
          </p>
        </div>

        {/* B. BUDGET */}
        <div className="dash-card col-span-1 bg-nexus-dark border border-nexus-gray rounded-3xl p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <h3 className="text-nexus-concrete font-bold uppercase tracking-wider text-xs">Finances</h3>
             <div className="p-2 bg-nexus-black rounded-lg text-green-500"><DollarSign size={20}/></div>
          </div>
          
          <div className="mt-4">
             <p className="text-nexus-concrete text-xs mb-1">Budget Total</p>
             <p className="text-2xl font-bold text-nexus-text">{project.budget.toLocaleString()} <span className="text-sm font-normal text-nexus-concrete">FCFA</span></p>
          </div>

          <div className="space-y-3 mt-6 pt-6 border-t border-nexus-gray/50">
             <div className="flex justify-between text-sm">
                <span className="text-nexus-concrete">Payé</span>
                <span className="text-nexus-text font-bold">{paidAmount} FCFA</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-nexus-concrete">Reste</span>
                <span className="text-nexus-orange font-bold">{(project.budget - paidAmount).toLocaleString()} FCFA</span>
             </div>
          </div>
        </div>

        {/* C. MÉTÉO LIVE */}
        <div className="dash-card col-span-1 bg-gradient-to-br from-blue-600/20 to-nexus-dark border border-blue-500/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
            {weather ? (
                <>
                    <CloudSun size={48} className="text-yellow-400 mb-4 animate-pulse"/>
                    <h3 className="text-3xl font-bold text-nexus-text mb-1">{weather.temp}°C</h3>
                    <p className="text-blue-200 font-medium">{weather.condition}</p>
                    <p className="text-xs text-nexus-concrete mt-2 uppercase tracking-wide flex items-center gap-1">
                        <MapPin size={12}/> Localisation Live
                    </p>
                </>
            ) : (
                <div className="text-nexus-concrete flex flex-col items-center">
                    <Loader2 className="animate-spin mb-2" size={24}/>
                    <span className="text-xs">Chargement météo...</span>
                </div>
            )}
        </div>

        {/* D. ÉQUIPE */}
        <div className="dash-card col-span-1 md:col-span-2 bg-nexus-dark border border-nexus-gray rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-nexus-concrete font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                    <Users size={16}/> L'Équipe sur place
                </h3>
                <span className="text-xs bg-nexus-black px-2 py-1 rounded text-nexus-text border border-nexus-gray">
                    {1 + (project.workers?.length || 0)} Personnes
                </span>
            </div>

            <div className="space-y-4">
                {project.manager ? (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-nexus-black border border-nexus-gray hover:border-nexus-orange/50 transition-colors group">
                        <div className="w-12 h-12 rounded-full bg-nexus-orange text-black flex items-center justify-center font-bold text-lg shadow-lg">
                            {project.manager.firstName[0]}{project.manager.lastName[0]}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-nexus-orange font-bold uppercase mb-0.5">Chef de Chantier</p>
                            <h4 className="text-nexus-text font-bold">{project.manager.firstName} {project.manager.lastName}</h4>
                        </div>
                        <a href={`tel:${project.manager.phone}`} className="p-3 bg-nexus-dark rounded-xl text-nexus-concrete hover:text-white hover:bg-white/10 transition-colors">
                            <Phone size={18}/>
                        </a>
                    </div>
                ) : (
                    <div className="p-4 rounded-2xl bg-nexus-black border border-nexus-gray border-dashed text-nexus-concrete text-sm text-center">
                        Chef de chantier en cours d'affectation.
                    </div>
                )}

                {/* Ouvriers */}
                {project.workers && project.workers.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {project.workers.map((worker: any) => (
                            <div key={worker.id} className="flex items-center gap-3 p-3 rounded-xl bg-nexus-black/50 border border-nexus-gray hover:bg-nexus-black transition-colors">
                                <div className="w-8 h-8 rounded-full bg-nexus-dark border border-nexus-gray flex items-center justify-center text-nexus-concrete text-xs font-bold">
                                    {worker.firstName[0]}{worker.lastName[0]}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-nexus-text truncate">{worker.firstName}</p>
                                    <p className="text-[10px] text-nexus-concrete uppercase truncate">{worker.jobTitle || "Ouvrier"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-nexus-concrete italic pl-2">Équipe technique en cours de constitution.</p>
                )}
            </div>
        </div>

        {/* F. ACTIVITÉ RÉCENTE (FILTRÉE & INTERACTIVE) */}
        <div className="dash-card col-span-1 md:col-span-2 lg:col-span-4 bg-nexus-dark border border-nexus-gray rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-nexus-concrete font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                    <ImageIcon size={16}/> Activité Récente (Validée)
                </h3>
            </div>

            {validatedReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {validatedReports.map((report: any) => {
                        const media = JSON.parse(report.media || "[]");
                        const firstImage = media.find((m:any) => m.type === 'IMAGE');
                        
                        // Si pas d'image, on ne l'affiche pas dans la galerie ou on met une icône
                        if (!firstImage) return null;

                        return (
                            <div 
                                key={report.id} 
                                onClick={() => setSelectedReport(report)}
                                className="group relative aspect-video rounded-xl overflow-hidden bg-nexus-black border border-nexus-gray cursor-pointer hover:border-nexus-orange transition-all"
                            >
                                <img src={`http://localhost:3001${firstImage.url}`} alt="Chantier" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                <div className="absolute bottom-3 left-4 right-4">
                                    <p className="text-white text-xs font-bold line-clamp-1">{report.content}</p>
                                    <p className="text-nexus-concrete text-[10px] mt-0.5">{new Date(report.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="text-white" size={20}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="p-12 bg-nexus-black/30 border border-nexus-gray border-dashed rounded-xl text-center flex flex-col items-center justify-center">
                    <ImageIcon size={40} className="text-nexus-concrete/30 mb-3"/>
                    <p className="text-nexus-concrete text-sm">Aucune activité validée à afficher pour le moment.</p>
                </div>
            )}
        </div>

      </div>

      {/* MODAL DÉTAILS RAPPORT */}
      {selectedReport && (
        <ClientReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

    </div>
  );
}

// ============================================================================
// MODAL DÉTAILS (VERSION CLIENT LECTURE SEULE)
// ============================================================================
function ClientReportModal({ report, onClose }: any) {
    const mediaFiles = JSON.parse(report.media || "[]");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in">
            <div className="bg-nexus-dark border border-nexus-gray w-full max-w-3xl rounded-3xl p-0 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-nexus-gray flex justify-between items-center bg-nexus-black/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                            <CheckCircle2 size={20}/>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-nexus-text">Rapport Validé</h2>
                            <p className="text-nexus-concrete text-xs flex items-center gap-2">
                                <Clock size={12}/> {new Date(report.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-nexus-concrete hover:text-white transition-colors">
                        <X size={24}/>
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <p className="text-nexus-text text-lg leading-relaxed mb-8">{report.content}</p>

                    {/* Météo au moment du rapport */}
                    {report.weather && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/20 mb-8">
                            <CloudSun size={16}/> Météo relevée : {report.weather}
                        </div>
                    )}

                    {/* Galerie */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mediaFiles.map((file: any, index: number) => (
                            <div key={index} className="space-y-2">
                                {file.type === 'IMAGE' ? (
                                    <a href={`http://localhost:3001${file.url}`} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border border-nexus-gray hover:border-nexus-orange transition-colors">
                                        <img src={`http://localhost:3001${file.url}`} alt="Preuve" className="w-full h-auto"/>
                                    </a>
                                ) : (
                                    <a href={`http://localhost:3001${file.url}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-nexus-black border border-nexus-gray hover:border-nexus-orange transition-colors">
                                        <FileText className="text-nexus-concrete"/>
                                        <span className="text-nexus-text text-sm truncate">{file.name}</span>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SOUS-COMPOSANTS INPUTS
// ============================================================================

interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: string[];
}

const InputField = ({ label, value, onChange, type="text", placeholder }: InputProps) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            className="w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3.5 text-nexus-text focus:border-nexus-orange outline-none transition-colors focus:ring-1 focus:ring-nexus-orange/50"
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }: SelectProps) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-nexus-concrete uppercase tracking-wider">{label}</label>
        <div className="relative">
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-nexus-black border border-nexus-gray rounded-xl px-4 py-3.5 text-nexus-text appearance-none focus:border-nexus-orange outline-none cursor-pointer"
            >
                {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-4 top-4 text-nexus-concrete pointer-events-none">▼</div>
        </div>
    </div>
);