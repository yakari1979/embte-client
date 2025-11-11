"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Briefcase, UserCog, ChevronDown, CheckCircle, XCircle, LogIn } from 'lucide-react';

// --- SOUS-COMPOSANT : Accordéon pour les sections (inchangé) ---
const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 font-semibold text-lg"
            >
                <span>{title}</span>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pb-4 text-text-secondary space-y-2">{children}</div>
                </div>
            </div>
        </div>
    );
};

// --- SOUS-COMPOSANT : Table des Permissions (CORRIGÉ POUR ÊTRE RESPONSIVE) ---
const PermissionTable: React.FC<{ canDo: string[]; cannotDo: string[] }> = ({ canDo, cannotDo }) => (
    // La grille passe à 1 colonne sur mobile, et 2 colonnes sur écrans moyens et plus
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">Ce que vous POUVEZ faire</h4>
            <ul className="space-y-2 text-sm">
                {canDo.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">Ce que vous NE POUVEZ PAS faire</h4>
            <ul className="space-y-2 text-sm">
                {cannotDo.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// --- COMPOSANT PRINCIPAL DE LA PAGE (CORRIGÉ POUR ÊTRE RESPONSIVE) ---
const DocumentationPage = () => {
    const [activeTab, setActiveTab] = useState('student');

    const tabs = [
        { id: 'student', label: 'Étudiant', icon: <GraduationCap size={18} /> },
        { id: 'teacher', label: 'Enseignant', icon: <Briefcase size={18} /> },
        { id: 'admin', label: 'Admin', icon: <UserCog size={18} /> }, // Label plus court pour mobile
    ];

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:py-12 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* --- En-tête de la page (ajusté) --- */}
                    <div className="text-center mb-8 md:mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">Guide d'Utilisation PENI</h1>
                        <p className="text-base md:text-lg text-text-secondary">Tout ce que vous devez savoir pour maîtriser la plateforme.</p>
                    </div>

                    {/* --- Navigation par Onglets (ajustée) --- */}
                    <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold border-b-2 -mb-px text-sm sm:text-base ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                {tab.icon}
                                {/* Sur très petit écran, on peut cacher le label si besoin, mais ici on le garde */}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* --- Contenu des Onglets (ajusté) --- */}
                    <div className="bg-surface p-4 sm:p-8 rounded-lg shadow-md">
                        {/* Contenu pour chaque onglet... */}
                        {/* Le contenu interne ne change pas, car il est déjà fluide. */}
                        {activeTab === 'student' && (
                            <div className="space-y-4">
                                <AccordionItem title="Premiers Pas et Connexion" defaultOpen>
                                    <p>Votre compte est créé par l'administrateur de votre établissement. Il vous fournira un <strong>Identifiant unique</strong> (ex: `lcm-eleve-123456`) et un <strong>mot de passe temporaire</strong>.</p>
                                    <p>Il est fortement recommandé de changer votre mot de passe après votre première connexion.</p>
                                </AccordionItem>
                                <AccordionItem title="Le Tableau de Bord">
                                    <p>C'est votre page d'accueil. Elle vous montre vos <strong>notifications</strong> (nouvelles notes) et la liste de vos <strong>cours pour la journée</strong>, avec des boutons pour les rejoindre ou voir leur bilan.</p>
                                </AccordionItem>
                                <AccordionItem title="La Page 'Mes Cours'">
                                    <p>Visualisez votre <strong>emploi du temps complet</strong>, les <strong>ressources</strong> de cours, le nom de vos <strong>professeurs</strong> et la liste de vos <strong>camarades</strong>.</p>
                                </AccordionItem>
                                <AccordionItem title="La Page 'Mes Notes'">
                                    <p>Consultez toutes vos notes, groupées par matière. Pour chaque discipline, vous verrez votre <strong>moyenne actuelle</strong> et les tableaux détaillés de vos <strong>TD</strong> et <strong>Devoirs</strong>.</p>
                                </AccordionItem>
                            </div>
                        )}
                        
                        {activeTab === 'teacher' && (
                            <div className="space-y-4">
                                <AccordionItem title="Accès et Rôle" defaultOpen>
                                    <p>Votre compte est créé par votre administrateur. Vous vous connectez avec un <strong>Identifiant unique</strong> (ex: `lmr-prof-789`) et un mot de passe temporaire à modifier.</p>
                                </AccordionItem>
                                <AccordionItem title="La Page 'Suivi & Notes'">
                                    <p>Après avoir sélectionné une classe, la plateforme n'affiche **que les colonnes de notes des matières que vous enseignez**. Vous pouvez ajouter des évaluations et saisir les notes en toute confidentialité.</p>
                                </AccordionItem>
                                <AccordionItem title="La Salle de Classe Virtuelle">
                                    <p>Vous avez le plein contrôle : démarrez/arrêtez le cours, partagez votre écran ou des documents, gérez le chat et les micros. Chaque cours est automatiquement enregistré.</p>
                                </AccordionItem>
                            </div>
                        )}
                        
                        {activeTab === 'admin' && (
                            <div className="space-y-4">
                                <AccordionItem title="Le Rôle d'Architecte" defaultOpen>
                                    <p>Vous êtes le pilote de l'espace numérique de votre établissement. Votre mission est de créer les comptes, structurer les classes et définir les emplois du temps.</p>
                                </AccordionItem>
                                <AccordionItem title="Gestion des Utilisateurs">
                                    <p>Le système génère automatiquement un <strong>identifiant unique</strong> et un <strong>mot de passe temporaire</strong> pour chaque nouvel utilisateur. Vous pouvez également réinitialiser le mot de passe de n'importe qui en cas d'oubli.</p>
                                </AccordionItem>
                                <AccordionItem title="Vos Permissions : Pouvoirs et Limites">
                                    <PermissionTable 
                                        canDo={["Créer et gérer tous les comptes et toutes les classes.", "Définir et modifier tous les emplois du temps.", "Réinitialiser le mot de passe de n'importe quel utilisateur.", "Voir les statistiques globales de l'établissement."]}
                                        cannotDo={["Consulter les notes ou appréciations d'un élève.", "Accéder au contenu d'une salle de classe virtuelle.", "Lire les messages de chat d'un cours.", "Gérer les données d'un autre établissement."]}
                                    />
                                </AccordionItem>
                            </div>
                        )}
                    </div>
                    <div className="mt-10 text-center">
                        <Link href="/" className="btn-secondary w-auto">
                            <LogIn className="h-4 w-4" />
                            <span>Retour à la connexion</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentationPage;